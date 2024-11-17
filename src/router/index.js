import { createRouter, createWebHistory } from 'vue-router';
import MyHome from '../components/MyHome.vue';
import MyPost from '../components/MyPost.vue';
import CreatePost from '../components/CreatePost.vue';
import EditPost from '../components/EditPost.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
    { path: '/', component: MyHome },
    { path: '/post/:id', component: MyPost },
    { path: '/create', component: CreatePost },
    { path: '/edit/:id', component: EditPost },
    { path: '/:catchAll(.*)', component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
