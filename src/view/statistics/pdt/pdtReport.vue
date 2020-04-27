<template>
  <div>
    <Row :gutter="16">
      <Col span="4">
        <Card style="height:88vh">
          <p slot="title">
              <Icon type="android-contact"></Icon>
              客户列表
          </p>
          <Tree @on-select-change="onSelectChange" :isExpandAll="isExpandAll" :dataTree="data5" @auto-complete-change="autoCompleteChange" :dataAuto="autoCompletedata" :isAutoComplete="true" :userId="userId"></Tree>
        </Card>
      </Col>
      <Col span="20">
        <Card style="height:88vh; overflow-y:auto">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              告警总揽
          </p>
          <p slot="extra">最多查询3个月告警记录</p>
          <Row class="table-top" style="marginBottom: 11px;">
                <div style="float: left;">
                    <DatePicker type="datetimerange" :options="options2" placement="bottom-start" @on-change="onTimeChange" placeholder="请选择要查询的考勤日期起始时间" :value="dataValue" style="width: 300px"></DatePicker>
                    <Button style="marginRight:5px; marginLeft:5px" type="primary"  @click="seek ()">查询</Button>
                    <Button style="marginRight:5px" type="primary" @click="exportDatas ()">导出<Icon type="ios-download-outline"></Icon></Button>
                </div>
                <div style="float: right;width: 260px">
                    <Input search enter-button="搜索" placeholder="搜索学生姓名或IMEI号" v-model="searchValue" @on-search="search ()"/>
                </div>
            </Row>
          <Tables :columns="columns1" :highlight-row="true" :total="totalRecord" :data="data1" v-model="data1"  @on-change="pageChange" :currentPage="currentPage" ref="table" :height="678" @on-current-change="handleRowChange">
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
    this.getUserId()
  },
  name: 'directive_page',
  data () {
    return {
      autoCompletedata: [],
      id: '',
      userId: '',
      totalRecord: 0,
      dataValue: null,
      dateOptions: '',
      startTime: '',
      schoolId: '',
      currentPage: 1,
      isExpandAll: null,
      classId: '',
      endTime: '',
      searchValue: '',
      startTimeOption: {},
      endTimeOption: {},
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
          title: 'SOS求救',
          key: 'sos',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'p',
                {
                  style: {
                    cursor: 'pointer',
                    color: 'blue'
                  },
                  on: {
                    click: () => {
                      this.updateRole(params.index, '1')
                    }
                  }
                },
                this.data1[params.index].sos
              )
            ])
          }
        },
        {
          title: '危险区域报警',
          key: 'dangerArea',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'p',
                {
                  style: {
                    cursor: 'pointer',
                    color: 'blue'
                  },
                  on: {
                    click: () => {
                      this.updateRole(params.index, 'riskPointAlarm')
                    }
                  }
                },
                this.data1[params.index].dangerArea
              )
            ])
          }
        },
        {
          title: '换卡报警',
          key: 'simPullOut',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'p',
                {
                  style: {
                    cursor: 'pointer',
                    color: 'blue'
                  },
                  on: {
                    click: () => {
                      this.updateRole(params.index, '16')
                    }
                  }
                },
                this.data1[params.index].simPullOut
              )
            ])
          }
        },
        {
          title: '内部电池低电报警',
          key: 'lowBattery',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'p',
                {
                  style: {
                    cursor: 'pointer',
                    color: 'blue'
                  },
                  on: {
                    click: () => {
                      this.updateRole(params.index, '90')
                    }
                  }
                },
                this.data1[params.index].lowBattery
              )
            ])
          }
        },
        {
          title: '开机报警',
          key: 'startingUp',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'p',
                {
                  style: {
                    cursor: 'pointer',
                    color: 'blue'
                  },
                  on: {
                    click: () => {
                      this.updateRole(params.index, '12')
                    }
                  }
                },
                this.data1[params.index].startingUp
              )
            ])
          }
        },
        {
          title: '关机报警',
          key: 'shutdown',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'p',
                {
                  style: {
                    cursor: 'pointer',
                    color: 'blue'
                  },
                  on: {
                    click: () => {
                      this.updateRole(params.index, '17')
                    }
                  }
                },
                this.data1[params.index].shutdown
              )
            ])
          }
        },
        {
          title: '离线告警',
          key: 'offline',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'p',
                {
                  style: {
                    cursor: 'pointer',
                    color: 'blue'
                  },
                  on: {
                    click: () => {
                      this.updateRole(params.index, 'offline')
                    }
                  }
                },
                this.data1[params.index].offline
              )
            ])
          }
        }
      ],
      data5: [],
      options2: {
        disabledDate (date) {
          return (
            (date && date.valueOf() < Date.now() - 86400000 * 45) ||
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
  computed: {
    obj: function (argument) {
      return Object.freeze(this.columns1)
    }
  },
  methods: {
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
      result = str.replace(/(^\s+)|(\s+$)/g,"");
      if(is_global.toLowerCase()=="g")
      {
        result = result.replace(/\s/g,"");
      }
      return result;
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
    updateRole (index, type) {
      this.$router.push({
        name: 'alarm_details',
        params: {
          queryParam: type,
          time: this.dateOptions,
          startTime: this.startTime,
          endTime: this.endTime,
          query: this.data1[index].imei,
          schoolId: this.schoolId,
          classId: this.classId
        }
      })
    },
    handleRowChange (currentRow, oldCurrentRow) {},
    initTreeData (data) {
      let params = data
      getTableData('/proxy/class/listClassTree', params)
        .then(res => {
          this.formatTreeData(res.data)
          this.isExpandAll = true
          this.data5 = res.data
          if (data) {
            this.userId = data
          }
          this.getFirstSchool(this.data5[0])
          getTableData('/proxy/report/stat/alarm', {
            schoolId: this.schoolId,
            time: 'TODAY',
            pageNum: 1
          })
            .then(res => {
              if (res.data) {
                this.data1 = res.data.result
                this.totalRecord = res.data.totalRecord
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
        // data.expand = true
        if (data.children[0].schoolId == null) {
          this.getFirstSchool(data.children[0])
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
    pageChange (val) {
      this.currentPage = val
      getTableData('/proxy/report/stat/alarm', {
        schoolId: this.schoolId,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        pageNum: val,
        query: this.getSearchValue(),
      })
        .then(res => {
          console.log(res)
          if (res.data) {
            this.data1 = res.data.result
            this.totalRecord = res.data.totalRecord
          } else {
            this.data1 = []
          }
        })
        .catch(err => {
          console.log(err)
        })
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
      this.startTime = this.getRightTime(new Date(this.dataValue[0]))
      this.endTime = this.getRightTime(new Date(this.dataValue[1]))
    },
    seek () {
      this.currentPage = 1
      this.searchValue = ''
      if (this.schoolId) {
        getTableData('/proxy/report/stat/alarm', {
          schoolId: this.schoolId,
          classId: this.classId,
          time: this.dateOptions,
          startTime: this.startTime,
          endTime: this.endTime,
          pageNum: 1
        })
          .then(res => {
          console.log(res)
            if (res.data) {
              this.data1 = res.data.result
              this.totalRecord = res.data.totalRecord
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
      this.currentPage = 1
      if (this.searchValue === '') {
        this.warning()
      } else {
        getTableData('/proxy/report/stat/alarm', {
        schoolId: this.schoolId,
        classId: this.classId,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        query: this.getSearchValue(),
        pageNum: 1
        })
        .then(res => {
          if (res.data) {
            this.data1 = res.data.result
            this.totalRecord = res.data.totalRecord
          } else {
            this.data1 = []
            this.totalRecord = 0
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
        getTableData('/proxy//report/stat/alarm/export', {
        schoolId: this.schoolId,
        classId: this.classId,
        time: this.dateOptions,
        startTime: this.startTime,
        endTime: this.endTime,
        query: this.getSearchValue()
      })
        .then(res => {
          let baseUrl = '/proxy/report/stat/alarm/export'
          const finalUrl = `${baseUrl}?schoolId=${this.schoolId}&query=${
            this.getSearchValue()
          }&time=${this.dateOptions}&startTime=${this.startTime}&classId=${
            this.classId
          }&endTime=${this.endTime}`
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
  padding-bottom: 20px;
  background: #fff;
}
</style>

