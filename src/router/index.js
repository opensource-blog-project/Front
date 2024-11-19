import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import MainView from '../views/MainView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: SignUpView },
  { path: '/main', name: 'Main', component: MainView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
