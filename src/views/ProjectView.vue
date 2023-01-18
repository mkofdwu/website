<template>
  <div class="h-screen relative">
    <div class="flex flex-col items-center">
      <img
        :src="project.images[0]"
        class="w-1/2 h-1/2 mt-16 mb-14 object-cover"
      />
      <div class="w-1/2 px-10 flex flex-col items-start mb-14">
        <span
          class="text-lg font-medium opacity-40 uppercase tracking-wider mb-2"
        >
          {{ project.tags }}
        </span>
        <h3 class="text-3xl font-bold mb-5">{{ project.title }}</h3>
        <p class="text-xl mb-10">{{ project.description }}</p>
        <div class="flex gap-x-3">
          <a
            :href="project.siteUrl"
            class="h-12 px-6 border-3 border-black flex items-center text-xl font-medium hover:opacity-60 hover:-translate-y-1 active:opacity-100 active:translate-y-0 transition-all"
          >
            Visit site
          </a>
          <a
            :href="project.githubUrl"
            class="h-12 pl-5 pr-6 bg-almost-black flex items-center hover:bg-almost-black-lighter hover:-translate-y-1 active:bg-black active:translate-y-0 transition-all"
          >
            <img
              src="@/assets/images/mdi_github.svg"
              alt=""
              class="w-6 h-6 mr-3"
            />
            <span class="text-white text-xl font-medium">View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
    <router-link
      to="/projects"
      class="fixed top-24 left-24 flex uppercase tracking-wider hover:tracking-hover active:tracking-normal active:opacity-60 transition-all"
    >
      <span class="material-symbols-outlined mr-3">chevron_left</span>
      Back to projects
    </router-link>
    <div
      class="fixed top-1/2 -translate-y-1/2 right-24 flex flex-col items-center gap-y-8"
    >
      <router-link
        v-for="project in projects"
        :key="project.id"
        :to="`/project/${project.id}`"
        :disabled="project.id === thisId"
        class="bg-almost-black rounded-full transition-all"
        :class="project.id === thisId ? 'w-3 h-3' : 'w-2 h-2 opacity-20'"
      ></router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { projects } from "@/data/projects";

const route = useRoute();
const thisId = parseInt(route.params.id as string);
const project = projects[thisId];
</script>
