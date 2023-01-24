<template>
  <nav-button />
  <div class="flex flex-col">
    <div class="h-screen relative">
      <h1
        class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-humongous font-bold transition-opacity select-none"
        :style="`opacity: ${largeTextOpacity}`">
        about
      </h1>
      <img src="@/assets/images/table_stack.png" alt="" class="absolute left-1/2 top-1/10 h-9/10"
        :style="`transform: translate(-50%, ${imgOffset}px); opacity: ${imgOpacity}`" />
      <h2 class="absolute left-1/2 top-3/4 -translate-x-1/2 text-white text-5xl font-medium select-none cursor-pointer"
        :style="`opacity: ${textOpacity}`">
        Scroll to continue
      </h2>
    </div>
    <div class="self-center w-1/2 h-screen transition-opacity flex flex-col items-start justify-center gap-y-6"
      :style="`opacity: ${x > 0.7 ? 1 : 0}`">
      <h3 class="text-2xl font-medium">I'm a Year 6 student in NUS High</h3>
      <p>
        I started programming in 2018, learning python from youtube tutorials
        and creating my own text-based programs and games. I was immediately
        captivated by the versatility of the language and what I could build
        with it. Over the years, I've learned fullstack web development, gained
        skills in machine learning and built apps with flutter.
      </p>
      <p>
        Today, I am still looking to deepen my knowledge and explore new
        technologies. I've recently delved into functional programming and have
        gotten into CTFs.
      </p>
      <p>Continue scrolling</p>
    </div>
    <div class="h-screen transition-opacity flex items-center justify-center mx-96"
      :style="`opacity: ${x > 1.7 ? 1 : 0}`">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
        suscipit repellat, mollitia, recusandae labore facilis in sunt cumque
        autem praesentium vel perspiciatis, voluptatem laborum. Dolor magnam
        harum, minima in, delectus tenetur nam quo soluta necessitatibus numquam
        ullam explicabo, debitis illo reiciendis unde officiis fuga sunt ea
        ipsam maiores placeat omnis vitae. A ipsam fuga cupiditate, laborum
        ratione qui quisquam fugiat laboriosam deleniti minus ab similique
        beatae, id sapiente, vitae aliquid ad voluptate voluptatum minima autem
        libero culpa. Maxime autem labore nemo! Consequatur optio id similique
        ullam commodi ex dolorum consequuntur, dolorem qui error recusandae odio
        quisquam? Nostrum velit consectetur ullam!
      </p>
    </div>
  </div>
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
