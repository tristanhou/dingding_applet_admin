<template>
  <div>
    <Row :gutter="16">
      <Col span="4">
        <Card style="height:88vh">
          <p slot="title">
              <Icon type="android-contact"></Icon>
              客户列表
          </p>
          <Tree @on-select-change="onSelectChange" :isExpandAll="isExpandAll" :dataTree="data5" @auto-complete-change="autoCompleteChange" :dataAuto="autoCompletedata" :isAutoComplete="true"  :userId="userId"></Tree>
        </Card>
      </Col>
      <Col span="20">
        <Card style="height:88vh; overflow-y:auto">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              考勤详情统计
          </p>
          <p slot="extra">最多查询3个月考勤记录</p>
          <Row class="table-top">
                <div style="float: left;">
                    <Select v-model="check" style="width:110px; marginRight:5px">
                        <Option v-for="item in checkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <DatePicker  type="datetimerange" :options="options2" placement="bottom-start" @on-change="onTimeChange" placeholder="请选择要查询的考勤日期起始时间" :value="dataValue" style="width: 300px"></DatePicker>
                    <Button style="marginRight:5px; marginLeft:5px" type="primary" @click="seek()">查询</Button>
                    <Button style="marginRight:5px" type="primary" @click="exportDatas()">导出<Icon type="ios-download-outline"></Icon></Button>
                </div>
                <div style="float: right;width: 260px">
                    <Input v-model="searchValue" search enter-button="搜索" placeholder="搜索学生姓名或IMEI号" @on-search="search()"/>
                </div>
            </Row>
            <Row class="table-top">
                <p style="float:left">{{ statUnit }} {{ attendanceRatio }}</p>
                <p style="float:right">（正常考勤设备/正常考勤设备+异常考勤设备）*100 = 考勤率</p>
            </Row>
          <Tables :columns="columns1" :total="totalRecord" :show-total="false" @on-change="pageChange" :data="data1" v-model="data1" :currentPage="currentPage" ref="table" :height="659">
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
    this.dateOptions = 'YESTERDAY'
    this.check = 'ALL'
    this.dataValue = this.options2.shortcuts[1].value();
    this.showTime = this.getShowTime(this.dataValue[0])
    this.getUserId()
  },
  name: 'directive_page',
  data () {
    return {
      autoCompletedata: [],
      userId: '',
      attendanceRatio: 0,
      pageNum: 1,
      oldPageNum: 1,
      pageMax: 0,
      pageArray: [1],
      pageFlag: true,
      currentPage: 1,
      totalRecord: 0,
      isExpandAll: null,
      showTime: '',
      statUnit: '',
      dataValue: null,
      searchValue: '',
      check: '',
      totalRecord: 0,
      startTime: '',
      endTime: '',
      classId: '',
      schoolId: '',
      dateOptions: '',
      columns1: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '学校名称',
          key: 'schoolName',
          align: 'center'
        },
        {
          title: '班级',
          key: 'className',
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
          title: 'SIM卡号',
          key: 'sim',
          align: 'center'
        },
        {
          title: '设备型号',
          key: 'mcType',
          align: 'center'
        },
        {
          title: '考勤状态',
          key: 'status',
          align: 'center'
        },
        {
          title: '考勤时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '备注',
          key: 'explain',
          align: 'center'
        }
      ],
      data5: [],
      checkList: [
        {
          value: 'ALL',
          label: '所有考勤'
        },
        {
          value: 'IN',
          label: '进校考勤'
        },
        {
          value: 'OUT',
          label: '离校考勤'
        },
        {
          value: 'IN_UNATTENDANCE',
          label: '进校未考勤'
        },
        {
          value: 'OUT_UNATTENDANCE',
          label: '离校未考勤'
        }
      ],
      options2: {
        disabledDate (date) {
          return (
            (date && date.valueOf() < Date.now() - 86400000 * 90) ||
            date.valueOf() > Date.now()
          )
        },
        shortcuts: [
          {
            text: '今天',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime())
              end.setTime(end.getTime())
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
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
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
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
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
              const end = new Date()
              const start = new Date()
              function getFirstDayOfWeek (date) {
                var day = date.getDay() || 7
                return new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1 - day
                )
              }
              start.setTime(getFirstDayOfWeek(start))
              return [start, end]
            },
            onClick: picker => {
              this.dateOptions = 'THISWEEK'
            }
          },
          {
            text: '上周',
            value () {
              const end = new Date()
              const start = new Date()
              function getFirstDayOfWeek (date) {
                var day = date.getDay() || 7
                return new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1 - day - 7
                )
              }
              function getLastDayOfWeek (date) {
                var day = date.getDay() || 7
                return new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1 - day - 1
                )
              }
              start.setTime(getFirstDayOfWeek(start))
              end.setTime(getLastDayOfWeek(end))
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
              const end = new Date()
              const start = new Date()
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
              const end = new Date()
              const start = new Date()
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
              const end = new Date()
              const start = new Date()
              return [start, end]
            }
          }
        ]
      },
      value: [],
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
      getTableData('/proxy/report/stat/attendance', {
        schoolId: this.schoolId,
        type: this.check,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        query: this.getSearchValue(),
        classId: this.classId,
        pageNum: this.pageNum
      })
        .then(res => {
          if (res.data) {
            this.data1 = res.data.result
            if (this.data1.length < 20) {
              this.pageMax = this.pageNum
            }
            if (this.data1.length >= 20 && this.pageFlag && this.pageMax === 0) {
              this.totalRecord = this.totalRecord + 20
            }
            this.totalRecord = res.data.total
            this.statUnit = res.data.statUnit
          } else {
            this.data1 = []
            this.totalRecord = 0
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    warning () {
      this.$Message.warning('请输入学生姓名或IMEI号进行搜索')
    },
    warnings () {
      this.$Message.warning('查找不到您搜索的信息')
    },
    getSearchValue () {
      return this.trim(this.searchValue, 'g')
    },
    trim (str,is_global) {
        let result
        result = str.replace(/(^\s+)|(\s+$)/g,"")
        if(is_global.toLowerCase()=="g")
        {
          result = result.replace(/\s/g,"")
        }
        return result
    },
    error () {
      this.$Message.error('请选择学校或班级进行查询');
    },
    getUserId () {
      if (this.$route) {
        this.initTreeData(this.$route.params.userId)
      } else {
        this.initTreeData()
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
    initTreeData (data) {
      getTableData('/proxy/class/listClassTree')
        .then(res => {
          this.formatTreeData(res.data)
          this.isExpandAll = true
          this.data5 = res.data
          if (data) {
            this.userId = data
          }
          this.getFirstSchool(this.data5[0])
          getTableData('/proxy/report/stat/attendance', {
            schoolId: this.schoolId,
            type: 'ALL',
            time: 'YESTERDAY',
            classId: this.classId,
            pageNum: 1
          })
            .then(res => {
              if (res.data) {
                this.data1 = res.data.result
                this.getTotal()
                this.totalRecord = res.data.total
                this.statUnit = res.data.statUnit
                this.attendanceRatio = res.data.attendanceRatio
              } else {
                this.data1 = []
                this.totalRecord = 0
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
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
      if (data.schoolId == null) {
        if (data.children[0].schoolId == null) {
          this.getFirstSchool(data.children[0])
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
    getShowTime (d) {
      let rightTime =
        d.getFullYear() +
        '年' +
        (d.getMonth() + 1) +
        '月' +
        d.getDate() +
        '日' +
        '的考勤率为'
      return rightTime
    },
    onTimeChange (datetimerange) {
      this.dataValue = datetimerange
      this.startTime = this.getRightTime(new Date(this.dataValue[0]))
      this.endTime = this.getRightTime(new Date(this.dataValue[1]))
    },
    seek () {
      if(this.schoolId) {
        this.pageNum = 1
        this.pageMax = 0
        this.oldPageNum = 1
        this.pageArray = [1]
        this.currentPage = 1
        this.searchValue = ''
        getTableData('/proxy/report/stat/attendance', {
          schoolId: this.schoolId,
          type: this.check,
          time: this.dateOptions,
          startTime: this.startTime,
          endTime: this.endTime,
          classId: this.classId,
          pageNum: 1
        })
          .then(res => {
            if (res.data) {
              this.data1 = res.data.result
              this.getTotal()
              this.totalRecord = res.data.total
              this.statUnit = res.data.statUnit
              this.attendanceRatio = res.data.attendanceRatio
            } else {
              this.data1 = []
              this.totalRecord = 0
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
        getTableData('/proxy/report/stat/attendance', {
        schoolId: this.schoolId,
        type: this.check,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        query: this.getSearchValue(),
        classId: this.classId,
        pageNum: 1
      })
        .then(res => {
          if (res.data) {
            this.data1 = res.data.result
            this.getTotal()
            this.totalRecord = res.data.total
            this.statUnit = res.data.statUnit
          } else {
            this.data1 = []
            this.warnings()
            this.totalRecord = 0
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
        getTableData('/proxy/report/stat/attendance/export', {
        schoolId: this.schoolId,
        type: this.check,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        query: this.getSearchValue(),
        classId: this.classId
        })
        .then(res => {
          let baseUrl = '/proxy/report/stat/attendance/export'
          const finalUrl = `${baseUrl}?schoolId=${this.schoolId}&type=${
            this.check
          }&time=${this.dateOptions}&startTime=${this.startTime}&endTime=${
            this.endTime
          }&query=${this.getSearchValue()}&classId=${this.classId}`
          window.location.href = finalUrl
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  },
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
