<template>
  <transition name="fade" appear>
    <div ref="root" class="flex flex-col">
      <div class="h-screen relative">
        <h1
          class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-humongous font-bold transition-opacity pointer-events-none"
          :style="`opacity: ${largeTextOpacity}`"
        >
          about
        </h1>
        <img
          src="@/assets/images/table_stack.png"
          alt=""
          class="absolute left-1/2 top-1/10 h-9/10"
          :style="`transform: translate(-50%, ${imgOffset}px); opacity: ${imgOpacity}`"
        />
        <div
          class="absolute left-1/2 bottom-20 -translate-x-1/2 px-10 h-16 bg-almost-black rounded-full text-white text-2xl font-medium select-none cursor-pointer grid place-items-center"
          :style="`opacity: ${textOpacity}`"
          @click="scrollDown"
        >
          Scroll to continue
        </div>
      </div>
      <div
        class="self-center w-1/2 h-screen transition-opacity duration-300 text-4xl text-center font-bold grid place-items-center"
        :style="`opacity: ${x > 0.7 ? 1 : 0}`"
      >
        <p>
          I am a Year 6 student from NUS High who enjoys
          <span class="text-primary">software engineering</span> and playing
          <span class="text-primary">CTFs</span>. I also like to do
          <span class="text-primary">UI design</span>.
        </p>
      </div>
      <div class="grid"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const root = ref<HTMLDivElement | null>(null);
let x = ref(0); // scroll progress (1 viewport height)
let imgOffset = ref(0);
const imgOpacity = computed(() => {
  return x.value > 0.3 ? 0 : 1 - (1 / 0.3) * x.value;
});
const textOpacity = computed(() => {
  return x.value > 0.5 ? 0 : 1 - (1 / 0.5) * x.value;
});
const largeTextOpacity = computed(() => {
  return x.value > 0.5 ? 0.03 : (0.03 - 0.06) * 2 * x.value + 0.06;
});

onMounted(() => {
  const scrollDiv = root.value!.parentElement as HTMLDivElement;
  scrollDiv.scrollTo(0, 0);
  scrollDiv.addEventListener('scroll', () => {
    x.value = scrollDiv.scrollTop / window.innerHeight;
    imgOffset.value = scrollDiv.scrollTop / 2;
  });
});

function scrollDown() {
  const scrollDiv = root.value!.parentElement as HTMLDivElement;
  scrollDiv.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
}
</script>

<style scoped>
h2 {
  color: black;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
</style>
