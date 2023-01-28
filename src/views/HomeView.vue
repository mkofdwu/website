<script setup lang="ts">
import HomeSingle from "@/views/HomeSingle.vue";
import { onMounted, onUnmounted } from "vue";

const homeSingleHeight = window.innerWidth * 0.75 + window.innerHeight * 0.8;

function onScroll() {
  const atTop = window.scrollY <= 80;
  const atBottom =
    window.innerHeight + window.scrollY + 80 >= document.body.offsetHeight;
  if (atTop) {
    window.scrollTo(0, homeSingleHeight + window.scrollY);
  } else if (atBottom) {
    window.scrollTo(0, window.scrollY - homeSingleHeight);
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <transition name="fade" appear>
    <div>
      <home-single />
      <home-single />
    </div>
  </transition>
</template>
