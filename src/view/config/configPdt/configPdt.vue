<template>
  <div>
    <Row :gutter="16">
      <Col span="24">
        <Card class="cardHight">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              PDT 列表
          </p>
          <ButtonBox :treeList="data6"></ButtonBox>
          <Tables :columns="columns1" :data="data1" v-model="data1"  :height="680" @on-change="pageChange" @on-page-size-change="pageSizeChange" :total="total" :currentPage="currentPage">
          </Tables>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import Tree from '_c/tree/tree.vue'
import Tables from '_c/tables'
import { getTableData, changeData } from '@/api/data'
import ButtonBox from '@/view/config/configPdt/pdtButton'
import bus from '_c/bus.js'
export default {
  components: {
    Tree,
    ButtonBox,
    Tables
  },
  created () {},
  mounted () {
    this.initTreeData(this.$route.params.userId)
    this.initTableData()
    bus.$on("initTableData", (item) => {
      this.initTableData(item)
      this.initTreeData()
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
          title: 'PDT名称',
          align: 'center',
          key: 'pdtName'
        },
        {
          title: 'pdtDesc',
          align: 'center',
          key: 'pdtDesc'
        },
        {
          title: 'PDT经理',
          align: 'center',
          key: 'pdtManagerId'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'pdtManagerId'
        },
        {
          title: '更新时间',
          align: 'center',
          key: 'status'
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
                type: 'error',
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
        title: '删除',
        content: '<p>是否确认删除？</p>',
        onOk: () => {
          changeData('/proxy/attendance/pdt/delPdt', {id: item.row.id}).then(res => {
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
    initTableData (keyword, userId, classId) {
      let params = this.page
      params["keyword"] = keyword
      userId != undefined && (params["userId"] = userId)
      classId != undefined && (params["classId"] = classId)
      debugger
      getTableData('/proxy/attendance/pdt/selPdt', params).then(res => {
           debugger
        this.data1 = res.data.list
        this.total = Number(res.data.total)
      }).catch(err => {
        console.log(err)
      })
    },
    initTreeData (data) {
      let params = data;
      getTableData('/proxy/customer/listCustomerTree', params).then(res => {
        this.formatTreeData(res.data)
        this.data5 = res.data
        this.data6 = JSON.parse(JSON.stringify(res.data))
        data != undefined && (this.userId = data)
      }).catch(err => {
        console.log(err)
      })      
    },
    formatTreeData (data) {
      data.forEach((item) => {
        item.title = item.name
        item.expand = true
        item.children != undefined && this.formatTreeData(item.children)
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
