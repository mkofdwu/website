<script setup lang="ts">
import HomeSingle from '@/views/HomeSingle.vue';
import { ref, onMounted } from 'vue';

const root = ref<HTMLDivElement | null>(null);

function onScroll() {
  const scrollDiv = root.value!.parentElement as HTMLDivElement;
  const homeSingleHeight = root.value!.offsetHeight / 2;

  const atTop = scrollDiv.scrollTop <= 100;
  const atBottom = window.innerHeight + scrollDiv.scrollTop + 100 >= root.value!.offsetHeight;
  if (atTop) {
    scrollDiv.scrollTo(0, homeSingleHeight + scrollDiv.scrollTop);
  } else if (atBottom) {
    scrollDiv.scrollTo(0, scrollDiv.scrollTop - homeSingleHeight);
  }
}

onMounted(() => {
  root.value!.parentElement!.addEventListener('scroll', onScroll);
});
</script>

<template>
  <transition name="fade" appear>
    <div ref="root">
      <home-single />
      <home-single />
    </div>
  </transition>
</template>
