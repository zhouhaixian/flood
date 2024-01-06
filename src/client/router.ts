import TaskListPage from "./pages/TaskListPage.vue";
import TaskDetailPage from "./pages/TaskDetailPage.vue";
import DebugPage from "./pages/DebugPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/tasks",
    component: TaskListPage,
  },
  {
    path: "/task/:phone",
    component: TaskDetailPage,
    props: true,
  },
  { path: "/", redirect: "/tasks" },
];

if (import.meta.env.DEV) {
  routes.push({
    path: "/debug",
    component: DebugPage,
  });
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
