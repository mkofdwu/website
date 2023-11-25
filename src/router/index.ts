import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import ProjectsListView from '@/views/ProjectsListView.vue';
import ProjectView from '@/views/ProjectView.vue';
import WriteupWrapper from '@/views/WriteupWrapper.vue';
import WriteupView from '@/views/WriteupView.vue';
import ContactView from '@/views/ContactView.vue';
import CTFOverview from '@/views/CTFOverview.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsListView
    },
    {
      path: '/project/:id',
      name: 'project',
      component: ProjectView
    },
    {
      path: '/writeups',
      redirect: '/writeups/overview'
    },
    {
      path: '/writeups/:slug',
      component: WriteupWrapper,
      children: [
        {
          path: '/writeups/overview',
          component: CTFOverview
        },
        {
          path: '',
          name: 'writeup',
          component: WriteupView
        }
      ]
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    }
  ]
});

export default router;
