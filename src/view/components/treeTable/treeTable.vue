<template>
    <div class="treeTable" data-mation="table">
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20">
                <treeTable v-on:spread-list="spreadGroup" :columns="columns" :data="group"></treeTable>
            </Col>
        </Row>
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20" style="margin-top: 40px">
                <Card>
                    <p slot="title">
                        <Icon type="android-contact"></Icon>使用文档
                    </p>
                    <p>treeTable props</p>
                    <Table stripe :columns="columnsProps" :data="dataProps"></Table>
                    <p style="margin-top: 20px">treeTable options</p>
                    <Table stripe :columns="columnsProps" :data="dataOptions"></Table>            
                    <p style="margin-top: 20px">treeTable events</p>
                    <Table stripe :columns="columnsEvents" :data="dataEvents"></Table>
                </Card>
            </Col>
        </Row>
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20" style="color:red;text-align:center;margin-top:30px">
              此组件不建议直接引入组件使用，只是作为一个分组懒加载树的解决方案，需要详细的查看封装的代码进行使用
            </Col>
        </Row>
    </div>
</template>

<script>
import treeTable from '_c/tree-table/index.vue';
export default {
    components:{
        treeTable
    },
    data(){
        return {
            data:[],
            columns: [
                {
                    text: '分组名称',
                    value: 'groupName',
                    width: 400
                },
                {
                    text: '隐藏属性',
                    value: 'number',
                    width: 1,
                    note:'用于做数据渲染，每一行都需要手动加入一个number'
                },
                {
                    text: '下级分组数',
                    value: 'childNodeNum'
                },
                {
                    text: '关联设备数',
                    value: 'imeiNum'
                },
                {
                    text: '关联管理员数',
                    value: 'userNum'
                },
                {
                    text: '创建者',
                    value: 'nickname'
                },
            ],
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
                    props: 'border',
                    description: '表格的border',
                    type: 'boolean',
                    default: 'true',
                    describe:'边框'
                },
                {
                    props: 'height',
                    description: '表格的高度',
                    type: 'String',
                    default: '640',
                    describe:'因为是树表格，数据进行异步加载，所以必须设置高度',
                },
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
                    events: 'spread-list',
                    description: '点击展开叶时触发',
                    value: '当前row的数据'
                },
                {
                    events: 'select-checkbox',
                    description:'选中checkbox时触发',
                    value: '当前选中的所有数组'
                },
            ],
            dataOptions:[
                {
                    props: 'editFlag',
                    description: '是否需要多选框',
                    type: 'boolean',
                    default: 'true',
                    describe:'-'
                },
                {
                    props: '_expanded',
                    description: '小箭头是否展开',
                    type: 'boolean',
                    default: 'false',
                    describe:'-'
                },
                {
                    props:'note',
                    description:'用于重新渲染',
                    type:'number',
                    default:'-',
                    describe:'此为data上的属性，需要手动在获取数据时加入，用于重新渲染数据'
                }
            ]
        };
    },
    created(){
        this.getTreeTable();
    },
    computed:{
        group(){
            return this.data;
        }
    },
    methods:{
        getTreeTable(){
            this.$http.get(this.$api.GET_TABLE_TREE).then(res => {
                if(res.code){
                    return this.$Message.error(res.msg);
                }
                let data = res.data.data || [];
                data.forEach(item => {
                    if(item.childNodeNum != 0){
                        item.children = [{groupName:'加载中',childNodeNum:0}];
                        item.number = 0;
                    }
                });
                this.data = data || [];
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
