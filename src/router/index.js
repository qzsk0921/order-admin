import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/404',
        component: () => import('@/view/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/view/error-page/401'),
        hidden: true
    },
    {
        path: '/login',
        component: () => import('@/view/login/index'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/view/dashboard/index'),
                name: 'Dashboard',
                meta: { title: '主页', icon: 'backstage', affix: true }
            }
        ]
    },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    // {
    //     path: '/permission',
    //     component: Layout,
    //     redirect: '/permission/page',
    //     alwaysShow: true, // will always show the root menu
    //     name: 'Permission',
    //     meta: {
    //         title: 'Permission',
    //         icon: 'lock',
    //         roles: ['admin', 'editor'] // you can set roles in root nav
    //     },
    //     children: [
    //         {
    //             path: 'page',
    //             component: () => import('@/view/permission/page'),
    //             name: 'PagePermission',
    //             meta: {
    //                 title: 'Page Permission',
    //                 roles: ['admin'] // or you can only set roles in sub nav
    //             }
    //         },
    //         //   {
    //         //     path: 'directive',
    //         //     component: () => import('@/views/permission/directive'),
    //         //     name: 'DirectivePermission',
    //         //     meta: {
    //         //       title: 'Directive Permission'
    //         //       // if do not set roles, means: this page does not require permission
    //         //     }
    //         //   },
    //         //   {
    //         //     path: 'role',
    //         //     component: () => import('@/views/permission/role'),
    //         //     name: 'RolePermission',
    //         //     meta: {
    //         //       title: 'Role Permission',
    //         //       roles: ['admin']
    //         //     }
    //         //   }
    //     ]
    // },
    {
        path: '/order',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/view/order/index'),
                name: 'Order',
                meta: { title: '订单管理', icon: 'shopping', noCache: true, loading: 'tbody' }
            }
        ]
    },
    {
        path: '/merchandise',
        component: Layout,
        name: 'Merchandise',
        redirect: '/merchandise/main-merch',
        meta: {
            title: '商品管理',
            icon: 'merchandise',
        },
        children: [
            {
                path: 'main-merch',
                component: () => import('@/view/merchandise/main-merchandise'),
                name: 'MainMerchandise',
                meta: { title: '饮品', icon: 'food', noCache: true, loading: 'tbody' }
            },
            {
                path: 'min-merch',
                component: () => import('@/view/merchandise/min-merchandise'),
                name: 'MinMerchandise',
                meta: { title: '副食', icon: 'snack', noCache: true, loading: 'tbody' }
            },
            {
                path: 'prop-merch',
                component: () => import('@/view/merchandise/prop-merchandise'),
                name: 'PropMerchandise',
                meta: { title: '分类管理', icon: 'prop', noCache: true, loading: 'menu-type' }
            },
        ]
    },
    {
        path: '/operate',
        component: Layout,
        name: 'Operate',
        redirect: '/operate/banner',
        meta: {
            title: '店铺运营',
            icon: 'shop',
        },
        children: [
            {
                path: 'banner',
                component: () => import('@/view/operate/banner'),
                name: 'Banner',
                meta: { title: '广告投放', icon: 'banner', noCache: true, loading: 'advertisement-box' }
            },
            {
                path: 'coupon',
                component: () => import('@/view/operate/coupon'),
                name: 'Coupon',
                meta: { title: '优惠券(🚧)', icon: 'coupon', noCache: true }
            }
        ]
    },
    {
        path: '/refund',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/view/refund/index'),
                name: 'Refund',
                meta: { title: '退款管理(🚧)', icon: 'bug', noCache: true }
            }
        ]
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        hidden: true,
        children: [
            {
                path: 'index',
                component: () => import('@/view/profile/index'),
                name: 'Profile',
                meta: { title: '个人', icon: 'user', noCache: true }
            }
        ]
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
export default router;