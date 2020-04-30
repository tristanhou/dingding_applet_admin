<template>
  <Row type="flex" justify="center" :gutter="20">
    <Col span="24" >
    
      <Card style="height: 84vh;overflow-y: auto;">
        <div style="height: 100%;width: 100%;text-align: center;margin-top: 200px;">
           <h1>工时统计管理平台</h1>
           <img :src="maxLogo" key="max-logo" style="margin-top: 20px;"/>
 
        </div>
       
      </Card>
    </Col>
  </Row>
</template>
<script>
import maxLogo from '@/assets/images/worktime.png';
export default {
    name: 'home',
    components: {},
    data () {
        return {
          maxLogo,
            dataList: [],
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
                    props: 'isExpandAll',
                    description: '是否打开文档树所有节点',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'isCleanAll',
                    description: '是否清除选中状态',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'isDisabledItem',
                    description: '是否禁用掉某一个树节点',
                    type: 'Boolean',
                    default: 'false'
                },
                {
                    props: 'isAutoComplete',
                    description: '是否打开查询搜索框',
                    type: 'Boolean',
                    default: 'true'
                },
                {
                    props: 'dataTree',
                    description: 'Tree 数据',
                    type: 'Boolean',
                    default: '空'
                },
                {
                    props: 'userId',
                    description: '传唯一标识符, 选中相应数据',
                    type: 'Number | String',
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
                    events: 'auto-complete-change',
                    description: '搜索框数据改变时触发',
                    value: '输入值'
                },
                {
                    events: 'has-selected-data',
                    description: '选中某一个树节点时触发',
                    value: '  当前的选中节点的id值'
                }
            ],
            isExpandAll: false
        };
    }
};
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
.bg-pre {
  background: #f9f9f9;
  padding-top: 10px;
}</style>
