import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import List from '../views/list.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      title:"外教超市（Tmore）"
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta:{
      title:"外教超市（Tmore）"
    }
  },
  {
    path: '/list',
    name: 'Home',
    component: List,
    meta:{
      title:"外教超市（Tmore）"
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
