<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <i class="material-symbols-outlined text-2xl">{{ name }}</i>
</template>
