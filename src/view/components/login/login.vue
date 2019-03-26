<template>
    <div class="login-from" dta-automation="login">
        <Row type="flex" justify="start" :gutter="20">
            <Col span="20">
                <loginForm></loginForm>
            </Col>
        </Row>
        <Row type="flex" justify="start" :gutter="20">
      <Col span="20">
        <Card>
            <p slot="title">
                <Icon type="android-contact"></Icon>使用文档
            </p>
            <p>login props</p>
            <Table stripe :columns="columnsProps" :data="dataProps"></Table>      
            <p style="margin-top: 20px">login events</p>
            <Table stripe :columns="columnsEvents" :data="dataEvents"></Table>
        </Card>
      </Col>
    </Row>
    </div>
</template>


<script>
import loginForm from '_c/login-component';
export default {
    components:{
        loginForm
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
                    props: 'isExperience',
                    description: '是否开启体验功能',
                    type: 'Boolean',
                    default: 'false',
                    describe:'-'
                },
                {
                    props: 'experienceFrom',
                    description: '体验账号的登录账号密码',
                    type: 'Object',
                    default: 'userName:jimitest,password:jimi123',
                    describe:'-',
                },
                {
                    props: 'isForget',
                    description: '是否开启忘记密码功能',
                    type: 'Boolean',
                    default: 'false',
                    describe:'-'
                },               
                {
                    props: 'timeProps',
                    description: '开启注册倒计时配置',
                    type: 'Object',
                    default: 'open:是否开启，time：倒计时时间，text：当前还需要T秒重新获取',
                    describe:'T是当前倒计时的时间显示的位置，如：剩下T秒，T会转换成50'
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
                    events: 'set-login',
                    description: '点击登录按钮验证成功后出发',
                    value: '账号密码'
                },
                {
                    events: 'set-code',
                    description:'点击获取验证码时触发',
                    value: '手机号码'
                },
                {
                    events: 'success-submit',
                    description:'点击重置密码时触发',
                    value: '返回登录名，手机号，验证码，新密码，旧密码'
                },
            ],
        };
    }
};
</script>
