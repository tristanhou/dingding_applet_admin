<template>
    <div class="loading-mask" :style="maskStyles" v-show="show">
        <div class="loading-box">
            <div :class="[type]"></div>
			<div class="loading-text">{{text}}</div>
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

        type: {
            type: String,
            default: 'loading-one'
        },

        //加载提示文字
        text: {
            type: String,
            default: '加载中...'
        },

        maskStyles: {
            type: Object,
            default: function () {
                return {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                };
            }
        },
    },
};
</script>
<style lang="less" scoped>
    .loading-mask {
        position: fixed;
        z-index: 9999;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        // background-color: #fff;
        // background-color: rgba(255, 255, 255, 0.7);

        .loading-box {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 90px;
            height: 90px;
            border-radius: 10px;
            background-color: rgba(0, 0, 0, 0.6);
        }

        .loading-text {
            margin-top: 10px;
            color: #fff,
        }


        /* 加载动画一 */
        .loading-one {
            width: 34px;
            height: 34px;
            animation: rotate infinite 0.8s linear;
            border: 2px solid #fff;
            border-top-color: transparent;
            border-radius: 100%;
        }

        /* 加载动画二 */
        .loading-two {
            width: 34px;
            height: 34px;
            animation: rotate infinite 0.8s linear;
            border: 2px solid #fff;
            border-top-color: rgba(0, 0, 0, .2);
            border-right-color: rgba(0, 0, 0, .2);
            border-bottom-color: rgba(0, 0, 0, .2);
            border-radius: 100%;
        }

        /* 动画声明- 旋转 */
        @keyframes rotate {
            0% {
                transform: rotate(0);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        /* 动画声明- 上下浮动 */
        @keyframes floating {
            0% {
                top: 0;
            }

            50% {
                top: -10px;
            }

            100% {
                top: 0;
            }
        }


        .sk-circle {
            position: relative;
            width: 40px;
            height: 40px;
        }

        .loading-three .sk-child {
            position: absolute;
            left: 0;
            top: 0;
            width: 40px;
            height: 40px;
        }

        .sk-circle .sk-child:before {
            content: '';
            display: block;
            margin: 0 auto;
            width: 15%;
            height: 15%;
            background-color: #fff;
            border-radius: 100%;
            animation: circleBounceDelay 1.2s infinite ease-in-out both;
        }

        .sk-circle .sk-circle2 {
            transform: rotate(30deg);
        }

        .sk-circle .sk-circle3 {
            transform: rotate(60deg);
        }

        .sk-circle .sk-circle4 {
            transform: rotate(90deg);
        }

        .sk-circle .sk-circle5 {
            transform: rotate(120deg);
        }

        .sk-circle .sk-circle6 {
            transform: rotate(150deg);
        }

        .sk-circle .sk-circle7 {
            transform: rotate(180deg);
        }

        .sk-circle .sk-circle8 {
            transform: rotate(210deg);
        }

        .sk-circle .sk-circle9 {
            transform: rotate(240deg);
        }

        .sk-circle .sk-circle10 {
            transform: rotate(270deg);
        }

        .sk-circle .sk-circle11 {
            transform: rotate(300deg);
        }

        .sk-circle .sk-circle12 {
            transform: rotate(330deg);
        }

        .sk-circle .sk-circle2:before {
            animation-delay: -1.1s;
        }

        .sk-circle .sk-circle3:before {
            animation-delay: -1s;
        }

        .sk-circle .sk-circle4:before {
            animation-delay: -0.9s;
        }

        .sk-circle .sk-circle5:before {
            animation-delay: -0.8s;
        }

        .sk-circle .sk-circle6:before {
            animation-delay: -0.7s;
        }

        .sk-circle .sk-circle7:before {
            animation-delay: -0.6s;
        }

        .sk-circle .sk-circle8:before {
            animation-delay: -0.5s;
        }

        .sk-circle .sk-circle9:before {
            animation-delay: -0.4s;
        }

        .sk-circle .sk-circle10:before {
            animation-delay: -0.3s;
        }

        .sk-circle .sk-circle11:before {
            animation-delay: -0.2s;
        }

        .sk-circle .sk-circle12:before {
            animation-delay: -0.1s;
        }

        @keyframes circleBounceDelay {

            0%,
            80%,
            100% {
                transform: scale(0);
            }

            40% {
                transform: scale(1);
            }
        }
    }
</style>