<script setup lang="ts">
import WriteupsSideBar from '@/components/WriteupsSideBar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <transition name="fade" appear>
    <div class="h-screen flex">
      <writeups-side-bar />
      <div class="w-px self-stretch my-5 bg-black bg-opacity-10"></div>
      <div class="flex-1 overflow-x-hidden overflow-y-scroll">
        <router-view :key="$route.path" />
      </div>
    </div>
  </transition>
</template>
