export default {
    /**
   * @description 配置显示在浏览器标签的title
   */
    title: 'jimicloud',
    /**
   * @description token在Cookie中存储的天数，默认1天
   */
    cookieExpires: 1,
    /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
    useI18n: true,
    /**
   * @description api请求基础路径
   */
    baseUrl: {
        dev: '',
        pro: 'https://www.easy-mock.com/mock/5bce871a98c3e07240b7e07e/jimilbs'
    },
    /**
   * @description 默认打开的首页的路由name值，默认为home
   */
    homeName: 'home',
    /**
   * @description 需要加载的插件, 以及插件初始化全局配置参数
   */
    plugin: {

        loading: {
            type: 'loading-one'
        },
        'message': {
            animation: ''
        }
    }
};
