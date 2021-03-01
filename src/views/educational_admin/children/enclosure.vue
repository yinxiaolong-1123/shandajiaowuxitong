<template>
	<div class="wrap">
		<p>{{obj.name}}</p>
		<iframe class="iframeStyle" :src="'https://view.officeapps.live.com/op/embed.aspx?src='+obj.src"></iframe>
	</div>
</template>
<script>
	const TYPE='enclosure';
  	const REMARK='查看附件';
	export default {
		name:TYPE,
		data(){
			return {
				obj:''
			}
		},
		created(){
			
			this.obj = JSON.parse(this.$route.query.src);
		},
		
		mounted(){
		
		
		}
	}

</script>
<style scoped>
	.wrap{
		width: 100%;
		height: 100%;
	}
	.wrap p{
		padding: 20px 0;
	    text-align: center;
	    font-size: 18px;
	}
	.iframeStyle{
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>
