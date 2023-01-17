<template>
  <div>
    <div class="flex items-center pl-32 py-24">
      <div class="material-symbols-outlined mr-10">apps</div>
      <h1 class="text-2xl font-medium uppercase tracking-wider">Projects</h1>
    </div>
    <div class="grid gap-x-12 gap-y-14 mx-32" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))">
      <project-tile :project="projects[0]" />
      <project-tile :project="projects[0]" />
      <project-tile :project="projects[0]" />
      <project-tile :project="projects[0]" />
      <project-tile :project="projects[0]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectTile from "@/components/ProjectTile.vue";
import type { Project } from "@/types/Project";
import { projects } from "@/data/projects";
</script>

<style scoped>

</style>
