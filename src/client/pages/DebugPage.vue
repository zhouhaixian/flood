<script setup lang="ts">
import axios from "axios";
import {
  NSelect,
  NButton,
  NSpace,
  NInput,
  NCard,
  NLog,
  NText,
  NTag,
} from "naive-ui";
import { ref } from "vue";

const options = ref([]);
const provider = ref(null);
const phone = ref(import.meta.env.VITE_DEBUG_PHONE || "");

axios.get("/debug/providers").then((res) => {
  options.value = res.data.data.map((item: string) => {
    const name = item.replaceAll("_", ".");
    return {
      label: name,
      value: item,
    };
  });
});

const response = ref();
const stack = ref();

function handleDebug() {
  if (!provider.value) {
    return;
  }
  axios
    .get(`/debug/providers/${provider.value}?phone=${phone.value}`)
    .then((res) => {
      response.value = JSON.stringify(res.data.data, null, 4);
      stack.value = res.data.msg;
    });
}
</script>

<template>
  <NSpace vertical>
    <NCard title="参数">
      <NSpace>
        <NTag size="large">
          <NText depth="3"> 当前已支持 {{ options.length }} 个运营商 </NText>
        </NTag>
        <NSelect
          placeholder="请输入运营商"
          style="width: 25rem"
          v-model:value="provider"
          :options="options"
        />
        <NInput
          placeholder="请输入手机号"
          style="width: 10rem"
          v-model:value="phone"
        />
        <NButton type="primary" @click="handleDebug">开始调试</NButton>
      </NSpace>
    </NCard>
    <NCard title="响应">
      <NLog language="json" :rows="13" :log="response" />
    </NCard>
    <NCard title="堆栈">
      <NLog language="javascript" :rows="13" :log="stack" />
    </NCard>
  </NSpace>
</template>
