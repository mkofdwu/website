<script setup lang="ts">
import WriteupsSideBar from '@/components/WriteupsSideBar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <transition name="fade" appear>
    <div class="h-full flex">
      <writeups-side-bar />
      <div class="w-px self-stretch my-5 bg-black bg-opacity-10"></div>
      <main class="flex-1 overflow-x-hidden overflow-y-scroll">
        <router-view :key="$route.path" />
      </main>
    </div>
  </transition>
</template>

<style scoped>
main::-webkit-scrollbar {
  display: block;
  width: 8px;
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
