import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
  shareAppContext: true,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter((t) => t.type === toast.type).length !== 0) {
      return false;
    }
    return toast;
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options);
});
