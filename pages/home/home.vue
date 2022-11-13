<template>
	<view>
		<view class="search-box">
			<MySearch @click="gotoSearch"></MySearch>
		</view>
		
		<view>
			<!-- 首页轮播图 -->
			<swiper
			 :indicator-dots="true" 
			 :autoplay="true" 
			 :interval="3000" 
			 :duration="1000" 
			 :circular="true"
			>
				<swiper-item v-for="item in swiperList" :key="item.goods_id">
					<navigator class="swiper-item" :url="'/subpkg/detail/detail?goods_id=' + item.goods_id">
						<image :src="item.image_src"></image>
					</navigator>
				</swiper-item>
			</swiper>
			
			<!-- 导航菜单 -->
			<view class="nav-list">
				<view
				 class="nav-item" 
				 v-for="(item,index) in navList" 
				 :key="index"
				 @click="navClickHandler(item)"
				>
					<image :src="item.image_src" class="nav-img"></image>
				</view>
			</view>
			
			<!-- 商品楼层 -->
			<view class="floor-list">
				<view class="floor-item" v-for="(item,index) in floorList" :key="index">
					<!-- 标题 -->
					<image :src="item.floor_title.image_src" class="floor-title"></image>	
					<view class="floor-img-box">
						<!-- 左侧大图 -->
						<navigator class="left-img-box" :url="item.product_list[0].url">
							<image
							 :src="item.product_list[0].image_src" 
							 :style="{width: item.product_list[0].image_width + 'rpx'}" 
							 mode="widthFix"
							></image>
						</navigator>
						<!-- 右侧小图 -->
						<view class="right-img-box">
							<navigator
							 class="right-img-item" 
							 v-for="(item2,index2) in item.product_list" 
							 :key="index2" 
							 v-if="index2!=0"
							 :url="item2.url"
							>
								<image
								 :src="item2.image_src" 
								 :style="{width: item2.image_width + 'rpx'}"
								 mode="widthFix"
								></image>
							</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList:[],
				navList:[],
				floorList:[]
			};
		},
		onLoad(){
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods:{
			// 轮播图
			async getSwiperList(){
				const {data:res} =	await uni.$http.get('/api/public/v1/home/swiperdata')
				if(res.meta.status !== 200){
					return uni.showToast({
						title:'数据响应失败！',
						duration:1500,
						icon:'none'
					})
				}else{
					this.swiperList = res.message
				}
			},
			
			// 分类导航
			async getNavList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
				if(res.meta.status !== 200){
					return uni.showToast({
						title:'数据响应失败！',
						duration:1500,
						icon:'none'
					})
				}else{
					this.navList = res.message
				}
			},
			
			// 跳转到分类tabbar页
			navClickHandler(nav){
				if(nav.name = '分类'){
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			
			// 楼层
			async getFloorList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
				if(res.meta.status !== 200){
					return uni.showToast({
						title:'数据响应失败！',
						duration:1500,
						icon:'none'
					})
				}else{
					// 修改后台每张商品图片跳转的url地址
					res.message.forEach(floor => {
						floor.product_list.forEach(prod => {
							prod.url = '/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
						})
					})
					
					this.floorList = res.message
				}
			},
			
			// 搜索组件
			gotoSearch(){
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style>
.search-box{
	position: sticky;
	top: 0;
	z-index: 999;
}	

swiper{
	height: 330rpx;
}

.swiper-item,
image{
	width: 100%;
	height: 100%;
}

.nav-list{
	display: flex;
	justify-content: space-around;
	margin: 15px 0;
}

.nav-img{
	width: 128rpx;
	height: 140rpx;
}

.floor-title{
	height: 60rpx;
	width: 100%;
	/* display: flex; */
}

.right-img-box{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.floor-img-box{
	display: flex;
	padding-left: 10rpx;
}
</style>
