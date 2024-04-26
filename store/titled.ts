import { defineStore } from "pinia";

type TitledPageAction = {
  props?: Record<string, any>;
  events?: Record<string, Function>;
  text?: string;
};

type TitledPageStore = {
  title: string;
  actions: Array<TitledPageAction>;
};

export const useTitledPageStore = defineStore("titled-page", {
  state: () =>
    <TitledPageStore>{
      title: "",
      actions: [],
    },
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
    clearActions() {
      this.actions.length = 0;
    },
    addAction(action: TitledPageAction) {
      this.actions.push(action);
    },
  },
});
