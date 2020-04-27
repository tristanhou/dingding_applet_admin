<template>
  <section style="margin-bottom: 20px;position: relative;">
    <Button icon="md-add" @click="addSchedule">
      新增
    </Button>
    <div style="float: right;width: 260px">
      <Input search enter-button="搜索" placeholder="搜索班级名称或班主任" @on-search="classSearch" v-model="searchModel"/>
    </div>
    <Modal
      :styles="{top: '20px'}"
      v-model="customerModel"
      v-bind:title= "modalTitle"
      @on-ok="ok"
      :mask="true"
      :footer-hide="true" 
      transfer
      :mask-closable="false">
        <Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formValidate">
          <FormItem label="PDT" prop="className">
              <Input v-model="formItem.pdtName" placeholder="PDT名称"></Input>
          </FormItem>
          <FormItem label="Desc" prop="classTeacher">
            <Input v-model="formItem.pdtDesc" placeholder="请输入pdtDesc"></Input>
          </FormItem>
          <FormItem label="PDT经理" prop="teacherPhone">
            <Input v-model="formItem.pdtManagerId" placeholder="请输入PDT经理名称"></Input>
          </FormItem>
          <FormItem style="text-align: right;">
            <Button type="primary" @click="handleSubmit('add')">提交</Button>
            <Button style="margin-left: 8px"  @click="handleRemove()">取消</Button>
          </FormItem>
        </Form>
    </Modal> 
    <Modal
      :styles="{top: '20px', width:'680px'}"
      v-model="scheduleModel"
      v-bind:title= "scheduleTitle"
      @on-ok="ok"
      :mask="true"
      :footer-hide="true" 
      transfer
      :mask-closable="false">
        <Row style="margin-top: 20px">
          <Col :span="14">
            <Button type="primary" @click="exportSchedule">导入课程表</Button>
            <span>课程表仅支持excel表导入</span>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Table :columns="scheduleColumns" :data="scheduleData"></Table>
        </Row>
        <Row style="margin-top: 20px">
          <Col :span="8">
            学校：{{ this.scheduleSelection.schoolName }}
          </Col>
          <Col :span="8">
            班级：{{ this.scheduleSelection.className }}
          </Col>
          <Col :span="8">
            班主任：{{ this.scheduleSelection.classTeacher }}
          </Col>         
        </Row>
        <Row style="margin-top: 20px" type="flex" justify="end">
            <Button type="primary" @click="submit()">提交</Button>
            <Button style="margin-left: 8px"  @click="handleRemove()">取消</Button>
        </Row>
    </Modal>
    <Modal
      :styles="{top: '20px'}"
      v-model="importModel"
      title= "批量导入"
      @on-ok="ok"
      :mask="true"
      :footer-hide="true" 
      transfer
      :mask-closable="false">
        <Row style="margin-top: 20px">
          <Col :span="24">
            <Upload :action="actionUrl" accept=".xls,.xlsx"  ref="upload" :on-success="uploadSuccess">
              <Input search enter-button="选择" placeholder="请选择要导入的excel表" style="width: 100%"/>
            </Upload>
            <span>仅支持excel表导入，请先下载模版</span>
            <a href="/proxy/system/download/import_classes_template" target="_blank">下载模板</a>
          </Col>
        </Row>
        <Row style="margin-top: 20px" type="flex" justify="end">
          <Button type="primary" @click="handleRemove()">提交</Button>
          <Button style="margin-left: 8px"  @click="handleRemove()">取消</Button>
        </Row>
    </Modal> 
  </section>
</template>
<script>
import Tree from '_c/tree/tree.vue'
import { changeData, getTableData } from '@/api/data'
import bus from '_c/bus.js'
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
    Tree
  },
  data () {
    return {
      customerModel: false,
      importModel: false,
      modalTitle: null,
      treeList: [],
      url: '',
      formItem: {
        pdtName: '',
        pdtDesc: '',
        pdtManagerId: '',
      },
      ruleValidate: {
        pdtName: [
          {required: true, message: '请输入班级名称', trigger: 'blur'},
          { type: 'string', max: 50, message: '班级名称不能超过50个字符', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5\._a-zA-Z0-9]+$/, message: '请不要输入特殊字符', trigger: 'blur'}
        ],
        pdtDesc: [
          {required: true, message: '请输入班主任名称', trigger: 'blur'},
          { type: 'string', max: 10, message: '班主任名称不能超过10个字符', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5\._a-zA-Z0-9]+$/, message: '请不要输入特殊字符', trigger: 'blur'}
        ],
        pdtManagerId: [
          {required: true, message: '请输入班主任手机', trigger: 'blur'},
          {pattern: /^1[34578]\d{9}$/, message: '手机号码输入错误', trigger: 'blur' }
        ],
      },
      scheduleModel: false,
      scheduleTitle: '课程表',
      scheduleColumns: [
        {
          title: '序号',
          align: 'center',
          type: 'index'
        },
        {
          title: '课程时间',
          align: 'center',
          width:100,
          key: 'classesTime',
        },
        {
          title: '周一',
          align: 'center',
          key: 'monday'
        },
        {
          title: '周二',
          align: 'center',
          key: 'tuesday',
        },
        {
          title: '周三',
          key: 'wednesday'
        },
        {
          title: '周四',
          align: 'center',
          key: 'thursday',
        },
       {
          title: '周五',
          align: 'center',
          key: 'friday'
        },
        {
          title: '周六',
          align: 'center',
          key: 'saturday',
        },
        {
          title: '周日',
          align: 'center',
          key: 'sunday',
        }                
      ],
      scheduleData:[],
      scheduleSelection: [],
      isExpandAll: null,
      actionUrl: '',
      userId: '',
      classId: null,
      schoolId: null,
      searchModel: ''
    }
  },
  mounted () {
    bus.$on('setKeyword', (item) => {
      this.searchModel = ''
    })
    bus.$on('editSchedule', (item) => {
      this.editSchedule(item)
    })
    bus.$on('setSchedule', (item) => {
      this.scheduleSelection = item
      this.actionUrl = '/proxy/class/importClasses/' + item.classId
      this.submitSchedule(item)
    })
    this.initTreeData()
  },
  methods: {
    // 打开新增列表弹框
    exportSchedule () {
      this.scheduleModel = false
      this.importModel = true
    },
    addSchedule () {
      this.modalTitle = '新增班级'
      this.customerModel = true
      for (var i in this.formItem) {
        this.formItem[i] = ""
      }
      this.url = '/proxy/attendance/pdt/addPdt'
      this.$refs['formValidate'].resetFields()
    },
    getUserId (data, schoolId) {
      data.forEach((item) => {
        if (item.schoolId == schoolId) {
          if (item.userId != null) {
            this.userId = item.userId
          }
        }
        item.children != null && this.getUserId(item.children, schoolId)
      })
    },
    initTreeData (data) {
      let params = data;
      getTableData('/proxy/customer/listCustomerTree', params).then(res => {
        this.formatTreeData(res.data)
        this.isExpandAll = true
        this.treeList = res.data
      }).catch(err => {
        console.log(err)
      })      
    },
    formatTreeData (data) {
      data.forEach((item) => {
        item.title = item.name
        item.children != undefined && this.formatTreeData(item.children)
      })
    },
    // 打开编辑列表弹框
    editSchedule(item) {
      this.getUserId(this.treeList, item.schoolId)
      this.customerModel = true
      this.modalTitle = '修改班级'
      this.formItem['className'] = item['className']
      this.formItem['classTeacher'] = item['classTeacher']
      this.formItem['teacherPhone'] = item['teacherPhone']
      this.schoolId = item['schoolId']
      this.classId = item['classId']
      this.url = '/proxy/class/updateClass'     
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    // 新增或编辑列表数据
    handleSubmit(name, url) {
      debugger
      this.$refs['formValidate'].validate((valid) => {
          if (valid) {
              changeData(this.url, this.formItem).then(res => {
                debugger
                if (res.code === 0) {
                  this.$Message.success('操作成功!')
                  this.customerModel = false
                  bus.$emit('initTableData')
                } else {
                  this.$Message.warning(res.msg)
                }
              })
          } else {
              console.log('新增数据失败');
          }
      })
    },
    // 关闭列表数据弹框
    handleRemove () {
      this.$refs['upload'].clearFiles()
      this.customerModel = false
      this.scheduleModel = false
      this.importModel = false
    },
    classSearch (value) {
      const keyword = value.replace(/(^\s*)|(\s*$)/g, "")
      bus.$emit('initTableData', keyword)
    },
    submitSchedule (item) {
      getTableData('/proxy/class/listClassesByClassId/' + item.classId).then(res => {
        this.scheduleData = res.data
      })
      this.scheduleModel = true
    },
    onSelectChange (data) {
      this.schoolId = data[0].schoolId
    },
    submit () {
      changeData('/proxy/class/submitClasses/' + this.scheduleSelection.classId).then(res => {
        if (res.code === 0) {
          this.scheduleModel = false
          this.$Message.success(res.msg)
        } else {
          this.$Message.warning(res.msg)
        }
        
      })
    },
    uploadSuccess (response, file, fileList) {
      if (response.code !== 0) {
        this.$Message.warning(response.msg)
        this.$refs['upload'].clearFiles()
        return
      }
      this.$Message.success(response.msg)
    }
  }
}
</script>
<style land="Less">
  .ivu-modal {
    top: 0 ;
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
