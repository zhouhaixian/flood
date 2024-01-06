<script setup lang="ts">
import { h, ref } from "vue";
import {
  NPageHeader,
  NH3,
  NIcon,
  NTag,
  NH2,
  NText,
  NSwitch,
  NSpace,
  NButton,
  useMessage,
  useDialog,
  NModal,
  NInput,
  NH4,
  NSelect,
  NGrid,
  NGi,
  NStatistic,
  NCard,
  NDataTable,
  NCollapse,
  NCollapseItem,
  DataTableColumns,
  NNumberAnimation,
  NDescriptions,
  NDescriptionsItem,
  NLog,
  NConfigProvider,
} from "naive-ui";
import { useRouter } from "vue-router";
import axios from "axios";
import { intervalsOptions } from "./intervals.js";

const props = defineProps(["phone"]);
const router = useRouter();
function handleBack() {
  router.back();
}

const message = useMessage();
const dialog = useDialog();
const active = ref(false);
const intervals = ref(120000);
const note = ref("");

function handleActive() {
  setTimeout(() => {
    axios
      .patch(`/tasks/${props.phone}`, {
        active: active.value,
      })
      .catch((err) => {
        message.error(err.message);
        active.value = !active.value;
      });
  }, 100);
}
function handleDelete() {
  dialog.warning({
    title: "删除任务",
    content: "确定要删除该任务吗？",
    positiveButtonProps: {
      type: "error",
    },
    positiveText: "删除",
    negativeText: "取消",
    onPositiveClick: () => {
      axios
        .delete(`/tasks/${props.phone}`)
        .then(() => {
          message.success("删除成功");
          router.push("/tasks");
        })
        .catch((err) => {
          message.error(err.message);
        });
    },
  });
}

const showChangeNoteModal = ref(false);
function updateNote() {
  axios
    .patch(`/tasks/${props.phone}`, {
      note: note.value,
    })
    .then(() => {
      message.success("修改成功");
      window.location.reload();
    })
    .catch((err) => {
      message.error(err.message);
    });
}

function handleIntervals() {
  setTimeout(() => {
    axios
      .patch(`/tasks/${props.phone}`, {
        intervals: intervals.value,
      })
      .catch((err) => {
        message.error(err.message);
        window.location.reload();
      });
  }, 100);
}

const requests = ref(0);
const sms = ref(0);
const errors = ref(0);

type Log = {
  create_at: string;
  status: string;
  phone: string;
  provider: string;
  message: string;
  response: string;
};
const columns: DataTableColumns<Log> = [
  {
    title: "时间",
    key: "create_at",
    render(row) {
      return new Date(row.create_at).toLocaleString();
    },
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render: (row) => {
      if (row.status === "success") {
        return h(NTag, { type: "success", size: "small" }, "成功");
      } else if (row.status === "fail") {
        return h(NTag, { type: "error", size: "small" }, "失败");
      } else {
        return row.status;
      }
    },
  },
  {
    title: "目标",
    key: "phone",
  },
  {
    title: "运营商",
    key: "provider",
    ellipsis: {
      tooltip: true,
    },
    ellipsisComponent: "performant-ellipsis",
  },
  {
    title: "日志信息",
    key: "message",
    ellipsis: {
      tooltip: true,
    },
    ellipsisComponent: "performant-ellipsis",
    width: 300,
    render: (row) => row.message ?? "-",
  },
  {
    title: "响应内容",
    key: "response",
    ellipsis: {
      tooltip: true,
    },
    ellipsisComponent: "performant-ellipsis",
    render: (row) => row.response ?? "-",
  },
  {
    title: "操作",
    key: "actions",
    render: (row) => {
      return h(
        NButton,
        {
          onClick: () => {
            logDetail.value.show = true;
            logDetail.value.data = row;
          },
        },
        "详情"
      );
    },
    width: 150,
  },
];
const logDetail = ref<any>({
  show: false,
  data: {},
});
const logs = ref([]);

function fetchData() {
  if (!showChangeNoteModal.value) {
    axios
      .get(`/tasks/${props.phone}`)
      .then((res) => {
        active.value = res.data.data.active;
        intervals.value = res.data.data.intervals;
        note.value = res.data.data.note;
      })
      .catch((err) => {
        message.error(err.message);
      });

    axios.get(`/logs/count/${props.phone}`).then((res) => {
      requests.value = res.data.data.requests;
      sms.value = res.data.data.sms;
      errors.value = res.data.data.errors;
    });

    axios.get(`/logs/${props.phone}`).then((res) => {
      logs.value = res.data.data;
    });
  }
}
fetchData();
setInterval(fetchData, 10000);
</script>

<template>
  <NPageHeader @back="handleBack">
    <NGrid :cols="5">
      <NGi>
        <NStatistic label="已发送请求数" tabular-nums>
          <NNumberAnimation show-separator :from="0" :to="requests" />
          <template #suffix>
            <NText>个</NText>
          </template>
        </NStatistic>
      </NGi>
      <NGi>
        <NStatistic label="已发送短信" tabular-nums>
          <NNumberAnimation show-separator :from="0" :to="sms" />
          <template #suffix>
            <NText>条</NText>
          </template>
        </NStatistic>
      </NGi>
      <NGi>
        <NStatistic label="错误次数" tabular-nums>
          <NNumberAnimation show-separator :from="0" :to="errors" />
          <template #suffix>
            <NText>次</NText>
          </template>
        </NStatistic>
      </NGi>
      <NGi>
        <NStatistic label="攻击间隔" :value="intervals / 1000">
          <template #suffix>
            <NText>秒</NText>
          </template>
        </NStatistic>
      </NGi>
    </NGrid>
    <template #title>
      <NH2 style="margin: 0" prefix="bar">
        <NText type="primary">任务详情</NText>
      </NH2>
    </template>
    <template #header>
      <NH3 style="margin: 0" type="success">
        <NSpace>
          <NTag type="success">
            {{ props.phone }}
            <template #avatar>
              <NIcon size="large">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08c1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"
                    fill="currentColor"
                  ></path>
                </svg>
              </NIcon>
            </template>
          </NTag>
          <NSwitch
            size="large"
            style="font-size: 0.8rem"
            v-model:value="active"
            @update:value="handleActive"
          >
            <template #icon>
              <div style="font-size: xx-small">💥</div>
            </template>
            <template #checked> 轰炸中 </template>
            <template #unchecked>
              <NText>已停止</NText>
            </template>
          </NSwitch>
        </NSpace>
      </NH3>
    </template>
    <template #extra>
      <NSpace>
        <NSelect
          style="width: 10rem"
          @update:value="handleIntervals"
          v-model:value="intervals"
          :options="intervalsOptions"
        />
        <NButton @click="showChangeNoteModal = true"> 修改备注 </NButton>
        <NButton type="error" @click="handleDelete"> 删除 </NButton>
      </NSpace>
    </template>
    <template #footer>
      <NCollapse>
        <NCollapseItem title="备注">
          <NCard v-show="note !== '' && note !== null">
            <template #header>
              <NH4 style="margin: 0"><NText depth="3">备注</NText></NH4>
            </template>
            <NText depth="3"> {{ note }} </NText>
          </NCard>
        </NCollapseItem>
      </NCollapse>
    </template>
  </NPageHeader>
  <NModal
    style="width: 30rem"
    preset="card"
    title="修改备注"
    v-model:show="showChangeNoteModal"
  >
    <NSpace justify="space-between">
      <NInput style="width: 22rem" v-model:value="note" placeholder="备注" />
      <NButton type="primary" @click="updateNote"> 确定 </NButton>
    </NSpace>
  </NModal>
  <NDataTable
    style="margin-top: 1rem"
    size="small"
    max-height="31rem"
    :scroll-x="1000"
    virtual-scroll
    :columns="columns"
    :data="logs"
  />
  <NModal
    style="width: 40rem"
    preset="card"
    title="日志详情"
    v-model:show="logDetail.show"
  >
    <NDescriptions label-placement="left" bordered>
      <NDescriptionsItem :span="2">
        <template #label>
          <NText>时间</NText>
        </template>
        <NText>{{ new Date(logDetail.data.create_at).toLocaleString() }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem>
        <template #label>
          <NText>状态</NText>
        </template>
        <NTag
          v-if="logDetail.data.status === 'success'"
          type="success"
          size="small"
        >
          成功
        </NTag>
        <NTag
          v-else-if="logDetail.data.status === 'fail'"
          type="error"
          size="small"
        >
          失败
        </NTag>
        <NText v-else>{{ logDetail.data.status }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :span="3">
        <template #label>
          <NText>目标手机号</NText>
        </template>
        <NText>{{ logDetail.data.phone }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :span="3">
        <template #label>
          <NText>运营商</NText>
        </template>
        <NText>{{ logDetail.data.provider }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :span="3">
        <template #label>
          <NText>日志信息</NText>
        </template>
        <NTag v-if="logDetail.data.message === null"> 空 </NTag>
        <NText v-else>{{ logDetail.data.message }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem label-style="min-width: 8rem;" :span="3">
        <template #label>
          <NText>响应内容</NText>
        </template>
        <NTag v-if="logDetail.data.response === null"> 无 </NTag>
        <NLog
          v-else
          :rows="10"
          :log="logDetail.data.response"
          language="json"
        />
      </NDescriptionsItem>
      <NDescriptionsItem label-style="min-width: 8rem;" :span="3">
        <template #label>
          <NText>堆栈</NText>
        </template>
        <NTag v-if="logDetail.data.stack === null"> 空 </NTag>
        <NLog
          v-else
          :rows="10"
          :log="logDetail.data.stack"
          language="javascript"
          trim
        />
      </NDescriptionsItem>
    </NDescriptions>
  </NModal>
  <!-- TODO: 每日和过往-->
</template>
