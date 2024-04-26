<template>
  <div class="text-subtitle-1 text-grey-darken-2">{{ timeStr }}</div>
</template>

<script setup lang="ts">
import moment from "moment";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const time = ref(new Date());
const intervalId = ref<ReturnType<typeof setInterval>>();

const timeStr = computed(() =>
  moment(time.value).format("HH:mm:ss DD.MM.YYYY")
);

onMounted(() => {
  intervalId.value = setInterval(() => {
    time.value = new Date();
  }, 500);
});
onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});
</script>
