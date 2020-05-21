<template>
  <section style="margin-bottom: 20px; position: relative;">
        <Select v-model="queryParams.pdtId"  :filterable="true" placeholder="PDT" :clearable="true" style="width:160px; marginRight:5px">
            <Option v-for="item in pdtList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input v-model="queryParams.projectName" style="width:160px; marginRight:5px"  placeholder="项目名称" :clearable="true"/>
        <Button icon="md-search" @click="fireSearch" style="marginRight:5px">搜索</Button>
        <Button icon="md-add" @click="addSchedule" type="primary">新增</Button>

    <!-- <div style="float: right;width: 260px">
      <Input search enter-button="搜索" placeholder="搜索项目" @on-search="classSearch" v-model="searchModel"/>
    </div> -->
    <Modal
      :styles="{top: '200px'}"
      v-model="customerModel"
      v-bind:title= "modalTitle"
      @on-ok="ok"
      :mask="true"
      :footer-hide="true" 
      transfer
      :mask-closable="false">
        <Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formValidate">
          <FormItem label="PDT" prop="pdtId">
            <Select v-model="formItem.pdtId"  :filterable="true" placeholder="PDT">
              <Option v-for="item in pdtList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="项目名称" prop="projectName">
              <Input v-model="formItem.projectName" placeholder="项目名称"></Input>
          </FormItem>
          <FormItem label="项目经理" prop="projectManagerId">
            <Select v-model="formItem.projectManagerId" style="width:100%; marginRight:5px"  placeholder="项目经理名称" :clearable="true">
              <Option v-for="item in projectManagerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <!-- <Input v-model="formItem.projectManagerId" placeholder="请输入项目经理名称"></Input> -->
          </FormItem>          
          <FormItem label="描述" prop="projectDesc">
            <Input v-model="formItem.projectDesc" placeholder="请输入描述"></Input>
          </FormItem>
          <FormItem style="text-align: right;">
            <Button type="primary" @click="handleSubmit('add')">提交</Button>
            <Button style="margin-left: 8px"  @click="handleRemove()">取消</Button>
          </FormItem>
        </Form>
    </Modal> 
  </section>
</template>
<script>
import { changeData, getTableData } from '@/api/data';
import bus from '_c/bus.js';
export default {
    name: 'button-box',
    props: {
        selection: {
            type: Array
        },
        columns: {
            type: Array
        }
    },
    components: {
  
    },
    data () {
        return {
            customerModel: false,
            modalTitle: '', // 弹框标题
            projectManagerList: [], // 
            pdtList: [],
            formItem: {
                pdtId: '',
                projectName: '',
                projectDesc: '',
                projectManagerId: '',
            },
            ruleValidate: {
                pdtId: [
                    {required: true, message: '请选择PDT名称', trigger: 'change'},
                ],
                projectName: [
                    {required: true, message: '请输入项目名称', trigger: 'blur'},
                    {type: 'string', max: 50, message: '项目名称不能超过50个字符', trigger: 'blur' },
                    // {pattern: /^[\u4e00-\u9fa5\._a-zA-Z0-9]+$/, message: '请不要输入特殊字符', trigger: 'blur'}
                ],
                projectDesc: [
                    // {required: true, message: '请输入描述', trigger: 'blur'},
                    {type: 'string', max: 150, message: '描述不能超过150个字符', trigger: 'blur' },
                    // {pattern: /^[\u4e00-\u9fa5\._a-zA-Z0-9]+$/, message: '请不要输入特殊字符', trigger: 'blur'}
                ],
                projectManagerId: [
                    {required: true, message: '请选择项目经理', trigger: 'change'},
                ],
            },
            queryParams: {
               pdtId: '',
               projectName: ''
            },
            page: {
                pageNum: 1,
                pageSize: 100,
                id: 4
            },
            userId: '',
            classId: null,
            schoolId: null,
            searchModel: ''
        };
    },
    mounted () {
        this.getPdtList();
        this.getUserRoleList();
        bus.$on('editSchedule', item => {
            this.editSchedule(item)
        })
    },
    methods: {
        fireSearch() {
            bus.$emit('search', this.queryParams)
        },
        // 打开新增列表弹框
        exportSchedule () {
            this.scheduleModel = false;
            this.importModel = true;
        },
        addSchedule () {
            this.modalTitle = '新增项目';
            this.customerModel = true;
           
            for (var i in this.formItem) {
                this.formItem[i] = '';
            }
            this.url = '/proxy/attendance/project/addProject';
            this.$refs['formValidate'].resetFields();
        },
        getUserId (data, schoolId) {
            data.forEach((item) => {
                if (item.schoolId == schoolId) {
                    if (item.userId != null) {
                        this.userId = item.userId;
                    }
                }
                item.children != null && this.getUserId(item.children, schoolId);
            });
        },
        // 打开编辑列表弹框
        editSchedule(item) {
            debugger;
            this.customerModel = true;
            this.modalTitle = '修改';
            this.formItem['id'] = item['id'];
            this.formItem['pdtId'] = item['pdtId'];
            this.formItem['projectName'] = item['projectName'];
            this.formItem['projectDesc'] = item['projectDesc'];
            this.formItem['projectManagerId'] = item['projectManagerId'];
            this.url = '/proxy/attendance/project/updProject';     
        },
        ok () {
            this.$Message.info('Clicked ok');
        },
        cancel () {
            this.$Message.info('Clicked cancel');
        },
        // 新增或编辑列表数据
        handleSubmit(name, url) {
            debugger;
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    changeData(this.url, this.formItem).then(res => {
                        debugger;
                        if (res.data === 1) {
                            this.$Message.success('操作成功!');
                            this.customerModel = false;
                            bus.$emit('search')
                        } else {
                            this.$Message.warning(res.msg);
                        }
                    });
                } else {
                    console.log('新增数据失败');
                }
            });
        },
        // 关闭列表数据弹框
        handleRemove () {
            this.customerModel = false;
            this.scheduleModel = false;
            this.importModel = false;
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
        /**
     * 获取用户角色
     * id=3 PDT经理 id=4 项目经理
     */
        getUserRoleList() {
            getTableData('/proxy/attendance/user/selUserByRole', this.page)
                .then (res => {
                    const list = res.data.list;
                    let data = [];
                    list.forEach(element => {
                        data.push({value: String(element.id), label: element.userName});
                    });
                    debugger
                    this.projectManagerList = data;
                })
                .catch (err => {
                    console.log(err);
                });
        },
        classSearch (value) {
            const keyword = value.replace(/(^\s*)|(\s*$)/g, '');
            bus.$emit('initTableData', keyword);
        },
        submitSchedule (item) {
            getTableData('/proxy/class/listClassesByClassId/' + item.classId).then(res => {
                this.scheduleData = res.data;
            });
            this.scheduleModel = true;
        },
        onSelectChange (data) {
            this.schoolId = data[0].schoolId;
        },
        submit () {
            changeData('/proxy/class/submitClasses/' + this.scheduleSelection.classId).then(res => {
                if (res.code === 0) {
                    this.scheduleModel = false;
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.warning(res.msg);
                }
        
            });
        },
    }
};
</script>
<style land="Less">
  .ivu-modal {
    top: 200px;
  }
  .treeBox {
    max-height: 100px;
    overflow-y: auto;
    height: auto;
  }
  .treeBox li {
    margin: 0px !important
  }
</style>
