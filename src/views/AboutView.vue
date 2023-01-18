<template>
  <div>
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
      <div class="material-symbols-outlined fixed left-28 top-24 text-3xl">
        apps
      </div>
    </div>
    <main
      class="h-screen transition-opacity flex flex-col items-start justify-center gap-y-6 mx-52"
      :style="`opacity: ${x > 0.7 ? 1 : 0}`"
    >
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. In debitis
        dolore officiis soluta! Labore laudantium quas totam, amet similique
        deleniti accusantium error officia autem et cum odio eligendi eos maxime
        adipisci dolorem nobis possimus! Expedita tempore laborum molestiae?
        Accusamus necessitatibus officiis quam delectus ratione. Ab facilis
        expedita animi temporibus qui tempore repudiandae modi itaque doloribus
        quaerat laboriosam reiciendis quia distinctio iure voluptatibus, rem
        odit, quam voluptate beatae harum aut sint aliquid molestias. Optio quod
        nobis impedit ex ipsum minima cupiditate sed distinctio libero
        perspiciatis quia, quis, voluptate temporibus iste numquam aliquam
        repellat obcaecati architecto molestiae explicabo excepturi aliquid
        placeat! Omnis!
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis vero
        maiores odio optio odit deleniti earum illum, sunt asperiores similique
        possimus nemo impedit molestias assumenda fugit voluptas consectetur,
        modi fuga cumque? Aliquam odit non iure? Explicabo, animi molestias!
        Delectus animi eligendi iste doloremque nam iusto cupiditate quibusdam,
        ullam corrupti. Dolorum.
      </p>
      <p>This site was made with vue</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

let x: number = ref(0); // scroll progress (1 viewport height)
let imgOffset: number = ref(0);
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
