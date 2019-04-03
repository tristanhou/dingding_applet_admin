<template>
  <div class="tree-table" data-automation="treeTable">
    <el-table v-if="formatData.length > 0" :data="formatData" :row-style="showRow" v-bind="$attrs" :height="height" :border="border">
    <el-table-column width="50" align="center">
      <template slot-scope="scope">
        <el-checkbox v-if="scope.row.editFlag" v-model="scope.row.checks" @change="toselect(scope.row)"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column align="center" v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.row,scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.row,scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" align="center">
      <template slot-scope="scope">
        <el-button>查看</el-button>
        <el-button>编辑</el-button>
      </template>
    </el-table-column>
    <slot/>
  </el-table>
  </div>
</template>

<script>
import treeToArray from './eval';
export default {
    name: 'TreeTable',
    data(){
        return {
            chooseson: true, //全选
            key: true //单个点击直到全部选中
        };
    },
    props: {
        /* eslint-disable */
        data: {
          type: [Array, Object],
          required: true
        },
        columns: {
          type: Array,
          default: () => []
        },
        evalFunc: Function,
        evalArgs: Array,
        expandAll: {
          type: Boolean,
          default: false
        },
        height:{
          type:Number,
          default:640
        },
        border:{
          type:Boolean,
          default:true
        }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(row,trIndex) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
      this.$emit('spread-list',row,record._expanded)
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    //设置表头全选
    renderHeader(h, data) {
      return h("span", [
        h("input", {
          attrs: {
            id: "chooseall",
            type: "checkbox",
            style:
              "border: 1px solid #dcdfe6;border-radius: 2px;box-sizing: border-box;width: 14px;height: 14px;background-color: #fff;"
          },
          on:{
            // 全选事件
            change:(e) => {
              const all = e.target
              if (all.checked) {
                // this.setchildtobeselect(this.formatData,true);
              } else {
                // this.setchildtobeselect(this.formatData,false);
              }
            }
          }
        })
      ]);
    },
    //功能函数:选中部分子集
    setchildtobeselect(arr, type) {
      // console.log(arr)
      arr.forEach((v, i) => {
        v.checks = type;
        v._expanded = false
        this.$set(v,'checks',type)
      });
    },
    //是否所有的都被选中
    isallchecked(arr) {
      let flag = true;
      const checkedCycle = item => {
         arr.forEach((v, i) => {
          if (!v.checks) {
            flag = false;
            // document.getElementById("chooseall").checked = false;//设置全选状态
            return;
          }
        });
        if(flag){
          // document.getElementById("chooseall").checked = true;//设置全选状态
        }
      }
      checkedCycle(arr)
    },
    //设置父级为 未选中状态
    setparentfalse(parent, id, level) {
      parent.checks = false;
      if(parent.parent){
        this.setparentfalse(parent.parent, id, level);
      } 
    },
    //设置父级为 选中状态
    setparenttrue(parent, id, level) {
      if(!parent){
        return;
      }
      const arr = parent.children || false
      let flag = true;
      arr.forEach((v, i) => {
        if(!v.checks){
          flag = false
        }
      });
      if(flag && parent.children){
        parent.checks = true;
        this.setparenttrue(parent.parent, id, level);
      }else{
        return;
      }
    },
    /**
     * 选中子元素
     */
    selectChildren(arr,type){
      if(!arr){
        return;
      }
      arr.forEach(item => {
        item.checks = type;
        if(item.children && item.children.length > 0){
          this.selectChildren(item.children,type)
        }
      })
      
    },
    //某个复选框被点击时
    toselect(row) {
      // row.timeLine++
      row.number++
      // row._expanded = row.checks;//选中后是否展开
      //1、若有子集先让子选中
      this.$set(row,'checks',row.checks)
      if (row.children) {
        this.selectChildren(row.children, row.checks);
      }
      //2、然后判断是否全选中
      // this.key = true; //重置为true，防止上次已经是false的状态 
      // this.isallchecked(this.formatData);
      //3、设置多选框的状态 
      if (!row.checks) {
        if(row.parent){
          //  this.setparentfalse(row.parent, row.id, row._level); //设置父级选中的状态为false
          //  document.getElementById("chooseall").checked = false; //设置全选框的状态
        }
      } else {
        if(row.parent){
          // this.setparenttrue(row.parent, row.id, row._level); //设置父级选中的状态为true
        }
      }
      //筛选出选中行
      const changeArr = this.formatData.filter(item => {
        return item.checks
      })
      this.$emit('select-checkbox',changeArr)
    },
    //查看信息
    viewMessage(row){
      this.$emit('view-message',row)
    },
    //编辑信息
    editMessage(row){
      this.$emit('edit-message',row)
    },
    //移动信息
    moveMessage(row){
      this.$emit('move-message',row)
    },
    //删除信息
    deleteMessage(row){
      this.$emit('delete-message',row)
    },
  },
}
</script>
<style lang="less">
.tree-table{
    @space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: @space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    // width: 100%;
    height: 100%;
  }
  table {
    border-color:#e8eaec;
    border-collapse: collapse;
    border-spacing: 0;
     td {
      line-height: 26px;
    }
  }
  .el-table__header{
    .is-leaf{
      padding: 0;
      .cell{
        height: 48px;
        line-height: 48px;
        padding:0 12px;
        font-size:12px;
        color: #515a6e;
        white-space: nowrap;
        font-weight: bold;
      }
    }
  }
  .el-table__body-wrapper{
    td{
      padding: 0;
    }
    .cell{
      height: 48px;
      line-height: 48px;
      font-size:12px;
       padding:0 12px;
      color: #515a6e;
      white-space: nowrap;
    }
    .el-button{
      color: #515a6e;
      font-size: 12px;
    }
  }
  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: #515a6e;
    margin-left: -@space-width;
  }
  .el-table__row{
    >td{
      &:nth-child(3){
        position: relative;
        z-index: -9999;
        left: -9999px;
      }
    }
  }
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
}
</style>
