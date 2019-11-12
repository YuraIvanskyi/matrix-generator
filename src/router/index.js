import Vue from 'vue';
import VueRouter from 'vue-router';
import Matrix from '../views/MatrixEditor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Matrix,
  },
  {
    path: '/matrix',
    name: 'Matrix',
    component: Matrix,
  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "history" */ '../views/MatrixHistory.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
