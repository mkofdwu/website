<template>
  <div class="fixed w-screen h-screen bg-white z-30 transition-transform duration-500 ease-in-out -translate-y-full"
    :class="{ 'translate-y-0': linkClicked }"></div>
  <div class="nav-bar fixed w-screen h-screen bg-almost-black z-10" :class="{ opened }"></div>
  <div v-if="showMenu"
    class="fixed w-screen h-screen pl-1/2 flex flex-col items-start justify-center gap-y-8 z-20 transition-opacity duration-200 opacity-0"
    :class="{ 'opacity-100': showMenuOpacity }">
    <h2
      class="w-full absolute w-full left-24 top-1/2 -translate-y-1/2 text-humongous font-bold opacity-5 tracking-wider uppercase pointer-events-none">
      Lee Jia Jie
    </h2>
    <span @click="clickLink('/')"
      class="text-white text-5xl font-bold cursor-pointer transition-opacity opacity-40 hover:opacity-100">Home</span>
    <span @click="clickLink('/about')"
      class="text-white text-5xl font-bold cursor-pointer transition-opacity opacity-40 hover:opacity-100">About</span>
    <span @click="clickLink('/projects')"
      class="text-white text-5xl font-bold cursor-pointer transition-opacity opacity-40 hover:opacity-100">Projects</span>
    <span @click="clickLink('/contact')"
      class="text-white text-5xl font-bold cursor-pointer transition-opacity opacity-40 hover:opacity-100">Contact</span>
  </div>
  <div class="fixed ml-24 mt-20 cursor-pointer w-fit z-20" @click="toggleOpen">
    <div class="line" :class="{ opened }"></div>
    <div class="line line-2" :class="{ opened }"></div>
    <div class="grid grid-cols-3 transition-opacity" :class="{ fade: opened }" style="gap: 5px">
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
    class="fixed ml-36 text-white text-lg font-medium uppercase tracking-widest transition-opacity opacity-0 z-20 select-none"
    :class="{ 'opacity-100': opened }" style="top: 4.875rem">Menu</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const showMenu = ref(false);
const showMenuOpacity = ref(false);
const opened = ref(false);
const linkClicked = ref(false);

function toggleOpen() {
  opened.value = !opened.value;
  if (opened.value) {
    showMenu.value = true;
    setTimeout(() => (showMenuOpacity.value = true), 280); // start when the black part covers most of the screen
  } else {
    showMenuOpacity.value = false;
    setTimeout(() => (showMenu.value = false), 200);
  }
}

function clickLink(path: string) {
  if (route.path === path) {
    toggleOpen();
  } else {
    linkClicked.value = true;
    setTimeout(() => router.push(path), 600);
  }
}

function onScroll() {
  if (opened.value) {
    toggleOpen();
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.nav-bar {
  transform: translateY(-100%);
  transition: transform 400ms ease-in-out;
}

.nav-bar.opened {
  transform: translateY(0);
}

h2 {
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: white;
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
