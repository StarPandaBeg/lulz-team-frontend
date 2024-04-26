<script>
import { useDropzone } from "vue3-dropzone";

export default {
  setup() {
    function onDrop(acceptFiles, rejectReasons) {
      console.log(acceptFiles);
      console.log(rejectReasons);
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });

    return {
      getRootProps,
      getInputProps,
      ...rest,
    };
  },
};
</script>

<template>
  <div class="dropzone" :class="{ active: isDragActive }">
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()" />
      <p v-if="isDragActive">Переместите файл сюда</p>
      <p v-else>Перетащите сюда файлы или нажмите для выбора</p>
    </div>
  </div>
</template>

<style lang="scss">
.dropzone {
  padding: 20px 10px;
  border: 2px dashed #bbb;
  border-radius: 5px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  &.active {
    background: #bbb;
  }
}
</style>
