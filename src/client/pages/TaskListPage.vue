<script setup lang="ts">
import {
  NDataTable,
  useMessage,
  NButton,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSwitch,
  NFormItemGi,
  NGrid,
  FormInst,
  NSelect,
} from "naive-ui";
import axios from "axios";
import type { DataTableProps } from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RowData } from "naive-ui/es/data-table/src/interface.js";
import { intervalsOptions } from "./intervals.js";

type Task = {
  phone: string;
  active: boolean;
  intervals: number;
  note: string;
  create_at: string;
  update_at: string;
};

const router = useRouter();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const columns: DataTableProps["columns"] = [
  {
    title: "手机号",
    key: "phone",
  },
  {
    title: "状态",
    key: "active",
    render: (row: Task) => {
      return row.active ? "轰炸中🔥" : "安祥😴";
    },
  },
  {
    title: "攻击间隔",
    key: "intervals",
    render: (row: Task) => {
      return `${row.intervals / 1000}秒`;
    },
  },
  {
    title: "备注",
    key: "note",
    render: (row: Task) => {
      return row.note === "" ? "-" : row.note ?? "-";
    },
  },
  {
    title: "创建时间",
    key: "create_at",
    render: (row: Task) => {
      return new Date(row.create_at).toLocaleString();
    },
    sorter: (a: Task, b: Task) => {
      return new Date(a.update_at).getTime() - new Date(b.update_at).getTime();
    },
  },
  {
    title: "更新时间",
    key: "update_at",
    render: (row: Task) => {
      return new Date(row.create_at).toLocaleString();
    },
    sorter: (a: Task, b: Task) => {
      return new Date(a.update_at).getTime() - new Date(b.update_at).getTime();
    },
  },
];
const rowProps: DataTableProps["rowProps"] = (row: RowData) => {
  return {
    style: {
      cursor: "pointer",
    },
    onClick: () => {
      router.push(`/task/${row.phone}`);
    },
  };
};
const tasks = ref<Task[]>([]);
axios
  .get("/tasks")
  .then((res) => {
    tasks.value = res.data.data;
  })
  .catch((err) => {
    message.error(err.message);
  });
const showModal = ref(false);
const formValue = ref({
  phone: "",
  note: "",
  active: true,
  intervals: 120000,
});
const rules = {
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
};

function submit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((e) => {
    if (!e) {
      axios
        .post("/tasks", formValue.value)
        .then(() => {
          message.success("创建成功");
          window.location.reload();
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      message.error("请检查表单");
    }
  });
}
</script>

<template>
  <NSpace vertical size="large">
    <NDataTable :row-props="rowProps" :columns="columns" :data="tasks" />
    <NButton type="primary" @click="showModal = true">新建任务</NButton>
  </NSpace>
  <NModal
    style="width: 35rem"
    preset="card"
    title="新建任务"
    v-model:show="showModal"
  >
    <NForm ref="formRef" :rules="rules" :model="formValue">
      <NGrid :cols="16" :x-gap="24">
        <NFormItemGi :span="10" label="手机号" path="phone">
          <NInput v-model:value="formValue.phone" placeholder="目标" />
        </NFormItemGi>
        <NFormItemGi :span="6" label="是否启用" path="active">
          <NSwitch v-model:value="formValue.active" />
        </NFormItemGi>
      </NGrid>
      <NGrid :cols="16" :x-gap="24">
        <NFormItemGi :span="10" label="备注" path="note">
          <NInput v-model:value="formValue.note" placeholder="备注" />
        </NFormItemGi>
        <NFormItemGi :span="6" label="攻击间隔" path="intevals">
          <NSelect
            v-model:value="formValue.intervals"
            :options="intervalsOptions"
          />
        </NFormItemGi>
      </NGrid>
      <NSpace justify="end">
        <NFormItem>
          <NSpace>
            <NButton @click="showModal = false"> 取消 </NButton>
            <NButton type="primary" @click="submit"> 确定 </NButton>
          </NSpace>
        </NFormItem>
      </NSpace>
    </NForm>
  </NModal>
</template>
