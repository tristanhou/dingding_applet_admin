// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import iView from 'iview';
import i18n from '@/locale';
import config from '@/config';
import importDirective from '@/directive';
import installPlugin from '@/plugin';
import './index.less';
import '@/assets/icons/iconfont.css';
import TreeTable from 'tree-table-vue';
import http from '@/api/http';
import api from '@/api/api';
import Cookies from 'js-cookie';
import Utils from './libs/utils';
import parse from 'url-parse';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')
// Vue.use(ElementUI);
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(TreeTable);
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
Vue.prototype.$http = http;
Vue.prototype.$api = api;
Vue.prototype.$cookie = Cookies;
Vue.prototype.$utils = Utils;
Vue.prototype.$parse = parse;
/**
 * 注册指令
 */
importDirective(Vue);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
});
