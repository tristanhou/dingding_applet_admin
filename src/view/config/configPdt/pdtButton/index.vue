<template>
  <section style="margin-bottom: 20px;position: relative;">
    <Button icon="md-add" @click="addPdt">
      新增
    </Button>
    <!-- <div style="float: right;width: 260px">
      <Input search enter-button="搜索" placeholder="搜索pdt" @on-search="classSearch" v-model="searchModel"/>
    </div> -->
    <Modal
      :styles="{top: '200px'}"
      v-model="customerModel"
      v-bind:title= "modalTitle"
      :mask="true"
      :footer-hide="true" 
      transfer
      :mask-closable="false">
        <Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formValidate">
          <FormItem label="PDT" prop="pdtName" >
              <Input v-model="formItem.pdtName" placeholder="PDT名称"></Input>
          </FormItem>
          <FormItem label="描述" prop="pdtDesc">
            <Input v-model="formItem.pdtDesc" placeholder="请输入描述"></Input>
          </FormItem>
          <FormItem label="PDT经理" prop="pdtManagerId">
                <Select v-model="formItem.pdtManagerId" style="width:100%; marginRight:5px" :filterable="true" placeholder="PDT经理名称" :clearable="true">
                    <Option v-for="item in pdtManagerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            <!-- <Input v-model="formItem.pdtManagerId" placeholder="请输入PDT经理名称"></Input> -->
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
  },
  data () {
    return {
      customerModel: false,
      modalTitle: null,
      url: '',
      formItem: {
        pdtName: '',
        pdtDesc: '',
        pdtManagerId: '',
      },
      ruleValidate: {
        pdtName: [
          {required: true, message: '请输入PDT名称', trigger: 'blur'},
          { type: 'string', max: 50, message: 'PDT名称不能超过50个字符', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5\._a-zA-Z0-9]+$/, message: '请不要输入特殊字符', trigger: 'blur'}
        ],
        pdtDesc: [
          // {required: true, message: '请输入描述', trigger: 'blur'},
          {type: 'string', max: 50, message: '描述不能超过50个字符', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5\._a-zA-Z0-9]+$/, message: '请不要输入特殊字符', trigger: 'blur'}
        ],
        pdtManagerId: [
          {required: true, message: '请输入PDT经理名称', trigger: 'blur'},
          {type: 'string', max: 50, message: 'PDT名称不能超过50个字符', trigger: 'blur'},
          {pattern: /^[\u4e00-\u9fa5\._a-zA-Z0-9]+$/, message: '请不要输入特殊字符', trigger: 'blur'}
          // {pattern: /^1[34578]\d{9}$/, message: '手机号码输入错误', trigger: 'blur' }
        ],
      },
	  searchModel: '',
	  pdtManagerList: [], // pdt经理列表
    }
  },
  mounted () {
    bus.$on('setKeyword', (item) => {
      this.searchModel = ''
    })
    // 获取pdt经理列表
    this.getUserRoleList();
    // 监听订阅编辑pdt事件
    bus.$on('editPdt', (item) => {
      this.editPdt(item)
    })
    bus.$on('setSchedule', (item) => {
      this.scheduleSelection = item
      this.actionUrl = '/proxy/class/importClasses/' + item.classId
      this.submitSchedule(item)
	})
  },
  methods: {
    // 打开新增列表弹框
    exportSchedule () {
      this.scheduleModel = false
      this.importModel = true
    },
    addPdt() {
     
      this.modalTitle = '新增PDT';
      this.customerModel = true;
      for (var i in this.formItem) {
        this.formItem[i] = ""
      }
      this.url = '/proxy/attendance/pdt/addPdt'
      this.$refs['formValidate'].resetFields()
    },
    // 打开编辑列表弹框
    editPdt(item) {
      this.customerModel = true
      // 编辑时清除掉表单提示信息
      this.$refs['formValidate'].resetFields()
      this.modalTitle = '修改'
      this.formItem['id'] = item['id']
      this.formItem['pdtName'] = item['pdtName']
      this.formItem['pdtDesc'] = item['pdtDesc']
      this.formItem['pdtManagerId'] = item['pdtManagerId']
      this.url = '/proxy/attendance/pdt/updPdt'     
    },
    // 新增或编辑列表数据
    handleSubmit(name, url) {
      debugger
      this.$refs['formValidate'].validate((valid) => {
          if (valid) {
              changeData(this.url, this.formItem).then(res => {
                debugger
                if (res.data === 1) {
                  this.$Message.success('添加成功!')
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
      this.customerModel = false
	},
	/**
	 * 获取用户角色
	 * id=3 PDT经理 id=4 项目经理
	 */
	getUserRoleList() {
        getTableData('/proxy/attendance/user/selUserByRole', {id: 3})
          .then (res => {
            const list = res.data.list;
            let data = [];
            list.forEach(element => {
              data.push({value: element.userCode, label: element.userName});
            });
            this.pdtManagerList = data;
          })
          .catch (err => {
            console.log(err);
        });
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
    top: 200px ;
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
