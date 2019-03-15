<template>
  <Row type="flex" justify="center" :gutter="20">
    <Col span="4">
    <Card style="height: 84vh">
      <SelectTree :dataTree="data" :isShowCheckbox="isShowCheckbox" @on-check-change="onCheckChange" @on-select-change="onSelectChange"/>
    </Card>
    </Col>
    <Col span="8">
    <Card style="height: 84vh">
      <p slot="title">
        <Icon type="android-contact"></Icon>
          代码示例
      </p>
      <div>
        <Button type="primary" icon="md-add" @click="openCheckBox">打开复选框</Button>
      </div>
      <pre class="bg-pre">
        &lt;SelectTree <br/>
        &nbsp;&nbsp;:dataTree="data"<br/>
        &nbsp;&nbsp;:isShowChecbox="isShowChecbox"<br/>
        &nbsp;&nbsp;@on-check-change="onCheckChange"<br/>
        &nbsp;&nbsp;@on-select-change="onSelectChange"<br/>
        /&gt;
      </pre>
      <pre class="bg-pre">
        // 复选
        onCheckChange (value) {
          this.selectedData = value
        }
      </pre>
      <pre class="bg-pre">
        // 单选
        onSelectChange (value) {
          this.selectedData = value
        }
      </pre>
      <div style="height: 160px;overflow-y: auto;">{{selectedData}}</div>
    </Card>
    </Col>
    <Col span="12" >
      <Card style="height: 84vh">
        <p slot="title">
          <Icon type="android-contact"></Icon>
            使用文档
        </p>
        <p>Select Tree props</p>
        <Table stripe :columns="columnsProps" :data="dataProps"></Table>
        <p style="margin-top: 20px">Select Tree events</p>
        <Table stripe :columns="columnsEvents" :data="dataEvents"></Table>
      </Card>
    </Col>
  </Row>
</template>
<script>
import SelectTree from '_c/select_tree'
import { getData } from '@/api/data'
export default {
  name: 'split_pane_page',
  components: {
    SelectTree
  },
  data () {
    return {
      data: [],
      columnsProps: [
        {
          title: '属性',
          key: 'props'
        },
        {
          title: '说明',
          key: 'description'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '默认值',
          key: 'default'
        }
      ],
      dataProps: [
        {
          props: 'isShowChecbox',
          description: '是否显示复选框',
          type: 'Boolean',
          default: 'false'
        },
        {
          props: 'placeholder',
          description: '下拉框占位文本',
          type: 'Boolean',
          default: '请选择'
        },
        {
          props: 'width',
          description: '下拉框宽度, tree最小宽度',
          type: 'Number',
          default: '180'
        },
        {
          props: 'height',
          description: 'tree最大高度',
          type: 'Number',
          default: '600'
        },
        {
          props: 'dataTree',
          description: 'Tree 数据',
          type: 'Boolean',
          default: '空'
        }
      ],
      columnsEvents: [
        {
          title: '事件名',
          key: 'events'
        },
        {
          title: '说明',
          key: 'description'
        },
        {
          title: '返回值',
          key: 'value'
        }
      ],
      dataEvents: [
        {
          events: 'on-select-change',
          description: '选择tree某一节点时触发，只在单选时有效',
          value: '选中的节点数据'
        },
        {
          events: 'on-check-change',
          description: '选择tree某一节点时触发，只在复选时有效',
          value: '选中的节点数据'
        }
      ],
      isShowCheckbox: false,
      selectedData: null
    }
  },
  methods: {
    initTreeData () {
      getData('/proxy/cloud/tree').then(res => {
        this.formatTreeData(res.data.data)
        this.data = res.data.data
      })
    },
    formatTreeData (data) {
      data.forEach((item) => {
        item.title = item.name
        item.children && this.formatTreeData(item.children)
      })
    },
    openCheckBox () {
      debugger
      this.isShowCheckbox === false ? this.isShowCheckbox = true : this.isShowCheckbox = false
    },
    onCheckChange (value) {
      this.selectedData = value
    },
    onSelectChange (value) {
      this.selectedData = value
    }
  },
  mounted () {
    this.initTreeData()
  }
}
</script>

<style lang="less">
.bg-pre {
  background: #f9f9f9;
  padding-top: 10px;
}
</style>
