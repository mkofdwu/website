<script setup lang="ts">
defineProps<{ name: string; sm?: boolean }>();
</script>

<template>
  <i class="material-symbols-outlined" :class="sm ? 'text-xl' : 'text-2xl'">{{ name }}</i>
</template>
