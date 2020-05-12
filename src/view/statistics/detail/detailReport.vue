<template>
  <div>
    <Row :gutter="16">
      <Col span="24">
        <Card style="height:82vh; overflow-y:auto">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              明细表
          </p>
          <Row class="table-top" style="marginBottom: 11px;">
            <div style="float: left;">
              <Select v-model="queryParams.pdtId" style="width:160px; marginRight:5px" :filterable="true" placeholder="PDT" @on-change="pdtChange" :clearable="true">
                  <Option v-for="item in pdtList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-model="queryParams.projectId" style="width:160px; marginRight:5px" :filterable="true" placeholder="项目名称" :clearable="true">
                <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Input v-model="queryParams.dingTalkUserName" style="width:160px; marginRight:5px"  placeholder="填写人名称" :clearable="true"/>
              <Input v-model="queryParams.departmentName" style="width:160px; marginRight:5px"  placeholder="部门名称" :clearable="true"/>
              <Input v-model="queryParams.position" style="width: 160px; marginRight: 5px"  placeholder="岗位名称" :clearable="true"/>
              <Date-picker type="daterange" v-model="queryParams.dailyDate" placeholder="选择日期" style="width: 160px" @on-change="onDateChange" format="yyyy-MM-dd" value="yyyy-MM-dd"></Date-picker>
              <Button style="marginRight:5px; marginLeft:5px" type="primary" @click="searchDetail">查询</Button>
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
import Tables from '_c/tables';
import { getTableData, getExportData } from '@/api/data';
export default {
    components: {
      Tables
    },
    created () {},
    mounted () {
        this.totalRecord = 0;
        this.getPdtList();
        this.initTableData();
    },
    name: 'DetailReport',
    data () {
      return {
          pageNum: 1,
          pageSize: 20,
          currentPage: 1, // 当前页
          totalRecord: 0, // 总条数
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
                  title: '进度百分比(%)',
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
              }
          ],
          pdtList: [], // pdt 下拉数据
          projectList: [], // 项目下拉数据
          detailData: [], // 明细表列表数据 
          modalVisible: false,
          queryParams: { // 查询参数
              position:'', // 岗位名称
              dailyDate: '', // 上报日期
              pdtId: '', // pdt id
              projectId: '', // 项目id
              dingTalkUserName: '', // 填写人名称
              departmentName: '' // 部门名称
          } 
      };
    },
    methods: {
      // pdt 列表 change 事件
      pdtChange(val) {
        this.getProjectList(val);
      },
      // 日期切换
      onDateChange(val) {
          debugger;
          this.queryParams.dailyDate = val[0];
      },
      // 获取 pdt 列表
      getPdtList () {
          getTableData ('/proxy/attendance/pdt/selPdt')
              .then (res => {
                  debugger;
                  const list = res.data.list;
                  let data = [];
                  list.forEach(element => {
                      data.push({value: element.id, label: element.pdtName});
                  });
                  this.pdtList = data;
              })
              .catch (err => {
                  console.log(err);
              });
      },
      // 获取项目列表
      getProjectList(id) {
          getTableData ('/proxy/attendance/project/selProjectByPdtId', {pdtId: id})
              .then (res => {
                  debugger;
                  const list = res.data.list;
                  let data = [];
                  list.forEach(element => {
                      data.push({value: element.id, label: element.projectName});
                  });
                  this.projectList = data;
              })
              .catch (err => {
                  console.log(err);
              });
      },
        // 初始化报表数据
        initTableData(val) {
            debugger;
            let params = Object.assign(val || {}, {pageNum: this.pageNum,  pageSize: this.pageSize,});
            getTableData ('/proxy/attendance/daily/selDaily', params)
                .then (res => {
                    if (res.data) {
                        debugger;
                        this.detailData = res.data.list;
                        this.totalRecord = res.data.total;
                    } else {
                        this.detailData = [];
                    }
                })
                .catch (err => {
                    console.log(err);
                });
            console.log(this.totalRecord);
        },
        // 页码切换
        pageChange (val) {
            this.pageNum = val;
            this.currentPage = val;
            this.initTableData();
        },
        // 获取请求参数
        getQueryParams() {
            let obj = {};
            const queryParams = this.queryParams;
            const keys = Object.keys(queryParams);
            keys.forEach((item) => {
                if (queryParams[item]) {
                    obj[item] = queryParams[item];
                }
            });
            return obj;
        },
        // 根据查询条件搜索明细表
        searchDetail() {
            const params = this.getQueryParams();
            this.pageNum = 1;
            this.initTableData(params);
        },
        // TODO 导出Excel报表
        exportDatas() {
            const params = this.getQueryParams();
            /**
       * 方法一：直接请求，打开新窗口，通过 url-parse 解析拼装请求参数
       */
            // const parsed = this.$parse()
            // parsed.set('pathname', '/proxy/attendance/report/selReportByFinanceExport')
            // parsed.set('query', params)
            // window.open(parsed.href)
            if (this.detailData.length === 0) {
                this.$Message.warning('当前无数据，无法导出');
            } else {
                getExportData('/proxy/attendance/daily/selDailyExport', params)
                    .then(res => {
                        /**
                         * 方法二：通过返回 Blob 文件
                         */
                        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', '明细表.xlsx');
                        link.click();
                        link.remove();
                })
                .catch(err => {
                    console.log(err);
                });
            }
        },
        // 页数切换
        pageSizeChange (val) {
            // this.pageNum = 1
            this.pageSize = val;
            this.initTableData();
        }
    }
};
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

