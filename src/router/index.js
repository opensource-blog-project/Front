import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import MainView from '../views/MainView.vue';
import NewPostView from '../views/NewPostView.vue';
import VisitingPostView from '../views/VisitingPostView.vue';
import MyPageView from '../views/MyPageView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: SignUpView },
  { path: '/main', name: 'Main', component: MainView },
  { path: '/newpost', name: 'NewPost', component: NewPostView },
  { path: '/visiting/:id', name: 'Visiting', component: VisitingPostView },
  { path: '/mypage', name: 'MyPage', component: MyPageView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
