import Main from '@/components/main';
// import parentView from '@/components/parent-view'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/login.vue')
    },
    {
        path: '/',
        name: 'home',
        redirect: 'home',
        component: Main,
        meta: {
            hideInMenu: false,
            notCache: true
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: false,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home'
                },
                component: () => import('@/view/single-page/home')
            }
        ]
    },
    {
        path: '/message',
        name: 'message',
        component: Main,
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        children: [
            {
                path: 'message_page',
                name: 'message_page',
                meta: {
                    icon: 'md-notifications',
                    title: '消息中心'
                },
                component: () => import('@/view/single-page/message/index.vue')
            }
        ]
    },
    {
        path: '/config',
        name: 'config',
        meta: {
            icon: 'logo-buffer',
            title: '配置管理',
          
        },
        component: Main,
        children: [
            {
                path: 'configPdt',
                name: 'configPdt',
                meta: {
                    icon: 'ios-infinite',
                    title: 'PDT配置'
                },
                component: () => import('@/view/config/configPdt/configPdt.vue')
            },
            // {
            //     path: 'configProjectManager',
            //     name: 'configProjectManager',
            //     meta: {
            //         icon: 'ios-infinite',
            //         title: '项目经理配置'
            //     },
            //     component: () => import('@/view/config/configProjectManager/configProjectManager.vue')
            // },
            {
                path: 'configProject',
                name: 'configProject',
                meta: {
                    icon: 'ios-infinite',
                    title: '项目配置'
                },
                component: () => import('@/view/config/configProject/configProject.vue')
            },            
        ]
    },
    {
        path: '/statistics',
        name: 'statistics',
        meta: {
            icon: 'logo-buffer',
            title: '报表统计',
          
        },
        component: Main,
        children: [
            {
                path: 'detailReport',
                name: 'detailReport',
                meta: {
                    icon: 'ios-infinite',
                    title: '明细表'
                },
                component: () => import('@/view/statistics/detail/detailReport.vue')
            },
            {
                path: 'postReport',
                name: 'postReport',
                meta: {
                    icon: 'ios-infinite',
                    title: '岗位汇总表'
                },
                component: () => import('@/view/statistics/post/postReport.vue')
            },
            {
                path: 'projectReport',
                name: 'projectReport',
                meta: {
                    icon: 'ios-infinite',
                    title: '项目汇总表'
                },
                component: () => import('@/view/statistics/project/projectReport.vue')
            },
            {
                path: 'pdtReport',
                name: 'pdtReport',
                meta: {
                    icon: 'ios-infinite',
                    title: 'PDT汇总表'
                },
                component: () => import('@/view/statistics/pdt/pdtReport.vue')
            },
            {
                path: 'financeReport',
                name: 'financeReport',
                meta: {
                    icon: 'ios-infinite',
                    title: '财务统计表'
                },
                component: () => import('@/view/statistics/finance/financeReport.vue')
            },          
        ]
    },
    // {
    //     path: '/components',
    //     name: 'components',
    //     meta: {
    //         icon: 'logo-buffer',
    //         title: '组件'
    //     },
    //     component: Main,
    //     children: [
    //         {
    //             path: 'selectTree',
    //             name: 'selectTree',
    //             meta: {
    //                 icon: 'ios-infinite',
    //                 title: '树状下拉菜单'
    //             },
    //             component: () => import('@/view/components/selectTree/selectTree.vue')
    //         },
    //         {
    //             path: 'trees',
    //             name: 'trees',
    //             meta: {
    //                 icon: 'md-git-branch',
    //                 title: '组织树'
    //             },
    //             component: () => import('@/view/components/trees/trees.vue')
    //         },
    //         {
    //             path: 'tables',
    //             name: 'tables',
    //             meta: {
    //                 icon: 'md-git-branch',
    //                 title: '功能表格'
    //             },
    //             component: () => import('@/view/components/tables/table.vue')
    //         },
    //         // lofin-from组件
    //         {
    //             path:'login_form',
    //             name:'login_form',
    //             meta:{
    //                 icon: 'md-git-branch',
    //                 title: '登录表单'
    //             },
    //             component:resolve => require(['@/view/components/login/login.vue'],resolve)
    //         },
    //         // imei搜索组件
    //         {
    //             path:'search',
    //             name:'search',
    //             meta:{
    //                 icon: 'md-git-branch',
    //                 title: 'IMEI搜索'
    //             },
    //             component:resolve => require(['@/view/components/search/search.vue'],resolve)
    //         },
    //         // 树表可懒加载组件
    //         {
    //             path:'tree_table',
    //             name:'tree_table',
    //             meta:{
    //                 icon: 'md-git-branch',
    //                 title: '树表格'
    //             },
    //             component:resolve => require(['@/view/components/treeTable/treeTable.vue'],resolve)
    //         },
    //         // 懒加载树
    //         {
    //             path:'load_tree',
    //             name:'load_tree',
    //             meta:{
    //                 icon: 'md-git-branch',
    //                 title: '树表格'
    //             },
    //             component:resolve => require(['@/view/components/loadTree/loadTree.vue'],resolve)
    //         }
    //     ]
    // },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    },
];