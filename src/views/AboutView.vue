<template>
  <transition name="fade" appear>
    <div>
      <nav-button />
      <div class="flex flex-col">
        <div class="h-screen relative">
          <h1
            class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-humongous font-bold transition-opacity select-none"
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
          <h2
            class="absolute left-1/2 top-3/4 -translate-x-1/2 text-white text-5xl font-medium select-none cursor-pointer"
            :style="`opacity: ${textOpacity}`"
          >
            Scroll to continue
          </h2>
        </div>
        <div
          class="self-center w-1/2 h-screen transition-opacity flex flex-col items-start justify-center gap-y-6"
          :style="`opacity: ${x > 0.7 ? 1 : 0}`"
        >
          <h3 class="text-2xl font-medium">I'm a Year 6 student in NUS High</h3>
          <p>
            I started programming in 2018, learning python from youtube
            tutorials and creating my own text-based programs and games. Over
            the years, I've learned fullstack web development, gained skills in
            machine learning and built apps with flutter, and many more. I’ve
            recently delved into functional programming and have gotten into
            CTFs.
          </p>
          <p>Continue scrolling:</p>
        </div>
        <div
          class="h-screen transition-opacity flex flex-col items-start justify-center mx-auto"
          :style="`opacity: ${x > 1.7 ? 1 : 0}`"
        >
          <h3 class="text-2xl font-medium mb-16">
            Typing speed <span class="opacity-40">100 WPM</span>
          </h3>
          <div class="flex items-start mb-16">
            <div class="flex flex-col mr-24">
              <h3 class="text-2xl font-medium">Expertise</h3>
              <div class="flex">
                <ul class="">
                  <li>python</li>
                  <li>typescript</li>
                  <li>vue</li>
                  <li>express</li>
                </ul>
                <ul>
                  <li>flutter</li>
                  <li>firebase</li>
                  <li>postgres</li>
                  <li>ui/ux design</li>
                </ul>
              </div>
            </div>
            <div class="flex flex-col">
              <h3 class="text-2xl font-medium">Favorite tools</h3>
              <ul>
                <li>VSCode</li>
                <li>Neovim</li>
                <li>Figma</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import NavButton from "@/components/NavButton.vue";

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
  window.addEventListener("scroll", () => {
    x.value = window.scrollY / window.innerHeight;
    imgOffset.value = window.scrollY / 2;
  });
});
</script>

<style scoped>
h2 {
  color: black;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
</style>
