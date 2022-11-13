<template>
	<view>
		<view class="search-box">
			<uni-search-bar
			 @input="input"
			 :radius="100"
			 :cancelButton="none"
			></uni-search-bar>
		</view>
		
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view
			 class="sugg-item" 
			 v-for="(item, i) in searchResults" 
			 :key="item.goods_id" 
			 @click="gotoDetail(item.goods_id)"
			>
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistoryList"</uni-icons>
			</view>
			<view class="history-list">
				<uni-tag
				 :inverted="true" 
				 :text="item" 
				 v-for="(item, i) in historys" 
				 :key="i"
				 @click="gotoGoodList(item)"
				></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				timer: null,
				searchResults: [],
				historyList: []
			}
		},
		computed: {
			historys(){
				// 基于原数组创建一个新数组再进行翻转
				return [...this.historyList].reverse()
			}
		},
		methods: {
			// 搜索框"防抖"
			input(e){
				clearTimeout(this.timer)
				
				this.timer = setTimeout(() => {
					this.keyword = e
					// console.log(this.keyword)
					this.getSearchList()
				}, 1000)
			},
			
			// 获取搜索建议数据
			async getSearchList(){
				if(this.keyword === ''){
					this.searchResults = []
					return
				}
				
				const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query: this.keyword})
				if(res.meta.status !== 200){
					return uni.showToast({
						title:'数据响应失败！',
						duration:1500,
						icon:'none'
					})
				}else{
					this.searchResults = res.message
					this.saveHistoryList();
				}
			},
			
			// 跳转到分包下的商品详情页面
			gotoDetail(id){
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
				})
			},
			
			// 保存搜索历史
			saveHistoryList(){
				// this.historyList.push(this.keyword)
				// 利用Set集合解决搜索历史关键词重复及新关键词提前
				const set = new Set(this.historyList)
				set.delete(this.keyword)
				set.add(this.keyword)
				
				this.historyList = Array.from(set)
				// 本地存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			
			// 清除搜索历史列表
			clearHistoryList(){
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
			
			gotoGoodList(kw){
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		onload(){
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		}
	}
</script>

<style lang="scss">
.search-box{
	position: sticky;
	top: 0;
	z-index: 999;
}
	
.sugg-list{
	padding: 0 5px;
	
	.sugg-item {
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.goods-name {
			/* 文字不允许换行（单行文本） */
			white-space: nowrap;
			/* 溢出部分隐藏 */
			overflow: hidden;
			/* 文本溢出后，使用 ... 代替 */
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}

.history-box{
	padding: 0 5px;
	
	.history-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
		font-size: 14px;
		border-bottom: 1px solid #efefef;
	}
	
	.history-list{
		display: flex;
		flex-wrap: wrap;
		
		.uni-tag{
			margin-top: 5px;
			margin-right: 5px;
		}
	}
}
</style>