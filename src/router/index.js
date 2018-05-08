import Vue from 'vue'
import Router from 'vue-router'
import Hello from 'components/Hello'
import markdownEditor from '../pages/markdown-editor.vue'
import list from '../pages/list.vue'
import listSee from '../pages/list-see.vue'
import manage from '../pages/manage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/markdown-editor/:id',
      name: 'markdownEditor',
      component: markdownEditor
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/list/see/:id',
      name: 'listSee',
      component: listSee
    },
    {
      path: '/manage',
      name: 'manage',
      component: manage
    }
  ]
})
