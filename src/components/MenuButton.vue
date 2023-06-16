<script setup lang="ts">
defineProps<{ opened: boolean }>();
</script>

<template>
  <div class="flex flex-col gap-y-1.5">
    <div class="bar b1" :class="{ opened }"></div>
    <div class="bar b2" :class="{ opened }"></div>
    <div class="bar b3" :class="{ opened }"></div>
  </div>
</template>

<style scoped>
.bar {
  width: 1.5rem;
  height: 0.125rem;
  background-color: black;
}

.b1,
.b3 {
  transition: transform 200ms;
  transform-origin: center;
}

.b2 {
  transition: transform 200ms, opacity 200ms;
}

.b1.opened {
  transform: rotate(45deg) translate(0.35rem, 0.35rem);
}

.b2.opened {
  transform: scaleX(0.5);
  opacity: 0;
}

.b3.opened {
  transform: rotate(-45deg) translate(0.35rem, -0.35rem);
}
</style>
