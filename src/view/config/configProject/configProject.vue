<template>
  <div>
    <Row type="flex" justity="end" class="butto-box">
        <Button type="primary">新增</Button>
    </Row>  
    <Row type="flex" justify="start" :gutter="20">
      <Col span="24">
        <Tables
          ref="tables"
          border
          editable
          v-model="tableData"
          :columns="columns"
          :height="680"
          @on-delete="removeData"
          @on-down-record="downRecord"
          @on-up-record="upRecord"
        />
      </Col>
    </Row>
  </div>
</template>
<script>
import Tables from '_c/tables';
// import { getData } from '@/api/data';
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
                { title: 'pdt', key: 'pdt', sortable: true },
                { title: 'pdt经理', key: 'pdtManager', editable: true },
               {
          title: "操作",
          align: 'center',
          width: 260,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editSchedule(params)
                  }
                }
            }, '修改'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                    this.removeCustomer(params)
                }
              }
            }, '删除'),
            h('Button', {
              props: {
                type: 'default',
                size: 'small'
              },
              on: {
                click: () => {
                    this.submitSchedule(params)
                }
              }
            }, '课程表')
            ]);
          }
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
        show(index) {
            alert(index)
        },
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
            this.tableData.filter((item, index) => index !== params.row.initRowIndex);
        },
        initTableData() {
            // this.$loading.show();
            this.$http.get(this.$api.GET_CONFIGPDT_LIST).then(res => {
                debugger
                this.tableData = res.data;
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

.butto-box {
    justify-content: flex-end;
    button {
        margin-left: 10px
    }
}
</style>
