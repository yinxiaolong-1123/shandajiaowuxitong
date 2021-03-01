<template>
    <el-table
      :data = "data"
      :row-style = "showTr"
      border
      size='mini'
      header-row-class-name="cm-dark"
      element-loading-background="rgba(255, 255, 255, 0.8)">
	  <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column v-for="(column, index) of columns" :key="column.dataIndex" :label="column.text" align="left">
          <template slot-scope="{row,$index}">
          	  <template v-if="!row._isEdit">
	              <span v-if="spaceIconShow(index) && !row._isEdit" v-for="(space, levelIndex) in row._level" class="ms-tree-space" :key="levelIndex"></span>
	              <span v-if="toggleIconShow(row, index)" @click="toggle($index)" class="span-cursor" >
	                  <i v-if="!row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
	                  <i v-if="row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
	              </span>
	              <span v-else-if="index === 0" class="ms-tree-space"></span>
	              <i v-if="index==0" :class="row.icon"></i>
	              <span>{{row[column.dataIndex]}}</span>
              </template>
              <template v-else>
              	  <el-select v-if="column.dataList" v-model="row[column.dataIndex]"  :placeholder=" '请填入'+column.text">
				    <el-option
				      v-for="item in column.dataList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
              	  <el-input 
              	  	v-else 
              	  	@keyup.enter.native="editBtn(row,$index)"
              	  	v-model="row[column.dataIndex]" 
              	  	:placeholder=" '请填入'+column.text" 
              	  	size="mini" >
              	  </el-input>
              </template>
          </template>
      </el-table-column>

      <el-table-column label="操作" v-if="treeType == 'normal'" width="170px">
          <template slot-scope="{row,$index}">
              <el-button v-if="!row._isEdit" type="text" size="mini" @click="addBtn(row,$index)">增加</el-button>
              <el-button type="text" size="mini" @click="editBtn(row,$index)">
              	<template v-if="row._isEdit">保存</template>
              	<template v-else>编辑</template>
              </el-button>
              <el-button v-if="row._isEdit" type="text" size="mini" @click="cancelBtn(row,$index)">取消</el-button>
              <el-button v-if="!row._isEdit" type="text" size="mini" style="color: red;" @click="deleteBtn(row,$index)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
</template>

<script>
	import Vue from 'vue'
    import _lodash from 'lodash'
    import Utils from './index'

    export default {
        name: "table-tree",
        props: {
            // 确认父组件传过来的数据是否为树形结构,如果是，则不进行格式转换
            treeStructure: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            // 对应的字段名
            columns: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 数据源
            dataSource: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 是否展示操作列
            treeType: {
                type: String,
                default: function () {
                    return 'normal'
                }
            },
            // 默认是否展开所有的树
            defaultExpandAll: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
        },

        data() {
            return {}
        },

        computed: {
            // 格式化数据源
            data: function () {
                let me = this;
                if (me.treeStructure) {
                    let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll);
                
                    return data;
                }
                return me.dataSource;
            }
        },
        methods: {
            // 显示行
            showTr(row, index) {
                let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true);
                row.row._show = show;
                return show ? '' : 'display:none;'
            },
            // 展开下级
            toggle(trIndex) {
                let record = this.data[trIndex];
                record._expanded = !record._expanded;
            },
            // 显示层级关系的空格和图标
            spaceIconShow(index) {
                if (this.treeStructure && index === 0) {
                    return true;
                }
                return false;
            },
            // 点击展开和关闭的时候，图标切换
            toggleIconShow(record, index) {
                if (this.treeStructure && index === 0 && record.children && record.children.length > 0) {
                    return true;
                }
                return false;
            },
            cancelBtn(row,index){
            	if (row.id) {
	        		this.data[index]._isEdit=false;
	        		this.$message.warning('已取消，编辑内容未保存')
            	}else{
            		if (row._parent) {
            			this.data.splice(index,1)
            		}else{
            			this.deleteBtn(row,index)
            		}
            	
            	}
            },
            addBtn(row,index){
            	if (!row.id) {
            		this.$message.error('本条数据为无效数据，不可以新增子数据');
            		return false;
            	}
//				let obj =  _lodash.cloneDeep(row);
				let obj =  {};
				for(let c of this.columns) {
					obj[c.dataIndex] = '';
				}
				obj.children=[];
				obj.id='';
				obj._isEdit=true;
                obj._append = true;
				obj._level=row._level+1;
				obj._parent=row;
			
				this.data.splice(index+1,0,obj);
            },
            editBtn(row,index){
            	if (row._isEdit==undefined) {
            		Vue.set(this.data[index],'_isEdit',false)
            	}
            	if (row._isEdit) {
            		this.$emit('saveParam',row)
            	}
            	this.data[index]._isEdit=!this.data[index]._isEdit;
                this.data[index]._append = false;
            },
            deleteBtn(row,index){
            	this.$emit('deleteParam',row,index)
            }
            
            
        }
    }
</script>

<style scoped lang="less">
  .ms-tree-space {
      width: 18px;
      height: 14px;
  }

  .ms-tree-space::before {
      content: ""
  }

  table td {
      line-height: 26px;
  }
  .span-cursor{
  	 cursor: pointer;
  }
  
</style>