<template>
  <div>
    <Row :gutter="16">
      <Col span="24">
        <Card style="height:84vh; overflow-y:auto">
          <p slot="title">
            <Icon type="android-contact"></Icon>
              财务统计表
          </p>
          <Row class="table-top" style="marginBottom: 11px;">
            <div style="float: left;">
              <Input v-model="queryParams.dingTalkUserName"  style="width:160px; marginRight:5px"  placeholder="填写人名称" :clearable="true"/>
              <Input v-model="queryParams.jobNumber"  style="width:160px; marginRight:5px"  placeholder="工号" :clearable="true"/>
              <Date-picker type="year" placeholder="选择日期" style="width: 160px" @on-change="onDateChange" format="yyyy" :value="year"></Date-picker>
              <Button style="marginRight:5px; marginLeft:5px" type="primary" @click="searchFinance">查询</Button>
              <Button style="marginRight:5px" type="primary" @click="exportDatas()">导出<Icon type="ios-download-outline"></Icon></Button>
            </div>
          </Row> 
          <Tables :columns="financeColumns" :totalPage="totalRecord" :show-total="false" @on-page-change="pageChange" :currentPage="currentPage" :data="financeData" v-model="financeData" ref="table" :height="600" @on-page-size-change="pageSizeChange">
          </Tables>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import Tables from '_c/tables';
import { getTableData, getExportData} from '@/api/data';

export default {
    components: {
        Tables
    },
    created () {},
    mounted () {
    // this.year = String(new Date().getFullYear())
        debugger;
        this.totalRecord = 0;
        this.getPdtList();
        this.initTableData();
    },
    name: 'FinanceReport',
    data () {
        return {
            pageNum: 1,
            pageSize: 20,
            currentPage: 1, // 当前页
            totalRecord: 0, // 总条数
            financeColumns: [ // 明细表
                {
                    title: '工号',
                    key: 'job_number',
                    align: 'center'
                },
                {
                    title: '填写人姓名',
                    key: 'ding_talk_user_name',
                    align: 'center'
                }
            ],
            pdtList: [], // pdt 下拉数据
            projectList: [], // 项目下拉数据
            financeData: [], // 明细表列表数据 
            modalVisible: false,
            year: String(new Date().getFullYear()), // 年度查询
            queryParams: { // 查询参数
                jobNumber: '', // 项目id
                dingTalkUserName: '', // 填写人名称
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
            this.year = val;
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
            let params = Object.assign(val || {}, {pageNum: this.pageNum,  pageSize: this.pageSize, year: this.year});
            getTableData ('/proxy/attendance/report/selReportByFinance', params)
                .then (res => {
                    if (res.data) {
                        debugger;
                        this.financeData = res.data.list;
                        this.totalRecord = res.data.total;
                        const tempObj = res.data.list[0];
                        const keys = Object.keys(tempObj);
                        let financeArr = [];
                        this.$data.financeColumns = this.$options.data().financeColumns;
                        keys.forEach(res => {
                            if (res != 'ding_talk_user_name' && res != 'job_number') {
                                this.financeColumns.push({title: res, key: res, align: 'center'});
                            }
                        });
                    } else {
                        this.financeData = [];
                    }
                })
                .catch (err => {
                    console.log(err);
                });
            console.log(this.totalRecord);
        },
        // 页码切换
        pageChange(val) {
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
        searchFinance() {
            const params = this.getQueryParams();
            this.pageNum = 1;
            this.initTableData(params);
        },
        // TODO 导出Excel报表
        exportDatas () {
            const params = this.getQueryParams();
            /**
       * 方法一：直接请求，打开新窗口，通过 url-parse 解析拼装请求参数
       */
            // const parsed = this.$parse()
            // parsed.set('pathname', '/proxy/attendance/report/selReportByFinanceExport')
            // parsed.set('query', params)
            // window.open(parsed.href)
            if (this.financeData.length === 0) {
                this.$Message.warning('当前无数据，无法导出');
            } else {
                getExportData ('/proxy/attendance/report/selReportByFinanceExport', params)
                    .then(res => {
                        /**
           * 方法二：通过返回 Blob 文件
           */
                        debugger;
                        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', '财务统计表.xlsx');
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
            this.pageNum = 1;
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

