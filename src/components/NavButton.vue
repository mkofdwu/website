<template>
  <div
    class="nav-bar fixed w-screen py-24 pl-1/2 flex flex-col gap-y-5 bg-almost-black z-10"
    :class="{ opened }"
  >
    <router-link
      to="/"
      class="text-white text-4xl font-bold transition-opacity opacity-40 hover:opacity-100"
      >Home</router-link
    >
    <router-link
      to="/about"
      class="text-white text-4xl font-bold transition-opacity opacity-40 hover:opacity-100"
      >About</router-link
    >
    <router-link
      to="/projects"
      class="text-white text-4xl font-bold transition-opacity opacity-40 hover:opacity-100"
      >Projects</router-link
    >
    <router-link
      to="/contact"
      class="text-white text-4xl font-bold transition-opacity opacity-40 hover:opacity-100"
      >Contact</router-link
    >
  </div>
  <div
    class="fixed ml-24 mt-20 cursor-pointer w-fit z-20"
    @click="opened = !opened"
  >
    <div class="line" :class="{ opened }"></div>
    <div class="line line-2" :class="{ opened }"></div>
    <div
      class="grid grid-cols-3 transition-opacity"
      :class="{ fade: opened }"
      style="gap: 5px"
    >
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
  <span
    class="fixed ml-36 text-white text-xl font-medium uppercase tracking-widest transition-opacity opacity-0 z-20 select-none"
    :class="{ 'opacity-100': opened }"
    style="top: 4.875rem"
    >Menu</span
  >
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const opened = ref(false);

function onClick(e: any) {
  if (e.screenY > 510) {
    opened.value = false;
  }
}

function onScroll() {
  opened.value = false;
}

onMounted(() => {
  window.addEventListener("click", onClick);
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("click", onClick);
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.nav-bar {
  transform: translateY(-100%);
  transition: transform 200ms ease-in-out;
}

.nav-bar.opened {
  transform: translateY(0);
}

.dot {
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
  background-color: #000;
}

.fade {
  opacity: 0;
}

.line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.25rem;
  height: 0.18rem;
  border-radius: 0.125rem;
  background-color: #fff;
  z-index: -1;
  transform: translate(-50%, -50%) rotate(45deg);
  transform-origin: center;
  transition: width 200ms, background-color 200ms;
}

.line-2 {
  transform: translate(-50%, -50%) rotate(135deg);
}

.line.opened {
  width: 1.7rem;
}
</style>
