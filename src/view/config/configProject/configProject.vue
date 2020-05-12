<template>
  <div>
    <Row :gutter="16">
      <Col span="24">
        <Card class="cardHight">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              项目列表
          </p>
          <ButtonBox :treeList="data6"></ButtonBox>
          <Tables :columns="columns1" :data="data1" v-model="data1"  :height="600" @on-change="pageChange" @on-page-size-change="pageSizeChange" :totalPage="total" :currentPage="currentPage">
          </Tables>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getTableData, changeData } from '@/api/data'
import ButtonBox from '@/view/config/configProject/projectButton'
import bus from '_c/bus.js'
export default {
  components: {
    ButtonBox,
    Tables
  },
  created () {},
  mounted () {
    this.initTableData()
    bus.$on("initTableData", (item) => {
      this.initTableData(item)
    })
  },
  name: '',
  data () {
    return {
      columns1: [
        {
          title: '序号',
          align: 'center',
          width: 60,
          type: 'index'
        },
        {
          title: '项目名称',
          align: 'center',
          key: 'projectName'
        },
        {
          title: '描述',
          align: 'center',
          key: 'projectDesc'
        },
        {
          title: '项目经理',
          align: 'center',
          key: 'projectManagerId'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          enum: [{ 0: '停用' }, { 1: '启用' }]
        },
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
                    type: 'primary',
                    size: 'small'
                },
                style: {
                    marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toggle(1, params.row.id)
                  }
                }
            }, '启用'), 
            h('Button', {
                props: {
                    type: 'primary',
                    size: 'small'
                },
 
                on: {
                    click: () => {
                      this.toggle(0, params.row.id)
                    }
                }
            }, '停用')
            ]);
          }
        }
      ],
      data5: [],
      data6: [],
      data1: [],
      page: {
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      autoCompletedata: [],
      userId: null,
      currentPage: null,
      isExpandAll: null
    }
  },
  methods: {
    // 启用或停用
    toggle(status, id) {
      debugger
      changeData('/proxy/attendance/project/updProject', {'status': status, 'id': id}).then(res => {
        this.initTableData()
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开编辑弹框并传值
    editSchedule(item) {
        debugger
      bus.$emit('editSchedule', item.row)
    },
    showModal () {
      this.modalVisible = true
    },
    onSelectChange (data) {
      if (data.length === 0) {
        // this.initTableData('', '')
      } else {
        this.initTableData(null, data[0].userId, data[0].classId)
        this.currentPage = 1
        this.page.pageNum = 1
      }
      bus.$emit('setKeyword')
    },
    // 删除列表数据
    removeCustomer (item) {
        debugger
      this.$Modal.confirm({
        top: '200px', 
        title: '删除',
        content: '<p>是否确认删除？</p>',
        onOk: () => {
          changeData('/proxy/attendance/project/delProject', {id: item.row.id}).then(res => {
              debugger
            if (res.data === 1) {
              this.$Message.success(res.msg)
              this.initTableData()
            } else {
              this.$Message.warning(res.msg)
            }
          })
        }
      })
    },
    // 初始化加载列表数据
    initTableData (status, userId, classId) {
      let params = this.page
      
      status != undefined && (params["status"] = status)
      debugger
      getTableData('/proxy/attendance/project/selProject', params).then(res => {
           debugger
        this.data1 = res.data.list
        this.total = Number(res.data.total)
      }).catch(err => {
        console.log(err)
      })
    },
    submitSchedule (item) {
      bus.$emit('setSchedule', item.row)
    },
    pageChange (item) {
      this.currentPage = item
      this.page['pageNum'] = item
      this.initTableData()
    },
    pageSizeChange (item) {
      this.page['pageSize'] = item
      this.initTableData()
    },
    autoCompleteChange (value) {
      console.log(value)
      let params = {"name": value}
      getTableData('/proxy/class/listFuzzyClass', params).then(res => {
        this.autoCompletedata = res.data
        
      }).catch(err => {
        console.log(err)
      })
    },
    hasSelectedData (value) {
      this.initTableData(null, value)
    }
  }
}
</script>

<style>
</style>
