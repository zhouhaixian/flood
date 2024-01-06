import { SelectMixedOption } from "naive-ui/es/select/src/interface.js";

export const intervalsOptions: SelectMixedOption[] = [
  {
    label: "极慢(10分钟)",
    value: 600000,
  },
  {
    label: "慢(5分钟)",
    value: 300000,
  },
  {
    label: "中(2分钟)",
    value: 120000,
  },
  {
    label: "快(1分钟)",
    value: 60000,
  },
  {
    label: "极快(30秒)",
    value: 30000,
  },
  {
    label: "丧心病狂(10秒)",
    value: 10000,
  },
];
