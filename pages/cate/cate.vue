<template>
	<view>
		<MySearch @click="gotoSearch"></MySearch>
		
		<view class="scroll-view-container">
			<!-- 一级分类 -->
			<scroll-view scroll-y class="left-scroll-view" :style="{height: winHeight+'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view
					 :class="['left-scroll-view-item', active === i ? 'active' : '']" 
					 @click="changeActive(i)"
					>{{item.cat_name}}</view>
				</block>
			</scroll-view>
			
			<scroll-view
			 scroll-y 
			 class="right-scroll-view" 
			 :style="{height: winHeight+'px'}" 
			 :scroll-top="scrollTop"
			>
				<!-- 二级分类 -->
				<view class="cate-lv2" v-for="(item, i) in cateLevel2" :key="i">
					<view class="cate-lv2-title">/ {{item.cat_name}} /</view>
					<!-- 三级分类 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item"
							v-for="(item2, i2) in item.children"
							:key="i2"
							@click="gotoGoodsList(item2)"
						>
							<image :src="item2.cat_icon"></image>
							<text>{{item2.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				winHeight: 0,
				cateList: [],
				active: 0,
				cateLevel2: [],
				scrollTop: 0
			};
		},
		onLoad(){
			const sysInfo = uni.getSystemInfoSync()
			this.winHeight = sysInfo.windowHeight - 50
			
			this.getCateList()
		},
		methods:{
			// 获取三级分类的数据
			async getCateList(){
				const {data:res} = await uni.$http.get('/api/public/v1/categories')
				
				if(res.meta.status !== 200){
					return uni.showToast({
						title:'数据响应失败！',
						duration:1500,
						icon:'none'
					})
				}else{
					this.cateList = res.message
					this.cateLevel2 = this.cateList[0].children
				}
			},
			
			// 切换一级菜单active
			changeActive(i){
				this.active = i
				
				this.cateLevel2 = this.cateList[i].children
				
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			
			// 跳转到分包下的商品列表
			gotoGoodsList(item){
				uni.navigateTo({
					url: '../../subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
			},
			
			// 跳转到分包下的搜索页面
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container{
		display: flex;
		
		.left-scroll-view{
			width: 120px;
			
			.left-scroll-view-item{
				background-color: #f7f7f7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;
				
				&.active{
					background-color: #fff;
					position: relative;
					
					&::before{
						content:"";
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}
		
		.right-scroll-view{
			background-color: #fff;
			
			.cate-lv2-title{
				font-size: 12px;
				font-weight: bold;
				text-align: center;
				padding: 15px 0;
			}
			
			.cate-lv3-list{
				display: flex;
				flex-wrap: wrap;
				
				.cate-lv3-item{
					width: 33.33%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin-bottom: 10px;
					
					image{
						width: 120rpx;
						height: 120rpx;
					}
				}
			}
		}
	}
</style>
