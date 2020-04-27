 <template>
  <div>
    <AutoComplete
      v-model="valueAuto"
      @on-search="handleSearch"
      placeholder="请输入客户名称"
      icon="ios-search"
      @on-change="change" v-if="isAutoComplete" style="margin-bottom: 20px;" >
      <Option v-for="item in dataAuto" :value="item.userName" :key="item.userId" @click.native="dataName(item.userId)">
        <span >{{item.userName}}</span>
      </Option>
    </AutoComplete>
    <Card :shadow="false" :style="{height: height + 'px'}" style="overflow-y: auto;" dis-hover>
      <Tree :data="dataTree" @on-select-change="onSelectChange"></Tree>
    </Card>
  </div>
</template>
<script>
import { getTableData, changeData } from '@/api/data'
export default {
  name: 'tree',
  props: {
    dataTree: {
      type: Array,
      default () {
        return []
      }
    },
    isAutoComplete: {
      type: Boolean,
      default () {
        return true
      }
    },
    dataAuto: {
      type: Array,
      default () {
        return []
      }
    },
    userId: '',
    iscleanAll: {
      type: Boolean,
      default () {
        return false
      }
    },
    isExpandAll: {
      type: Boolean,
      default () {
        return false
      }
    },
    isDisabledTop: {
      type: Boolean,
      default () {
        return false
      }
    },
    height: {
      type: Number,
      default () {
        return 680
      }
    },
    marginTop: {
      type: String,
      default () {
        return '20px'
      }
    }
  },
  data () {
    return {
      valueAuto: '',
      isShow: false,
      display: 'none',
      sets: {},
      expand: []
    }
  },
  mounted () {
    this.travelData(this.dataTree)
  },
  methods: {
    handleSearch (value) {
      // 点击搜索时触发
    },
    change (value) {
      if (value !== undefined) {
        let params = value.replace(/\s+/g,'')
        this.$emit('auto-complete-change', params)
      }
    },
    onSelectChange (data) {
      this.$emit('on-select-change', data)
    },
    lispTree (data, userId) {
      data.forEach((item, index) => {
        if (item.selected == true) {
          this.$set(item, 'selected', false)
        }
        if(item.userId == userId || item.classId == userId) {
          this.$set(item, 'selected', true)
          item.expand == false && this.$set(item, 'expand', true)
          this.$emit('has-selected-data', userId)
        }
        item.children != undefined && this.lispTree(item.children, userId)
      })
    },
    // 以id为索引整理数据，可以通过id查找当前行数据
    travelData (data) {
      data.forEach((item, index) => {
        this.sets[item.userId] = item
        this.$set(item, 'expand', true)
        item.children != undefined && this.travelData(item.children)
      })
    },
    // 通过当前节点的父id找到它所有的父级元素
    formatTree (id) {
      let pid
      for (var i in this.sets) {
        if(i == id) {
          pid = i
          this.expand.push(i)
        }
      }
      pid != undefined && this.formatTree(this.sets[pid].pid)
    },
    // 展开父节点
    upLispTree (data) {
      this.expand.forEach((value) => {
        data.forEach((item) => {
          if (value  == item.userId) {
            this.$set(item, 'expand', true)
          }
          item.children != undefined && this.upLispTree(item.children)
        }) 
      })
    },
    expandTree (data) {
      data.forEach((item) => {
        this.$set(item, 'expand', true)
        item.children != undefined && this.expandTree(item.children)
      })
    },
    cleanTree (data) {
      data.forEach((item) => {
        this.$set(item, 'selected', false)
        item.children != undefined && this.cleanTree(item.children)
      })      
    },
    formatAutoData (data) {
      data.forEach((item) => {
        if (item.classId != null) {
          item.userId = item.classId
        }
      })
    },
    disabledTop (data) {
       data.forEach((item) => {
        if (item.schoolId == null) {
          this.$set(item, 'disabled', true)
        }
        item.children != undefined && this.disabledTop(item.children)
      })      
    },
    dataName (data) {
      this.lispTree (this.dataTree, data)
    }
  },
  watch: {
    userId: function (val) {
      this.lispTree (this.dataTree, val)
    },
    isCleanAll: function (val) {
      if (val) {
        this.cleanTree(this.dataTree)
      }
    },
    isExpandAll: function (val) {
      if (val) {
        this.expandTree(this.dataTree)
      }
    },
    dataAuto: function (val) {
      if (val != null) {
        this.formatAutoData(val)
      }
    },
    isDisabledTop: function (val) {
      if (val) {
        this.disabledTop(this.dataTree)
      }
    }
  }
}
</script>
<style>
.showActive {
  background: #eaf4fe
}
.showHover {
  background: #d5e8fc
}
.ivu-select-dropdown-list {
  max-height: 600px
}
</style>
