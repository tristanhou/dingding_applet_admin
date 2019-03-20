<template>
  <div>
    <Row type="flex" justify="start" :gutter="20">
      <Col span="20">
        <Tables
          ref="tables"
          border
          editable
          v-model="tableData"
          :columns="columns"
          :height="440"
          @on-delete="removeData"
          @on-down-record="downRecord"
          @on-up-record="upRecord"
        />
      </Col>
    </Row>
    <Row type="flex" justify="start" :gutter="20">
      <Col span="20">
        <Card>
            <p slot="title">
                <Icon type="android-contact"></Icon>使用文档
            </p>
            <p>table props</p>
            <Table stripe :columns="columnsProps" :data="dataProps"></Table>
            <p style="margin-top: 20px">columns events</p>
            <Table stripe :columns="columnsProps" :data="dataCol"></Table>            
            <p style="margin-top: 20px">table events</p>
            <Table stripe :columns="columnsEvents" :data="dataEvents"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import Tables from '_c/tables';
import { getData } from '@/api/data';
export default {
    name: 'home',
    components: {
        Tables
    },
    data() {
        return {
            dataList: [],
            tableData: [], // 列表数据
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                { title: '姓名', key: 'name', sortable: true },
                { title: '电话', key: 'phone', editable: true },
                { title: '邮箱', key: 'email' },
                {
                    title: '删除',
                    key: 'handle',
                    options: ['delete']
                },
                {
                    title: '上下移',
                    key: 'handle',
                    options: ['change']
                },
                {
                    title: '性别',
                    key: 'sex',
                    enum: [{ 0: '男' }, { 1: '女' }]
                }
            ],
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
                    props: 'editable',
                    description: '是否可编辑',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'showFooter',
                    description: '是否显示分页组件',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'totalPage',
                    description: '总条数',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'current',
                    description: '当前页, 每一次初始化后显示第一页',
                    type: 'Number',
                    default: '1'
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
                    events: 'on-delete',
                    description: '删除时触发',
                    value: '删除的当前行数据'
                },
                {
                    events: 'on-up-record',
                    description: '上移一条数据',
                    value: '上移的当前行数据'
                },
                {
                    events: 'on-down-record',
                    description: '下移一条数据',
                    value: '下移的当前行数据'
                },
                {
                    events: 'on-start-edit',
                    description: '开始编辑',
                    value: '无'
                },
                {
                    events: 'on-save-edit',
                    description: '保存编辑',
                    value: '编辑后的当前行数据'
                },
                {
                    events: 'on-cancel-edit',
                    description: '取消编辑',
                    value: '无'
                }                
            ],
            dataCol: [
                {
                    props: 'options',
                    description: '操作项，["delete"]: 删除；["change"]: 上下移',
                    type: 'Array',
                    default: '无'
                },
                {
                    props: 'enum',
                    description: '枚举项，[{0, "男"},{1, "女"}]',
                    type: 'Array',
                    default: '无'
                }
            ],
        };
    },
    mounted() {
        this.initTableData();
    },
    methods: {
    // 下移
        downRecord(val) {
            this.tableData[val.index] = this.tableData.splice(
                val.index + 1,
                1,
                this.tableData[val.index]
            )[0];
        },
        // 上移
        upRecord(val) {
            this.tableData[val.index] = this.tableData.splice(
                val.index - 1,
                1,
                this.tableData[val.index]
            )[0];
        },
        removeData(params) {
            debugger;
            this.tableData.filter((item, index) => index !== params.row.initRowIndex);
        },
        initTableData() {
            this.$loading.show();
            this.$http.get(this.$api.GET_TABLE_LIST).then(res => {
                this.tableData = res.data.data;
                this.$loading.hide();
            });
        }
    }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
