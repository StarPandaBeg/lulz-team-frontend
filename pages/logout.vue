<script lang="ts" setup>
import { useAuthStore } from "~/store/auth";

const auth = useAuthStore();
const router = useRouter();
auth.setUser(-1);
router.go(-1);
</script>

<template></template>
