import { defineStore } from "pinia";

type State = {
  bulk: boolean;
};

export const useBulkStore = defineStore("bulk", {
  state: () =>
    <State>{
      bulk: false,
    },
  actions: {
    setBulkEdit(bulk: boolean) {
      this.bulk = bulk;
    },
  },
});
