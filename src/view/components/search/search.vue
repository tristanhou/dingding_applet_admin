<template>
    <div class="search" data-mation="search">
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20">
                <search></search>
            </Col>
        </Row>
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20" style="margin-top: 40px">
                <Card>
                    <p slot="title">
                        <Icon type="android-contact"></Icon>使用文档
                    </p>
                    <p>search props</p>
                    <Table stripe :columns="columnsProps" :data="dataProps"></Table>
                    <p style="margin-top: 20px">searchSelect options</p>
                    <Table stripe :columns="columnsProps" :data="dataOptions"></Table>            
                    <p style="margin-top: 20px">search events</p>
                    <Table stripe :columns="columnsEvents" :data="dataEvents"></Table>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import search from '_c/search';
export default {
    components:{
        search
    },
    data(){
        return {
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
                    props: 'searchSelect',
                    description: '选择项的配置',
                    type: 'Object',
                    default: '-',
                    describe:'详情查看searchSelect options'
                },
                {
                    props: 'imeiKey',
                    description: '默认选中的imei键名',
                    type: 'String',
                    default: '-',
                    describe:'必填，一般为imeis',
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
                    events: 'on-change',
                    description: '下拉框改变时触发',
                    value: '选中发生变化时发生的key'
                },
                {
                    events: 'on-search-value',
                    description:'离开选项框时触发',
                    value: '输入的值，为一个字符串'
                },
            ],
            dataOptions:[
                {
                    props: 'label',
                    description: '选项名',
                    type: 'String',
                    default: '-',
                    describe:'-'
                },
                {
                    props: 'value',
                    description: '选项值',
                    type: 'String',
                    default: '-',
                    describe:'-'
                },
                {
                    props: 'placeholder',
                    description: '当前选项的提示',
                    type: 'String',
                    default: '-',
                    describe:'-'
                },
                {
                    props: 'multiple',
                    description: '是否支持多选',
                    type: 'Boolean',
                    default: '-',
                    describe:'当前只有IMEI支持多选'
                },
            ],
        };
    }
};
</script>
