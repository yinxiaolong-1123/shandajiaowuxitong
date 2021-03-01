<template>
	<div class="calculate-building-distance">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <!-- v-if="btnPerObj.add" -->
        <div class="cm-fold">
            <el-button type="primary" size="mini" @click="handleClculate" style="margin: 10px;">一键计算楼栋距离</el-button>
        </div>
        <div class="cm-table">
	    	<el-table
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%"
                size="mini"
                header-row-class-name="cm-dark"
                v-loading="tableLoading"
                element-loading-text="加载中……"
                element-loading-background="rgba(255, 255, 255, 0.8)">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="楼栋1" prop="buildingOne"></el-table-column>
                <el-table-column label="楼栋2" prop="buildingTwo"></el-table-column>
                <el-table-column label="距离（米）" prop="distance"></el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
	</div>
</template>
<script>
export default {
    name: 'cacl_building_distance',
    data() {
        return {
	    	breadcrumb: [
                {label: "基础数据"},
                {label: "楼栋距离"},
            ],
            tableData:[],
            tableLoading: false,
            pageNo: 1,
            pageSize: 10,
            totalCount:0
        };
    },
    created (){
    	this.getBuildingDistanceList();
    },
    methods: {
    	handleClculate (){
    		this.$http.post(`_op:/buildingDistance`,{}).then(res => {
    			this.getBuildingDistanceList();
    		})
    	},
    	getBuildingDistanceList (){
    		this.$http.post(`_op:/buildingDistance/list`,{
    			pageNo: this.pageNo,
    			pageSize: this.pageSize
    		}).then(res => {
    			this.tableData = res.result;
    			this.totalCount = res.totalCount;
    		})
    	},
    	sizeChange (val){
    		this.pageNo = 1;
    		this.pageSize = val;
    		this.getBuildingDistanceList();
    	},
    	currentChange (val){
    		this.pageNo = val;
    		this.getBuildingDistanceList();
    	}
    }
};
</script>
<style lang="css" scoped>
</style>