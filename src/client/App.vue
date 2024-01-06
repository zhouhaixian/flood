<script setup lang="ts">
import { h, ref } from "vue";
import {
  NCard,
  NInput,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NH1,
  NText,
  NMenu,
  MenuOption,
  NMessageProvider,
  NDialogProvider,
  NSpin,
  NConfigProvider,
} from "naive-ui";
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";

const password = ref("");
const isDev = import.meta.env.DEV;
const menu: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: "/tasks",
        },
        { default: () => "任务" }
      ),
    key: "task",
  },
];

if (import.meta.env.DEV) {
  menu.push({
    label: () =>
      h(
        RouterLink,
        {
          to: "/debug",
        },
        { default: () => "调试" }
      ),
    key: "debug",
  });
}

const isLoading = ref(false);
axios.interceptors.request.use(
  (config) => {
    isLoading.value = true;
    return config;
  },
  (error) => {
    isLoading.value = false;
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    isLoading.value = false;
    return response;
  },
  (error) => {
    isLoading.value = false;
    return Promise.reject(error);
  }
);

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
</script>

<template>
  <NSpin
    :content-style="isLoading ? 'opacity: 0.1;' : undefined"
    :show="isLoading"
  >
    <NMessageProvider>
      <NDialogProvider>
        <NConfigProvider :hljs="hljs">
          <div
            style="
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            v-if="password !== 'flood@zhou' && !isDev"
          >
            <div>
              <NCard title="请输入密码">
                <NInput
                  type="password"
                  placeholder="密码"
                  show-password-on="click"
                  maxlength="32"
                  v-model:value="password"
                />
              </NCard>
            </div>
          </div>
          <div style="padding: 2rem" v-else>
            <NLayout>
              <NLayoutHeader>
                <NH1 prefix="bar">
                  <NText type="primary"> Flood </NText>
                </NH1>
              </NLayoutHeader>
              <NLayout has-sider>
                <NLayoutSider bordered>
                  <NMenu :options="menu" />
                </NLayoutSider>
                <NLayoutContent bordered><RouterView /></NLayoutContent>
              </NLayout>
            </NLayout>
          </div>
        </NConfigProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NSpin>
</template>

<style scoped>
.n-layout-content {
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
