import loadingComponent from './loading.vue';
export default {
    // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
    install: function (Vue, options) {
        const loadingPlugin = Vue.extend(loadingComponent);
        const instance = new loadingPlugin({
            el: document.createElement('div')
        });
        instance.type = options.type;
        let loading = {
            /**
             * @method show 打开加载框
             * @param {*} el 加载框父容器，默认body
             */
            show (el) {
                let dom = el ? el : document.body;
                instance.show = true;
                dom.appendChild(instance.$el);
            },
            // 隐藏加载框
            hide () {
                instance.show = false;
            },
        };
        Vue.prototype.$loading = loading;
    }
};