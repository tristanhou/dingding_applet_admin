import messageComponent from './message.vue';
export default {
    // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
    install: function(Vue, ops={}){
        const MESSAGE = Vue.extend(messageComponent);
        const instance = new MESSAGE({
            el: document.createElement('div')
        });
        instance.animation = ops.animation || '';
        let setTimeoutId1, setTimeoutId2;
        const message = {
            /**
             * @method show 打开消息框
             * @param {*} type 消息类型(success, error, warning)
             * @param {*} text 消息的文字
             */
            show(type, text){
                clearTimeout(setTimeoutId1);
                clearTimeout(setTimeoutId2);
                instance.show = true;
                instance.type = type;
                instance.text = text;
                instance.isShow = instance.animation == 'jump' ? 'message-jump-show' : 'message-top-show';
                document.body.appendChild(instance.$el);
                setTimeoutId1 = setTimeout(() => {
                    instance.isShow = instance.animation == 'jump' ? 'message-jump-hide' : 'message-top-hide';
                    setTimeoutId2 = setTimeout(() => {
                        instance.show = false;
                    }, 1500);
                }, 1800);
            },
            //清除消息框
            destroy(){
                clearTimeout(setTimeoutId1);
                clearTimeout(setTimeoutId2);
                instance.show = false;
            },
        };
        Vue.prototype.$message = message;
    }
};