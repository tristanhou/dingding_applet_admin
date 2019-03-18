<template>
  <Row type="flex" justify="center" :gutter="20">
    <Col span="24" >
      <Card style="height: 84vh;overflow-y: auto;">
        <p slot="title">
          <Icon type="android-contact"></Icon>
            使用文档
        </p>
        <h1>软件简介</h1>
        <pre class="bg-pre">
          vue + vue-router + vuex + axios + iview3.0
        </pre>
        <h1>Install</h1>
        <pre class="bg-pre">
          // install dependencies
          npm install
        </pre>
        <h1>Run</h1>
        <pre class="bg-pre">
          vue + vue-router + vuex + axios + iview3.0
        </pre>
        <h1>Development</h1>
        <pre class="bg-pre">
          npm run dev
        </pre>
        <h1>Production(Build)</h1>
        <pre class="bg-pre">
          npm run build
        </pre>
        <h1>文件结构</h1>
        <pre class="bg-pre">
          ├── build  项目构建配置
          ├── config  开发相关配置
          ├── public  打包所需静态资源
          └── src
              ├── api  AJAX请求
              └── assets  项目静态资源
                  ├── icons  自定义图标资源
                  └── images  图片资源
              ├── components  业务组件
              ├── config  项目运行配置
              ├── directive  自定义指令
              ├── libs  封装工具函数
              ├── locale  多语言文件
              ├── mock  mock模拟数据
              ├── router  路由配置
              ├── store  Vuex配置
              ├── view  页面文件
              └── tests  测试相关
        </pre>
      </Card>
    </Col>
  </Row>
</template>
<script>
export default {
    name: 'home',
    components: {},
    data () {
        return {
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
