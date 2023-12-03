<script setup lang="ts">
defineProps<{ name: string; size?: string }>();
</script>

<template>
  <i class="material-symbols-outlined" :class="size ?? 'text-2xl'">{{ name }}</i>
</template>
