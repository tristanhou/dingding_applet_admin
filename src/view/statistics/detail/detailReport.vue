<template>
  <div>
    <Row :gutter="16">
      <Col span="24">
        <Card style="height:84vh; overflow-y:auto">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              告警详情
          </p>
          <Row class="table-top" style="marginBottom: 11px;">
                <div style="float: left;">
                    <Select v-model="check" style="width:110px; marginRight:5px" :filterable="true" placeholder="PDT">
                        <Option v-for="item in checkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="check" style="width:110px; marginRight:5px" :filterable="true" placeholder="项目名称">
                      <Option v-for="item in checkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="searchValue"  style="width:110px; marginRight:5px"  placeholder="填写人名称" @on-search="search()"/>
                    <DatePicker type="datetimerange" :options="options2" placement="bottom-start" @on-change="onTimeChange" placeholder="请选择要查询的考勤日期起始时间" :value="dataValue" style="width: 300px"></DatePicker>
                    <Button style="marginRight:5px; marginLeft:5px" type="primary" @click="seek()">查询</Button>
                    <Button style="marginRight:5px" type="primary" @click="exportDatas()">导出<Icon type="ios-download-outline"></Icon></Button>
                </div>
               
            </Row>
          <Tables :columns="columns1" :total="totalRecord" :show-total="false" @on-change="pageChange" :currentPage="currentPage" :data="data1" v-model="data1" ref="table" :height="600">
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
    this.checkedData = this.columns1
    this.dateOptions = 'TODAY'
    this.dataValue = this.options2.shortcuts[0].value()
    this.totalRecord = 0
    this.getUserId()
    this.getCheckList()
  },
  watch: {},
  name: 'directive_page',
  data () {
    return {
      autoCompletedata: [],
      id: '',
      userId: '',
      pageNum: 1,
      oldPageNum: 1,
      pageMax: 0,
      pageArray: [1],
      pageFlag: true,
      currentPage: 1,
      totalRecord: 0,
      schoolId: '',
      classId: '',
      check: '',
      checkCode: [],
      checkValue: [],
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
      columns1: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'studentName',
          align: 'center'
        },
        {
          title: 'IMEI',
          key: 'imei',
          align: 'center'
        },
        {
          title: '所属学校',
          key: 'schoolName',
          align: 'center'
        },
        {
          title: '告警类型',
          key: 'alarmType',
          align: 'center',
          render:  (h, params) => {
            return h ('div', [
              h (
                'p',
                {
                  style: {
                    color: this.getTypeColor(params.index)
                  }
                },
                this.data1[params.index].alarmType
              )
            ])
          }
        },
        {
          title: '告警时间',
          key: 'alarmTime',
          align: 'center'
        },
        {
          title: '定位时间',
          key: 'locationTime',
          align: 'center'
        },
        {
          title: '定位状态',
          key: 'locationStatus',
          align: 'center'
        },
        {
          title: '告警地址',
          key: 'alarmSite',
          align: 'center'
        },
        {
          title: '已读状态',
          key: 'readStatus',
          align: 'center'
        }
      ],
      data5: [],
      checkList: [
      ],
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
      data1: [],
      modalVisible: false,
      options: {
        trigger: '.ivu-modal-body',
        body: '.ivu-modal',
        recover: true
      },
      buttonOptions: {
        trigger: '.draggable-btn',
        body: '.draggable-btn'
      },
      statu: 1,
      listArr: []
    }
  },
  watch: {
    pageNum(ne, ol) {
      this.oldPageNum = ol
    }
  },
  computed: {
    obj: function (argument) {
      return Object.freeze(this.columns1)
    }
  },
  deactivated () {
    this.$destroy(true)
  },
  methods: {
    comparePage () {
      this.pageArray.push(this.pageNum)
      this.uniq(this.pageArray)
      let max = Math.max.apply(null,this.uniq(this.pageArray))
      if (this.pageNum >= max && this.oldPageNum !== max) {
        this.pageFlag = true
      } else {
        this.pageFlag = false
      }
    },
    uniq (array) {
    let temp = []
    for (let i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i])
      }
    }
      return temp
    },
    warning () {
      this.$Message.warning('请输入学生姓名或IMEI号进行搜索')
    },
    warnings () {
      this.$Message.warning('查找不到您搜索的信息')
    },
    getCheckList () {
      getTableData ('/proxy/alarm/status')
        .then (res => {
          this.checkList = res.data
          console.log(this.checkList)
        })
        .catch (err => {
          console.log(err)
        })
    },
    getTotal () {
      if (this.data1.length >= 20) {
        this.totalRecord = 21
      } else {
        this.totalRecord = 20
      }
    },
    pageChange (val) {
      this.pageNum = val
      this.currentPage = val
      this.oldPageNum = 1
      this.comparePage()
      getTableData ('/proxy/report/stat/alarm/details', {
        schoolId: this.schoolId,
        classId: this.classId,
        type: this.check,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        pageNum: this.pageNum,
        query: this.getSearchValue()
      })
        .then (res => {
          if  (res.data) {
            this.data1 = res.data.result
            if (this.data1.length < 20) {
              this.pageMax = this.pageNum
            }
            if (this.data1.length >= 20 && this.pageFlag && this.pageMax === 0) {
              this.totalRecord = this.totalRecord + 20
            }
          } else {
            this.data1 = []
          }
        })
        .catch (err => {
          console.log(err)
        })
        console.log(this.totalRecord)
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
    trim (str,is_global) {
      let result
      result = str.replace(/(^\s+)|(\s+$)/g,"");
      if(is_global.toLowerCase()=="g")
      {
        result = result.replace(/\s/g,"");
      }
      return result;
    },
    getUserId () {
      if (this.$route.params.userId) {
        this.initTreeData(this.$route.params.userId)
      } else {
        this.jumpShow()
      }
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
    getTypeColor (index) {
      if  (
        this.data1[index].alarmType == 'SOS报警' ||
        this.data1[index].alarmType == '危险区域报警'
      ) {
        return  (this.typeFontColor = 'red')
      } else {
        return  (this.typeFontColor = '')
      }
    },
    jumpShow () {
      if  (this.$route.params.queryParam) {
        this.initSearchTree ()
        this.check = this.$route.params.queryParam
        this.schoolId = this.$route.params.schoolId
        this.classId = this.$route.params.classId
        this.dateOptions = this.$route.params.time
        this.startTime = this.$route.params.startTime
        this.endTime = this.$route.params.endTime
        this.searchValue = this.$route.params.query
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
          .then (res => {
            if  (res.data) {
              this.data1 = res.data.result
              this.getTotal()
            } else {
              this.data1 = []
            }
          })
          .catch (err => {
            console.log(err)
          })
      } else {
        this.check = 'all'
        this.initTreeData()
      }
    },
    initSearchTree (data) {
      let params = data
      getTableData ('/proxy/class/listClassTree', params)
        .then(res => {
          this.formatTreeData(res.data)
          this.isExpandAll = true
          this.data5 = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    initTreeData (data) {
      let params = data
      getTableData ('/proxy/class/listClassTree', params)
        .then(res => {
          this.formatTreeData (res.data)
          this.isExpandAll = true
          this.data5 = res.data
          if (data) {
            this.userId = data
          }
          this.getFirstSchool (this.data5[0])
          getTableData ('/proxy/report/stat/alarm/details', {
            schoolId: this.schoolId,
            type: this.check,
            time: 'TODAY',
            classId: this.classId,
            pageNum: 1
          })
            .then(res => {
              if  (res.data) {
                this.data1 = res.data.result
                this.getTotal()
              } else {
                this.data1 = []
                this.totalRecord = 0
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch (err => {
          console.log(err)
        })
    },
    formatTreeData (data) {
      data.forEach(item => {
        item.title = item.name
        item.children != undefined && this.formatTreeData(item.children)
      })
    },
    getFirstSchool (data) {
      if  (data.schoolId == null) {
        // data.expand = true
        if  (data.children[0].schoolId == null) {
          this.getFirstSchool (data.children[0])
          // data.children[0].expand = true
        } else {
          this.schoolId = data.children[0].schoolId
          this.statUnit = data.children[0].name
          this.userId = data.children[0].userId
        }
      } else {
        this.schoolId = data.schoolId
        this.statUnit = data.name
        this.userId = data.userId
      }
    },
    onSelectChange (root, node, data) {
      if (root[0]) {
        if (root[0].schoolId) {
          this.schoolId = root[0].schoolId
          if (root[0].classId) {
            this.classId = root[0].classId
          } else {
            this.classId = ''
          }
        } else {
          root[0].selected = false
        }
      }
    },
    add (time) {
      return time < 10 ? '0' + time : time
    },
    getRightTime (d) {
      let rightTime =
        this.add(d.getFullYear()) +
        '-' +
        this.add(d.getMonth() + 1) +
        '-' +
        this.add(d.getDate()) +
        ' ' +
        this.add(d.getHours()) +
        ':' +
        this.add(d.getMinutes()) +
        ':' +
        this.add(d.getSeconds())
      return rightTime
    },
    onTimeChange (datetimerange) {
      this.dataValue = datetimerange
      this.startTime = this.getRightTime (new Date (this.dataValue[0]))
      this.endTime = this.getRightTime (new Date (this.dataValue[1]))
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

