 <template>
  <div>
    <AutoComplete
      v-model="valueAuto"
      @on-search="handleSearch"
      placeholder="请输入"
      icon="ios-search"
      @on-change="change" v-if="isAutoComplete" style="margin-bottom: 20px;" >
      <Option v-for="item in dataAuto" :value="item.userName" :key="item.userId" @click.native="dataName(item.userId)">
        <span >{{item.userName}}</span>
      </Option>
    </AutoComplete>
    <Card :shadow="false" :style="{height: height + 'px'}" style="overflow-y: auto;" dis-hover>
      <Tree :data="dataTree" @on-select-change="onSelectChange" :show-checkbox="isShowCheckbox"></Tree>
    </Card>
  </div>
</template>
<script>
import { getTableData, changeData } from '@/api/data';
export default {
    name: 'tree',
    props: {
        dataTree: {
            type: Array,
            default () {
                return [];
            }
        },
        isAutoComplete: {
            type: Boolean,
            default () {
                return true;
            }
        },
        dataAuto: {
            type: Array,
            default () {
                return [];
            }
        },
        userId: {
            type: [Number, String],
            default () {
                return null;
            }      
        },
        checkedNode: null,
        removeCheckedNode: null,
        isCleanAll: {
            type: Boolean,
            default () {
                return false;
            }
        },
        isExpandAll: {
            type: Boolean,
            default () {
                return false;
            }
        },
        isDisabledId: {
            type: [Number, String],
            default () {
                return null;
            }
        },
        height: {
            type: Number,
            default () {
                return 680;
            }
        },
        marginTop: {
            type: String,
            default () {
                return '20px';
            }
        },
        isShowCheckbox: {
            type: Boolean,
            default () {
                return false;
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
        };
    },
    mounted () {
        this.travelData(this.dataTree);
    },
    methods: {
        handleSearch (value) {
            // 点击搜索时触发
        },
        change (value) {
            if (value) {
                let params = value.replace(/\s+/g,'');
                this.$emit('auto-complete-change', params);
            }
        },
        onSelectChange (data) {
            this.$emit('on-select-change', data);
        },
        lispTree (data, userId) {
            this.travelData(this.dataTree);
            data.forEach((item, index) => {
                if (item.selected == true) {
                    this.$set(item, 'selected', false);
                }
                if(item.userId == userId) {
                    this.findPids(this.sets, userId);
                    this.upLispTree(this.dataTree, userId);
                    this.$set(item, 'selected', true);
                    this.$set(item, 'expand', true);
                    this.$emit('has-selected-data', userId);
                }
                item.children && this.lispTree(item.children, userId);
            });
        },
        // 以id为索引整理数据，可以通过id查找当前行数据
        travelData (data) {
            data.forEach((item, index) => {
                this.pids[item.userId] = item;
                item.children && this.travelData(item.children);
            });
        },
        // 通过当前节点找到当前节点的所有父id
        findPids (data, id) {
            let pid = data[id].pid;
            this.expand.push(pid);
            pid && this.findPids(data, pid);
        },
        findChildrenIds (data, id) {
            let childrenId = data[id].pid;
            this.expand.push(pid);
            pid && this.formatTree(data, pid);
        },
        // 展开父节点
        upLispTree (data) {
            this.expand.forEach((value) => {
                data.forEach((item) => {
                    if (value  == item.userId) {
                        this.$set(item, 'expand', true);
                    }
                    item.children && this.upLispTree(item.children);
                }); 
            });
        },
        // 展开树所有节点
        expandTree (data) {
            data.forEach((item) => {
                this.$set(item, 'expand', true);
                item.children && this.expandTree(item.children);
            });
        },
        // 清除选中，单选选中以及checkbox勾选
        cleanTree (data) {
            data.forEach((item) => {
                this.$set(item, 'selected', false);
                this.$set(item, 'indeterminate', false);
                this.$set(item, 'checked', false);
                item.children && this.cleanTree(item.children);
            });      
        },
        formatAutoData (data) {
            data.forEach((item) => {
                if (item.classId != null) {
                    item.userId = item.classId;
                }
            });
        },
        disabledTop (data, id) {
            data.forEach((item) => {
                if (item.userId === id) {
                    this.$set(item, 'disabled', true);
                }
                item.children && this.disabledTop(item.children, id);
            });      
        },
        checkedNodes (data, id) {
            data.forEach((item) => {
                if (item.userId === id) {
                    this.$set(item, 'checked', true);
                }
                item.children && this.checkedNodes(item.children, id);
            }); 
        },
        removeCheckedNodes (data, id) {
            data.forEach((item) => {
                if (item.userId === id) {
                    this.$set(item, 'checked', false);
                }
                item.children && this.removeCheckedNodes(item.children, id);
            });
        },
        dataName (data) {
            this.lispTree (this.dataTree, data);
        }
    },
    watch: {
        userId: function (val) {
            this.lispTree (this.dataTree, val);
        },
        isCleanAll: function (val) {
            this.cleanTree(this.dataTree);
        },
        isExpandAll: function (val) {
            if (val) {
                this.expandTree(this.dataTree);
            }
        },
        dataAuto: function (val) {
            if (val != null) {
                this.formatAutoData(val);
            }
        },
        isDisabledId: function (val) {
            this.disabledTop(this.dataTree, val);
        },
        isShowCheckbox: function (val) {
            val && (this.isShowCheckbox = true);
        },
        checkedNode: function (val) {
            this.checkedNodes(this.dataTree, val);
        },
        removeCheckedNode: function (val) {
            this.removeCheckedNodes(this.dataTree, val);
    
        },
    }
};
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
