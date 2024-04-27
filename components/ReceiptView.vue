<script setup lang="ts">
const shown = ref<boolean>();
const props = defineProps<{
  src: string;
}>();
</script>

<template>
  <div class="receipt" :class="{ a: shown }">
    <VSheet class="d-flex" :width="256" height="50vh">
      <VImg :src="props.src" :width="256" />
    </VSheet>
    <a href="#" @click="shown = !shown">
      <VIcon> mdi-file-document-outline </VIcon>
    </a>
  </div>
</template>

<style lang="scss" scoped>
div.receipt {
  &.a {
    transform: translateY(-50%);
  }

  width: 256px;
  display: block;
  position: fixed;
  right: 0;
  top: 50%;

  transform: translate(100%, -50%);
  transition: 0.2s;
  height: 50vh;
  z-index: 10000;

  a {
    padding: 10px;
    position: absolute;
    left: 0;
    top: 50%;
    z-index: 10001;

    background: #eee;
    color: #000;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    transform: translate(-100%, -50%);
  }
}
</style>
