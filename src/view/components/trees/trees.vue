<template>
  <Row type="flex" justify="center" :gutter="20">
    <Col span="4">
      <Card style="height: 84vh">
        <Tree
          @on-select-change="onSelectChange"
          :dataTree="dataList"
          :userId="userId"
          :isExpandAll="isExpandAll"
          :isCleanAll="isCleanAll"
          :isDisabledId = "isDisabledId"
          :isAutoComplete = "isAutoComplete"
          :isShowCheckbox = "isShowCheckbox"
          :checkedNode = "checkedNode"
          :removeCheckedNode = "removeCheckedNode"
          @has-selected-data="hasSelectedData">
      </Tree>
      </Card>
    </Col>
    <Col span="8">
      <Card style="height: 84vh">
        <p slot="title">
          <Icon type="android-contact"></Icon>
            代码示例
        </p>
        <div>
          <Button icon="md-add" @click="openTreeNode">展开所有节点</Button>
          <Button icon="md-add" @click="cleanAllSelected" style="margin-left: 10px">清除选中</Button>
          <Button icon="md-add" @click="disabledNode" style="margin-left: 10px">禁用节点</Button>
          <Button icon="md-add" @click="showSelectedNode" style="margin-left: 10px">选中单选</Button>
        </div>
        <div style="margin-top: 10px">
          <Button icon="md-add" @click="autoComplete">开启模糊查询</Button>
          <Button icon="md-add" @click="checkedNodes" style="margin-left: 10px">选中多选</Button>
          <Button icon="md-add" @click="showCheckbox" style="margin-left: 10px">打开多选</Button>
          <Button icon="md-add" @click="removeCheckedNodes" style="margin-left: 10px">取消多选</Button>
        </div>
        <Input v-model="value" style="width: 300px;margin-top: 10px" v-focus/>
        <pre class="bg-pre">
          &lt;Tree <br/>
          &nbsp;&nbsp;:dataTree="dataList"<br/>
          &nbsp;&nbsp;:userId="userId"<br/>
          &nbsp;&nbsp;:isCleanAll="isCleanAll"<br/>
          &nbsp;&nbsp;:isDisabledId = "isDisabledId"<br/>
          &nbsp;&nbsp;:isAutoComplete = "isAutoComplete"<br/>
          &nbsp;&nbsp;:isShowCheckbox = "isShowCheckbox"<br/>
          &nbsp;&nbsp;:removeCheckedNode = "removeCheckedNode"<br/>
          &nbsp;&nbsp;@has-selected-data="hasSelectedData"><br/>
          &nbsp;&nbsp;@on-select-change="onSelectChange"<br/>
          &nbsp;&nbsp;@on-check-change="onCheckChange"><br/>
          /&gt;
        </pre>
        <pre class="bg-pre">
          // 复选
          onCheckChange (value) {
            this.selectedData = value
          }
        </pre>
        <pre class="bg-pre">
          // 单选
          onSelectChange (value) {
            this.selectedData = value
          }
        </pre>
      </Card>
    </Col>
    <Col span="12" >
      <Card style="height: 84vh">
        <p slot="title">
          <Icon type="android-contact"></Icon>
            使用文档
        </p>
        <p>Tree props</p>
        <Table stripe :columns="columnsProps" :data="dataProps"></Table>
        <p style="margin-top: 20px">Tree events</p>
        <Table stripe :columns="columnsEvents" :data="dataEvents"></Table>
      </Card>
    </Col>
  </Row>
</template>
<script>
import Tree from '_c/trees';
import { getData } from '@/api/data';
export default {
    name: 'home',
    components: {
        Tree
    },
    data () {
        return {
            dataList: [],
            columnsProps: [
                {
                    title: '属性',
                    key: 'props'
                },
                {
                    title: '说明',
                    key: 'description'
                },
                {
                    title: '类型',
                    key: 'type'
                },
                {
                    title: '默认值',
                    key: 'default'
                }
            ],
            dataProps: [
                {
                    props: 'isExpandAll',
                    description: '是否打开文档树所有节点',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'isCleanAll',
                    description: '是否清除选中状态',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'isDisabledItem',
                    description: '是否禁用掉某一个树节点',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'isAutoComplete',
                    description: '是否打开查询搜索框',
                    type: 'Boolean',
                    default: 'true'
                },
                {
                    props: 'isShowCheckbox',
                    description: '是否显示复选框',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'checkedNode',
                    description: '需要显示的复选框节点',
                    type: 'Array',
                    default: 'false'
                },
                {
                    props: 'removeCheckedNode',
                    description: '需要删除的复选框节点',
                    type: 'Array',
                    default: 'true'
                },
                {
                    props: 'dataTree',
                    description: 'Tree 数据',
                    type: 'Boolean',
                    default: '空'
                },
                {
                    props: 'userId',
                    description: '传唯一标识符, 选中相应数据',
                    type: 'Number | String',
                    default: '空'
                }
            ],
            columnsEvents: [
                {
                    title: '事件名',
                    key: 'events'
                },
                {
                    title: '说明',
                    key: 'description'
                },
                {
                    title: '返回值',
                    key: 'value'
                }
            ],
            dataEvents: [
                {
                    events: 'auto-complete-change',
                    description: '搜索框数据改变时触发',
                    value: '输入值'
                },
                {
                    events: 'has-selected-data',
                    description: '选中某一个树节点时触发',
                    value: '  当前的选中节点的id值'
                }
            ],
            value: null,
            userId: null,
            isExpandAll: false,
            isCleanAll: false,
            isDisabledId: null,
            isAutoComplete: true,
            isShowCheckbox: false,
            checkedNode: null,
            removeCheckedNode: null
        };
    },
    mounted () {
        this.initTreeData();
    },
    methods: {
        initTreeData () {
            getData('/proxy/cloud/tree').then(res => {
                this.formatTreeData(res.data.data);
                this.dataList = res.data.data;
            });
        },
        formatTreeData (data) {
            data.forEach((item) => {
                item.title = item.name;
                item.children && this.formatTreeData(item.children);
            });
        },
        openTreeNode () {
            this.isExpandAll === true ? this.isExpandAll = false : this.isExpandAll = true;
        },
        cleanAllSelected () {
            this.isCleanAll === true ? this.isCleanAll = false : this.isCleanAll = true;
        },
        disabledNode () {
            this.isDisabledId = 1;
        },
        autoComplete () {
            this.isAutoComplete === true ? this.isAutoComplete = false : this.isAutoComplete = true;
        },
        showCheckbox () {
            this.isShowCheckbox === true ? this.isShowCheckbox = false : this.isShowCheckbox = true;
        },
        checkedNodes () {
            this.checkedNode = this.value;
        },
        removeCheckedNodes () {
            debugger;
            this.removeCheckedNode = this.value;
        },
        showSelectedNode () {
            this.userId = this.value;
        },
        onSelectChange (data) {
            data.length !== 0 && (this.value = data[0].userId);
        }
    }
};
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
