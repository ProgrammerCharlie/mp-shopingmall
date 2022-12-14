<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods.goods_id)">
				<MyGoods :goods="goods"/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 节流阀：是否在请求数据
				isLoading: false
			};
		},
		methods: {
			async getGoodsList(cb){
				// 打开节流阀
				this.isLoading = true
				const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				console.log(res)
				// 关闭节流阀
				this.isLoading = false
				
				cb && cb()
				
				if(res.meta.status !== 200){
					return uni.showToast({ 
						title:'数据响应失败！',
						duration:1500,
						icon:'none'
					})
				}
				// 新数据加旧数据赋值给goodslist数组
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			gotoDetail(id){
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
				})
			}
		},
		onLoad(options){
			console.log(options);
			// 从其他页面跳转过来时带来的参数
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			
			this.getGoodsList()
		},
		onReachBottom(){
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total){
				return uni.showToast({
					title:'数据加载完毕！',
					duration:1500,
					icon:'none'
				})
			}
			
			// 正在请求数据直接阻止下一次请求
			if(this.isLoading) return
			// 页码值自增
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		onPullDownRefresh(){
			// 下拉刷新
			this.queryObj.pagenum = 1
			this.total = 0
			this.isLoading = false
			this.goodsList = []
			
			// 数据重新请求完毕后，关闭下拉刷新
			this.goodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
