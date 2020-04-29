<template>
  <div>
    <Row :gutter="16">
      <Col span="24">
        <Card style="height:84vh; overflow-y:auto">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              明细表
          </p>
          <Row class="table-top" style="marginBottom: 11px;">
                <div style="float: left;">
                    <Select v-model="pdtSelect" style="width:110px; marginRight:5px" :filterable="true" placeholder="PDT" @on-change="pdtChange">
                        <Option v-for="item in pdtList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="projectSelect" style="width:110px; marginRight:5px" :filterable="true" placeholder="项目名称">
                      <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="searchValue"  style="width:110px; marginRight:5px"  placeholder="填写人名称" @on-search="search()"/>
                    <Date-picker type="date" placeholder="选择日期" style="width: 200px" @on-change="onDateChange"></Date-picker>
                    <Button style="marginRight:5px; marginLeft:5px" type="primary" @click="seek()">查询</Button>
                    <Button style="marginRight:5px" type="primary" @click="exportDatas()">导出<Icon type="ios-download-outline"></Icon></Button>
                </div>
               
            </Row>
          <Tables :columns="detailColumns" :totalPage="totalRecord" :show-total="false" @on-page-change="pageChange" :currentPage="currentPage" :data="detailData" v-model="detailData" ref="table" :height="600" @on-page-size-change="pageSizeChange">
          </Tables>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import Search from '_c/search/search.vue'
import Tree from '_c/tree/tree.vue'
import Tables from '_c/tables'
import { getTableData } from '@/api/data'

export default {
  components: {
    Search,
    Tree,
    Tables
  },
  created () {},
  mounted () {
    this.totalRecord = 0
    this.getPdtList()
    this.initTableData()
  },
  watch: {},
  name: 'directive_page',
  data () {
    return {
 
      pageNum: 1,
      pageSize: 20,
      pageMax: 0,
      pageArray: [1],
      pageFlag: true,
      currentPage: 1,
      totalRecord: 0,
      pdtSelect: '', // pdt 下拉框 modal
      projectSelect: '', // 项目下拉框 modal
      typeFontColor: '',
      dataValue: null,
      isExpandAll: null,
      dateOptions: '',
      startTime: '',
      endTime: '',
      searchValue: '',
      tempList: [],
      serial: 0,
      list: [],
      endRow: 0,
      detailColumns: [ // 明细表
        {
          title: 'PDT名称',
          key: 'pdtName',
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'projectName',
          align: 'center'
        },
        {
          title: '填写人名称',
          key: 'dingTalkUserName',
          align: 'center'
        },
        {
          title: '填写日期',
          key: 'dailyDate',
          align: 'center',
          render: (h, params) => {
            return  h('div', new Date(params.row.dailyDate).Format('YYYY-MM-DD')) ;
          }
        },
        {
          title: '岗位',
          key: 'position',
          align: 'center'
        },
        {
          title: '工作内容',
          key: 'jobContent',
          align: 'center'
        },
        {
          title: '百分比(%)',
          key: 'percent',
          align: 'center'
        },
        {
          title: '当天耗时(H)',
          key: 'jobDuration',
          align: 'center'
        },
        {
          title: 'PDT经理',
          key: 'pdtManagerName',
          align: 'center'
        },
        {
          title: '项目经理',
          key: 'pmName',
          align: 'center'
        },
        {
          title: '部门',
          key: 'departmentName',
          align: 'center'
        },
        {
          title: '直接上级',
          key: 'alarmSite',
          align: 'center'
        }
      ],
      pdtList: [], // pdt 下拉数据
      projectList: [], // 项目下拉数据
      options2: {
        disabledDate (date) {
          return  (
             (date && date.valueOf() < Date.now() - 86400000 * 45) ||
            date.valueOf() > Date.now()
          )
        },
        shortcuts: [
          {
            text: '今天',
            value () {
              const end = new Date ()
              const start = new Date ()
              start.setTime(start.getTime ())
              end.setTime(end.getTime ())
              start.setHours(0, 0, 0)
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'TODAY'
            }
          },
          {
            text: '昨天',
            value () {
              const end = new Date ()
              const start = new Date ()
              start.setTime (start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime (end.getTime() - 3600 * 1000 * 24 * 1)
              start.setHours(0, 0, 0)
              end.setHours(23, 59, 59)
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'YESTERDAY'
            }
          },
          {
            text: '前天',
            value () {
              const end = new Date ()
              const start = new Date ()
              start.setTime (start.getTime() - 3600 * 1000 * 24 * 2)
              end.setTime (end.getTime() - 3600 * 1000 * 24 * 2)
              start.setHours(0, 0, 0)
              end.setHours(23, 59, 59)
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'BEFOREYESTERDAY'
            }
          },
          {
            text: '本周',
            value () {
              const end = new Date ()
              const start = new Date ()
              function getFirstDayOfWeek (date) {
                var day = date.getDay() || 7
                return new Date (
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1 - day
                )
              }
              start.setTime(getFirstDayOfWeek (start))
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'THISWEEK'
            }
          },
          {
            text: '上周',
            value () {
              const end = new Date ()
              const start = new Date ()
              function getFirstDayOfWeek (date) {
                var day = date.getDay() || 7
                return new Date (
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1 - day - 7
                )
              }
              function getLastDayOfWeek (date) {
                var day = date.getDay() || 7
                return new Date (
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1 - day - 1
                )
              }
              start.setTime(getFirstDayOfWeek (start))
              end.setTime(getLastDayOfWeek (end))
              end.setHours(23, 59, 59)
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'LASTWEEK'
            }
          },
          {
            text: '最近7天',
            value () {
              const end = new Date ()
              const start = new Date ()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              start.setHours(0, 0, 0)
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'LASTSEVENDAYS'
            }
          },
          {
            text: '最近30天',
            value () {
              const end = new Date ()
              const start = new Date ()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              start.setHours(0, 0, 0)
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'LASTTHIRTYDAYS'
            }
          },
          {
            text: '自定义',
            value () {
              const end = new Date ()
              const start = new Date ()
              return [start, end]
            }
          }
        ]
      },
      detailData: [], // 明细表列表数据 
      modalVisible: false,
      options: {
        trigger: '.ivu-modal-body',
        body: '.ivu-modal',
        recover: true
      },
      dailyDate: '', // 上报日期
      pdtId: '', // pdt id
      projectId: '', // 项目id
      dingTalkUserName: '' // 填写人名称
    }
  },
  methods: {
    // pdt 列表 change 事件
    pdtChange(val) {
      this.getProjectList(val)
    },
    // 日期
    onDateChange(val) {

    },
    getPdtList () {
      getTableData ('/proxy/attendance/pdt/selPdt')
        .then (res => {
          debugger
          const list = res.data.list;
          let data = [];
          list.forEach(element => {
            data.push({value: element.id, label: element.pdtName})
          });
          this.pdtList = data;
        })
        .catch (err => {
          console.log(err)
        })
    },
    getProjectList(id) {
      getTableData ('/proxy/attendance/project/selProjectByPdtId', {pdtId: id})
        .then (res => {
          debugger
          const list = res.data.list;
          let data = [];
          list.forEach(element => {
            data.push({value: element.id, label: element.projectName})
          });
          this.projectList = data;
        })
        .catch (err => {
          console.log(err)
        })
    },
    initTableData() {
      getTableData ('/proxy/attendance/daily/selDaily', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        query: this.getSearchValue()
      })
        .then (res => {
          if (res.data) {
            debugger
            this.detailData = res.data.list
            this.totalRecord = res.data.total
          } else {
            this.detailData = []
          }
        })
        .catch (err => {
          console.log(err)
        })
        console.log(this.totalRecord)
    },
    pageChange (val) {
      debugger
      this.pageNum = val
      this.currentPage = val
      this.initTableData()
    },
    error () {
      this.$Message.error('请选择学校或班级进行查询')
    },
    warning () {
      this.$Message.warning('请输入学生姓名或IMEI号进行搜索')
    },
    getSearchValue () {
      return this.trim(this.searchValue, 'g')
    },
    trim (str, is_global) {
      let result
      result = str.replace(/(^\s+)|(\s+$)/g,"");
      if(is_global.toLowerCase()=="g")
      {
        result = result.replace(/\s/g,"");
      }
      return result;
    },
    seek () {
      this.pageNum = 1
      this.pageMax = 0
      this.oldPageNum = 1
      this.pageArray = [1]
      this.currentPage = 1
      this.searchValue = ''
      if (this.schoolId) {
        getTableData ('/proxy/report/stat/alarm/details', {
        schoolId: this.schoolId,
        classId: this.classId,
        type: this.check,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        pageNum: 1
        })
        .then(res => {
          console.log (res)
          if  (res.data) {
            this.data1 = res.data.result
            this.getTotal()
          } else {
            this.data1 = []
          }
        })
        .catch(err => {
          console.log(err)
        })
      } else {
        this.error()
      }
    },
    search () {
      this.pageNum = 1
      this.pageMax = 0
      this.oldPageNum = 1
      this.pageArray = [1]
      this.currentPage = 1
      if (this.searchValue === '') {
        this.warning()
      } else {
        getTableData ('/proxy/report/stat/alarm/details', {
        schoolId: this.schoolId,
        classId: this.classId,
        type: this.check,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        query: this.getSearchValue(),
        pageNum: 1
      })
        .then(res => {
          if  (res.data) {
            this.data1 = res.data.result
            this.getTotal()
          } else {
            this.data1 = []
            this.warnings()
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
    },
    exportDatas () {
      if (this.data1.length === 0) {
        this.$Message.warning('当前无数据，无法导出')
      } else {
        getTableData ('/proxy/report/stat/alarm/details/export', {
        schoolId: this.schoolId,
        classId: this.classId,
        type: this.check,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime
        })
        .then(res => {
          let baseUrl = '/proxy/report/stat/alarm/details/export'
          const finalUrl = `${baseUrl}?schoolId=${this.schoolId}&type=${
            this.check
          }&time=${this.dateOptions}&startTime=${this.startTime}&endTime=${
            this.endTime
          }&classId=${this.classId}`
          window.location.href = finalUrl
        })
        .catch(err => {
          console.log(err)
        })
      }
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.initTableData()
    }
  }
}
</script>

<style>
.intro-con {
  min-height: 140px;
}
.draggable-btn {
  margin-top: 20px;
}
.code-con {
  width: 400px;
  background: #f9f9f9;
  padding-top: 10px;
}
.table-top {
  padding-bottom: 10px;
  background: #fff;
}
.ivu-table-footer .ivu-row {
  bottom: 10px;
}
</style>

