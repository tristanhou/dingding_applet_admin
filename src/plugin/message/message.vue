<template>

    <div v-if="show" :class="['message-box', animation =='jump' ? 'message-box-jump' : '']">
        <div :class="['message', isShow]">
            <span :class="['iconfont', judgeType(type)]"></span>
            <span>{{text}}</span>
        </div>
    </div>

</template>
<script>
    export default {

        props: {

            //控制隐藏
            show: {
                type: Boolean,
                default: false
            },

            //控制动画
            isShow: {
                type: String,
                default: ''
            },

            // 提示类型
            type: {
                type: String,
                default: ''
            },

            // 提示文字
            text: {
                type: String,
                default: '加载中...'
            },

            //动画类型
            animation: {
                type: '',
                default: ''
            },
        },

        methods: {

            judgeType(type) {
                let iconName;
                switch(type){
                case 'success':
                    iconName = 'icon-chenggong';
                    break;
                case 'error':
                    iconName = 'icon-shibai';
                    break;
                case 'warning':
                    iconName = 'icon-jinggao';
                    break;
                default:
                    return 'icon-chenggong';
                }

                return iconName;
            }
        },
    };
</script>
<style lang="less" scoped>
    @import '../../assets/icons/message/iconfont.css';
    .message-box {
        position: fixed;
        z-index: 9999;
        top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 60px;
        background-color: rgba(0, 0, 0, 0);

        .message {
            display: flex;
            align-items: center;
            padding: 8px 15px;
            font-size: 14px;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);

            .iconfont {
                margin-right: 10px;
            }

            .icon-chenggong {
                color: #00c1de;
            }

            .icon-shibai {
                color: #fa2c2c;
            }

            .icon-jinggao {
                color: #fc9917;
            }
        }

        .message-top-show {
            animation: showAnimate 0.4s forwards;
        }

        .message-top-hide {
            animation: hideAnimate 0.4s forwards;
        }

        .message-jump-show {
            animation: animGenieShow 0.4s forwards;
        }

        .message-jump-hide {
            animation: animGenieHide 0.4s forwards;
        }

        // 提示信息出现动画
        @keyframes showAnimate {
            0% {
                opacity: 0;
                transform: translateY(-100px)
            }

            100% {
                opacity: 1;
                transform: translateY(0px)
            }
        }

        // 提示信息消失动画
        @keyframes hideAnimate {
            0% {
                opacity: 1;
                transform: translateY(0px)
            }

            100% {
                opacity: 0;
                transform: translateY(-100px)
            }    
        }

        // 提示信息出现动画(二)
        @keyframes animGenieShow {
            0% {
                opacity: 0;
                -webkit-transform: translate3d(0, calc(200% + 30px), 0) scale3d(0, 1, 1);
                -webkit-animation-timing-function: ease-in;
                transform: translate3d(0, calc(200% + 30px), 0) scale3d(0, 1, 1);
                animation-timing-function: ease-in;
            }

            40% {
                opacity: 0.5;
                -webkit-transform: translate3d(0, 0, 0) scale3d(0.02, 1.1, 1);
                -webkit-animation-timing-function: ease-out;
                transform: translate3d(0, 0, 0) scale3d(0.02, 1.1, 1);
                animation-timing-function: ease-out;
            }

            70% {
                opacity: 0.6;
                -webkit-transform: translate3d(0, -40px, 0) scale3d(0.8, 1.1, 1);
                transform: translate3d(0, -40px, 0) scale3d(0.8, 1.1, 1);
            }

            100% {
                opacity: 1;
                -webkit-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
                transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
            }
        }

        // 提示信息消失动画(二)
        @keyframes animGenieHide {
            0% {
                opacity: 1;
                -webkit-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
                transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
            }

            40% {
                opacity: 0.6;
                -webkit-transform: translate3d(0, -40px, 0) scale3d(0.8, 1.1, 1);
                transform: translate3d(0, -40px, 0) scale3d(0.8, 1.1, 1);    
            }

            70% {
                opacity: 0.5;
                -webkit-transform: translate3d(0, 0, 0) scale3d(0.02, 1.1, 1);
                -webkit-animation-timing-function: ease-out;
                transform: translate3d(0, 0, 0) scale3d(0.02, 1.1, 1);
                animation-timing-function: ease-out;
            }

            100% {
                opacity: 0;
                -webkit-transform: translate3d(0, calc(200% + 30px), 0) scale3d(0, 1, 1);
                -webkit-animation-timing-function: ease-in;
                transform: translate3d(0, calc(200% + 30px), 0) scale3d(0, 1, 1);
                animation-timing-function: ease-in;
            }
        }

        
    }

    .message-box-jump {
        top: 40px;
        // bottom: 40px;
    }
</style>