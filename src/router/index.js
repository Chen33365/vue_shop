import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Home/Welcome.vue'
import UserControl from '../components/UserControl/UserControl.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
// import Welcome from '../components/Home/Welcome.vue'
// import Welcome from '../components/Home/Welcome.vue'
// import Welcome from '../components/Home/Welcome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },{
    path:'/login',
    component: Login
  },{
    path:'/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: UserControl},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) =>{
  if(to.path === '/login') {
    next()
  }
  const token = window.sessionStorage.getItem('token')
  if(!token){
    return next('/login')
  }else{
    next()
  }
})

export default router
