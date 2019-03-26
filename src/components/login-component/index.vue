<template>
    <div
        data-automation="login"
        class="login-component"
        @keydown.enter="login('formCustom')"
    >
        <Form
            ref="formCustom"
            v-bind:model="formLogin"
            v-bind:rules="ruleCustom"
            v-bind:label-width="0"
        >
            <FormItem
                label=""
                prop="userName"
            >
                <Input
                    type="text"
                    v-model.trim="formLogin.userName"
                    placeholder="请输入账号"
                    :maxlength="50"
                ></Input>
            </FormItem>
            <FormItem
                label=""
                prop="password"
            >
                <Input
                    type="password"
                    v-model.trim="formLogin.password"
                    placeholder="请输入密码"
                    :maxlength="50"
                ></Input>
            </FormItem>
            <FormItem
                label=""
                class="login-operation"
            >
                <div class="login-memory-password">
                    <Checkbox @on-change="rememberValue" v-model="memoryPassword">&nbsp;&nbsp;记住密码</Checkbox>
                </div>
                <div class="login-tool">
                    <a
                        v-if="isForget"
                        href="javascript:"
                        @click="forgetModel = true"
                    >忘记密码</a>
                    <span v-if="isForget && isExperience">/</span>
                    <a
                        v-if="isExperience"
                        href="javascript:"
                        @click="login('formCustom','experience')"
                    >我要体验 >></a>
                </div>
            </FormItem>
            <FormItem class="login-btn">
                <Button
                    type="primary"
                    @click="login('formCustom')"
                >登录</Button>
            </FormItem>
        </Form>
        <!-- 忘记密码弹框 -->
        <Modal
            v-model="forgetModel"
            width="600"
            class-name="login-model"
            data-automation="forgetModel"
        >
            <p slot="header">
                找回密码
            </p>
            <Form
                ref="forgetCustom"
                :model="forgetForm"
                :rules="forgetRule"
                :label-width="180"
            >
                <FormItem
                    label="账号："
                    prop="userName"
                >
                    <Input
                        type="text"
                        v-model.trim="forgetForm.userName"
                        placeholder="请输入账号"
                    ></Input>
                </FormItem>
                <FormItem
                    label="电话："
                    prop="tel"
                >
                    <Input
                        type="text"
                        v-model.trim="forgetForm.tel"
                        placeholder="请输入电话号码"
                        @blur=""
                    ></Input>
                </FormItem>
                <FormItem
                    label="验证码："
                    prop="code"
                    class="forget-last-input"
                >
                    <Col span="8">
                    <Input
                        type="password"
                        v-model.trim="forgetForm.code"
                        placeholder="请输入验证码"
                    ></Input>
                    </Col>
                    <Col span="12">
                    <Button
                        type="success"
                        :disabled=disabledBtn
                        @click="getCode()"
                    >{{codeParams.countdownDown}}</Button>
                    </Col>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    @click="nextStep('forgetCustom')"
                >下一步</Button>
                <Button @click="forgetModel = false">取消</Button>
            </div>
        </Modal>
        <!-- 重新输入密码弹框 -->
        <Modal
            v-model="confirmModel"
            width="600"
            class-name="login-model"
            data-automation="confirmModel"
        >
            <p slot="header">
                找回密码
            </p>
            <Form
                ref="passwordCustom"
                :model="forgetForm"
                :rules="passwordRule"
                :label-width="180"
            >
                <FormItem
                    label="新密码："
                    prop="newPassword"
                    class="confirm-password"
                >
                    <Input
                        type="password"
                        v-model.trim="forgetForm.newPassword"
                        placeholder="新密码"
                    ></Input>
                    <div class="password-strength">
                        <span
                            ref="weak"
                            :class="strengthCount>0?'strength-weak':''"
                        ></span>
                        <span
                            ref="center"
                            :class="strengthCount>1?'strength-center':''"
                        ></span>
                        <span
                            ref="strong"
                            :class="strengthCount>2?'strength-strong':''"
                        ></span>
                    </div>
                </FormItem>
                <FormItem
                    label="确认新密码："
                    prop="confirmPassword"
                >

                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    @click="successSubmit('passwordCustom')"
                >完成</Button>
                <Button @click="confirmModel = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data() {
        // 密码验证
        const validatePassWord = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (value !== this.forgetForm.newPassword) {
                    callback(new Error('两次密码不一致'));
                } else {
                    callback();
                }
            }
        };
        // 验证码验证
        const validateCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('验证码不能为空'));
            } else {
                callback();
            }
        };
        return {
            forgetModel: false, //忘记密码弹框
            confirmModel: false, //确认密码弹框
            memoryPassword: false, //记住密码
            strengthCount: 0, //密码强度等级
            disabledBtn: false, //获取验证码是否显示禁用状态
            // 登录参数
            formLogin: {
                userName: '体验账号',
                password: 'ab888888'
            },
            //  登录规则验证
            ruleCustom: {
                userName: [
                    {
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            // 忘记密码参数
            forgetForm: {
                userName: '',
                tel: '',
                code: '',
                newPassword: '',
                confirmPassword: ''
            },
            //验证码参数
            codeParams: {
                time: 0,
                countdownDown: '获取验证码',
                timeStart: ''
            },
            // 忘记密码规则验证
            forgetRule: {
                userName: [
                    {
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur'
                    }
                ],
                tel: [
                    {
                        required: true,
                        message: '手机号码不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^1[3|4|7|5|8]\d{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                code: [
                    {
                        required: true,
                        validator: validateCode,
                        trigger: 'blur'
                    }
                ]
            },
            // 重置密码弹框
            passwordRule: {
                newPassword: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }
                ],
                confirmPassword: [
                    {
                        required: true,
                        validator: validatePassWord,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    created(){
        this.memoryPassword = this.$cookie.getJSON('remember');
        if(this.$cookie.getJSON('remember')){
            this.formLogin.userName = this.$cookie.getJSON('userName') || '';
            this.formLogin.password = this.$cookie.getJSON('dssap') || '';
        }
    },
    watch: {
        forgetForm: {
            /**
             * 深度监听完成密码强度校验
             */
            handler(newValue) {
                this.strengthCount = this.$rule.strength(
                    newValue.newPassword
                );
            },
            deep: true
        },
        timeProps: {
            handler(newValue) {
                console.log(newValue);
                if (!newValue.open) {
                    return;
                }
                this.codeParams.time = newValue.time;

                // 开始倒计时
                this.codeParams.timeStart = setInterval(() => {
                    this.codeParams.time--;
                    this.codeParams.countdownDown = String(
                        newValue.text
                    ).replace(/T|[0-9]/, this.codeParams.time);
                    this.disabledBtn = true;
                    if (this.codeParams.time <= 0) {
                        this.disabledBtn = false;
                        this.codeParams.countdownDown = '重新获取';
                        clearInterval(this.codeParams.timeStart);
                    }
                }, 1000);
            },
            deep: true
        }
    },
    // 计时器开启后，如果直接去登录清空计时器
    beforeDestroy() {
        if (this.codeParams.timeStart !== '') {
            clearInterval(this.codeParams.timeStart);
        }
    },
    props: {
        // 是否开启体验
        isExperience: {
            type: Boolean,
            default: false
        },
        // 是否开启忘记密码
        isForget: {
            type: Boolean,
            default: false
        },
        // 体验账号密码
        experienceFrom: {
            type: Object,
            default: function() {
                return {
                    userName: 'jimitest',
                    password: 'jimi123'
                };
            }
        },
        // 开启注册倒计时
        timeProps: {
            type: Object,
            default: function() {
                return {
                    open: false,
                    time: 60,
                    text: '当前还需T秒重新获取' //修改显示信息请以T代替时间的位置
                };
            }
        }
    },
    methods: {
        
        /**
         * 登陆
         */
        login(name, experience) {
            // 体验
            if (experience) {
                this.formLogin = this.experienceFrom;
            }
            this.$refs[name].validate(valid => {
                if (!valid) {
                    return;
                }
                this.$emit('set-login', this.formLogin);
                
            });
        },
        /**
         * 记住密码
         */
        rememberValue(value){
            this.$cookie.set('remember',value);
        },
        /**
         * 下一步
         */
        nextStep(name) {
            this.$refs[name].validate(valid => {
                if (!valid) {
                    return;
                }
                this.forgetModel = false;
                this.confirmModel = true;
            });
        },
        /**
         * 获取验证码
         */
        getCode() {
            if (!/^1[3|4|7|5|8]\d{9}$/.test(this.forgetForm.tel)) {
                return this.$Message.error('手机号格式不正确!');
            }
            // 计时不允许发送请求
            if (this.codeParams.time > 0) {
                return;
            }
            this.$emit('set-code', this.forgetForm.tel);
        },
        /**
         * 提交重置密码
         */
        successSubmit(name) {
            this.$refs[name].validate(valid => {
                if (!valid) {
                    return;
                }
                this.$emit('success-submit', this.forgetForm);
            });
        }
    }
};
</script>



<style lang="less">
.login-component {
    .login-logo {
        margin: 20px 0;
    }
    .ivu-form {
        .ivu-input {
            height: 50px;
            font-size: 16px;
        }
    }
    .ivu-form-item-content {
        .ivu-btn {
            width: 100%;
            height: 50px;
        }
    }
    .login-operation {
        // margin-top: -10px;
        .login-memory-password {
            display: inline-block;
            font-weight: normal;
            // color: #fff;
            .ivu-checkbox-wrapper {
                font-size: 14px;
            }
        }
        .login-tool {
            font-weight: normal;
            float: right;
            font-size: 14px;
            > a,
            span {
                color: #515a6e;
                &:hover {
                    color: #337ab7;
                }
            }
        }
    }
    .login-btn {
        .ivu-btn {
            font-size: 18px;
        }
    }
}
.login-model {
    /* 验证码弹框样式 */
    .ivu-modal {
        // position: fixed;
        // top: 50%;
        // left: 50%;
        .forget-last-input {
            .ivu-form-item-content {
                height: 33px;
            }
        }
        margin: 200px auto;
        .ivu-modal-header {
            height: 56px;
            > p {
                font-size: 16px;
                font-weight: normal;
            }
        }
        .ivu-form-item-label {
            font-weight: 600;
            color: #232323;
        }
        .ivu-form-item {
            .ivu-input-wrapper {
                width: 269px;
            }
            &:nth-child(3) {
                .ivu-input-wrapper {
                    width: 120px;
                }
            }
        }
        .confirm-password {
            height: 60px;
            position: relative;
        }
        .password-strength {
            left: 20px;
            top: 55px;
            width: 180px;
            display: flex;
            border: 1px solid #aaa;
            height: 14px;
            border-radius: 7px;
            padding: 2px 0px;
            position: absolute;
            > span {
                display: inline-block;
                height: 100%;
                width: 33.33%;
                background-color: #ccc;
                margin: 0 3px;
                &:first-child {
                    border-top-left-radius: 7px;
                    border-bottom-left-radius: 7px;
                }
                &:last-child {
                    border-top-right-radius: 7px;
                    border-bottom-right-radius: 7px;
                }
            }
            .strength-weak {
                background-color: #ec3701;
            }
            .strength-center {
                background-color: #f78115;
            }
            .strength-strong {
                background-color: #6ba001;
            }
        }
    }
}
</style>