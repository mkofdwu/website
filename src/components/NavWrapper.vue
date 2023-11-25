<script setup lang="ts">
import { ref } from 'vue';
import MenuButton from './MenuButton.vue';

const menuShown = ref(false);
</script>

<template>
  <div class="absolute left-0 bottom-0 right-0 flex flex-col justify-end">
    <div class="h-24 flex items-center gap-x-8 pl-28">
      <router-link
        v-for="[link, text] in [
          ['/about', 'about'],
          ['/projects', 'projects'],
          ['/writeups', 'ctf writeups'],
          ['/contact', 'contact']
        ]"
        :to="link"
        class="text-xl font-medium hover:text-primary transition-colors"
        @click="menuShown = false"
      >
        {{ text }}
      </router-link>
    </div>
    <div
      class="h-screen bg-[#f6f6f6] shrink-transition overflow-auto"
      :class="{ shrunk: menuShown }"
    >
      <slot />
    </div>
  </div>
  <menu-button
    v-if="$route.path !== '/'"
    class="absolute left-10 top-10 cursor-pointer"
    :opened="menuShown"
    @click="menuShown = !menuShown"
  />
</template>

<style scoped>
.shrink-transition {
  transition: margin-left 200ms, margin-right 200ms, height 200ms, border-top-left-radius 200ms,
    border-top-right-radius 200ms;
}

.shrunk {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  height: calc(100vh - 6rem);
  border-top-left-radius: 1.75rem;
  border-top-right-radius: 1.75rem;
}
</style>
