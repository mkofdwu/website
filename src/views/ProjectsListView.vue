<template>
  <div>
    <nav-button />
    <h1
      class="fixed w-screen flex items-center justify-center text-humongous font-bold transition-opacity -z-10 select-none"
      :style="`height: 90vh; opacity: ${largeTextOpacity}`">
      projects
    </h1>
    <div style="height: 90vh"></div>
    <div class="grid gap-x-12 gap-y-14 mx-52 mb-32" style="grid-template-columns: repeat(auto-fit, minmax(360px, 1fr))">
      <project-tile v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import NavButton from "@/components/NavButton.vue";
import ProjectTile from "@/components/ProjectTile.vue";
import { projects } from "@/data/projects";

const largeTextOpacity = ref(0.06);

onMounted(() => {
  window.addEventListener("scroll", () => {
    const x = window.scrollY / window.innerHeight;
    largeTextOpacity.value = x > 0.7 ? 0 : -0.06 * (1 / 0.7) * x + 0.06;
  });
});
</script>
