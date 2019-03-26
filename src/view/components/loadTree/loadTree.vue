<template>
    <div class="loadTree" data-mation="table">
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20">
                <loadTree v-on:on-load-data="getTree" :propsOptions="elprops"></loadTree>
            </Col>
        </Row>
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20" style="margin-top: 40px">
                <Card>
                    <p slot="title">
                        <Icon type="android-contact"></Icon>使用文档
                    </p>
                    <p>loadTree props</p>
                    <Table stripe :columns="columnsProps" :data="dataProps"></Table>
                    <p style="margin-top: 20px">propsOptions options</p>
                    <Table stripe :columns="columnsProps" :data="dataOptions"></Table>            
                    <p style="margin-top: 20px">loadTree events</p>
                    <Table stripe :columns="columnsEvents" :data="dataEvents"></Table>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import loadTree from '_c/load-tree';
export default {
    components:{
        loadTree
    },
    data(){
        return {
            elprops:{
                label: 'title',
                children: 'children',
                isLeaf: data => {
                    if (data.isSub == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            data:[],
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
                },
                {
                    title:'描述',
                    key:'describe'
                }
            ],
            dataProps:[
                {
                    props: 'width',
                    description: '输入框的宽度',
                    type: 'Number',
                    default: '360',
                    describe:'-'
                },
                {
                    props: 'placeholder',
                    description: '输入框提示符',
                    type: 'String',
                    default: '请选择',
                    describe:'-',
                },
                {
                    props: 'height',
                    description: '选择框的高度',
                    type: 'Number',
                    default: '300',
                    describe:'-',
                },
                {
                    props: 'title',
                    description: '输入框默认的值',
                    type: 'String',
                    default: '',
                    describe:'用于回显',
                },
                {
                    props: 'id',
                    description: '默认选择的id',
                    type: 'Number/String',
                    default: '',
                    describe:'-',
                },
                {
                    props: 'isShowChecbox',
                    description: '是否需要多选框',
                    type: 'Boolean',
                    default: 'false',
                    describe:'-',
                },
                {
                    props: 'propsOptions',
                    description: '关于数据显示的配置',
                    type: 'Object',
                    default: '-',
                    describe:'详情查看options配置',
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
            dataEvents:[
                {
                    events: 'on-load-data',
                    description: '点击展开叶和首次加载时触发',
                    value: '当前父节点的数据'
                },
                {
                    events: 'on-select-change',
                    description:'选中数据时触发',
                    value: '返回当前选中的Array对象'
                },
                {
                    events: 'on-check-change',
                    description:'选择多选框时触发',
                    value: '返回当前选中的所有多选框'
                },
            ],
            dataOptions:[
                {
                    props: 'label',
                    description: '当前显示的key名',
                    type: 'String',
                    default: 'title',
                    describe:'-'
                },
                {
                    props: 'children',
                    description: '子节点的Array数组',
                    type: 'Array',
                    default: 'children',
                    describe:'-'
                },
                {
                    props:'isLeaf',
                    description:'是否有选择设置',
                    type:'function',
                    default:'-',
                    describe:'函数返回一个Boolean'
                }
            ]
        };
    },
    computed:{
        group(){
            return this.data;
        }
    },
    methods:{
        getTree(item,resolve){
            this.$http.get(this.$api.GET_LOAD_TREE).then(res => {
                if(res.code){
                    return this.$Message.error(res.msg);
                }
                let data = res.data.data;
                console.log(data,111);
                resolve(data);
            });
        },
        /**
         * 展开数据 获取子分组
         */
        spreadGroup(row,type){
            if(!type){
                return;
            }
            this.$http.get(this.$api.GET_TABLE_TREE).then(res => {
                const data = res.data.data || [];
                data.forEach(item => {
                    item.number = 0;
                    if(item.childNodeNum){
                        item.children = [
                            {groupName:'加载中'}
                        ];
                    }
                });
                row.children = data;
            });  
        },
    }
};
</script>
