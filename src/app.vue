<template>
  <div id="app" class="full-size clear">
    <!-- <keep-alive>
        <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view> -->
    <router-view class="full-size-scroll" v-if="isRouterAlive"/>
  </div>
</template>
<script>
  // import { setTitle } from './util'
  export default{
      name:'app',
      provide() {  //注册一个方法
        return {
          reload: this.reload
        }
      },
      data(){
        return {
          isRouterAlive: true //新增代码
        }
      },
      methods: {  //新增代码
        reload() {
          this.isRouterAlive = false;
          this.$nextTick(function() {
          	this.isRouterAlive = true;
          })
        }
      }
  }
</script>
<style>
/* 解决element-ui的table表格控件表头与内容列不对齐问题 */
  .el-table th.gutter{
    display: table-cell!important;
  }
</style>

<style lang="less">
@import "assets/styles/index";
html {
  overflow-y: scroll;
}
:root {
  overflow-y: auto;
  overflow-x: hidden;
}
:root body {
  position: absolute;
}
body {
  width: 100vw;
  overflow: hidden;
}

</style>
