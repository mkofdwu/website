<template>
  <div class="h-screen relative">
    <div class="flex flex-col items-center">
      <div class="relative w-1/2 rounded-2.5xl overflow-clip mt-16 mb-12">
        <div
          class="flex items-center transition-transform duration-500 cursor-zoom-in"
          :style="`transform: translateX(-${carouselIndex}00%)`"
        >
          <img
            v-for="image in project.images"
            :key="image"
            :src="image"
            class="w-50s h-1/2 object-cover"
            onclick="window.open(this.src, '_blank')"
          />
        </div>
        <button
          v-if="carouselIndex > 0"
          class="material-symbols-outlined w-8 h-8 rounded-full bg-white border grid place-items-center absolute left-5 top-1/2 -translate-y-1/2 transition-transform hover:scale-110"
          @click="carouselIndex--"
        >
          chevron_left
        </button>
        <button
          v-if="carouselIndex < project.images.length - 1"
          class="material-symbols-outlined w-8 h-8 rounded-full bg-white border grid place-items-center absolute right-5 top-1/2 -translate-y-1/2 transition-transform hover:scale-110"
          @click="carouselIndex++"
        >
          chevron_right
        </button>
        <div
          v-if="project.images.length > 1"
          class="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent opacity-10 pointer-events-none"
        ></div>
        <div
          v-if="project.images.length > 1"
          class="flex gap-x-4 absolute left-1/2 -translate-x-1/2 bottom-5"
        >
          <div
            v-for="i in project.images.length"
            :key="i"
            class="w-2 h-2 rounded-full bg-white transition-opacity cursor-pointer"
            :style="`opacity: ${carouselIndex === i - 1 ? 1 : 0.4}`"
            @click="carouselIndex = i - 1"
          ></div>
        </div>
      </div>
      <div class="w-1/2 px-10 flex flex-col items-start mb-14">
        <span class="text-lg font-medium opacity-40 tracking-wide mb-1">
          {{ project.tags }}
        </span>
        <h3 class="text-[1.75rem] font-bold mb-5">{{ project.title }}</h3>
        <p class="text-lg mb-8">{{ project.description }}</p>
        <div class="flex gap-x-3">
          <a
            v-if="project.siteUrl"
            :href="project.siteUrl"
            target="_blank"
            class="h-12 px-6 border-3 border-black rounded-full flex items-center text-xl font-medium hover:border-primary hover:text-primary active:bg-primary active:text-white transition-all"
          >
            Visit site
          </a>
          <a
            :href="project.githubUrl"
            target="_blank"
            class="h-12 pl-5 pr-6 bg-almost-black rounded-full flex items-center hover:bg-primary transition-all"
          >
            <img src="@/assets/images/mdi_github.svg" alt="" class="w-6 h-6 mr-3" />
            <span class="text-white text-xl font-medium">View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
    <router-link
      to="/projects"
      class="fixed left-10 bottom-10 h-12 pl-3 pr-6 bg-[#eee] rounded-full flex items-center text-lg font-medium tracking-wider hover:bg-[#e0e0e0] transition-all"
    >
      <span class="material-symbols-outlined mr-3">chevron_left</span>
      back to projects
    </router-link>
    <!-- <div class="fixed top-24 right-24 flex flex-col items-end gap-y-3">
      <router-link
        v-for="project in projects"
        :key="project.id"
        :to="`/project/${project.id}`"
        :disabled="project.id === thisId"
        class="transition-opacity hover:opacity-100"
        :class="project.id === thisId ? 'opacity-100' : 'opacity-40'"
        >{{ project.title }}</router-link
      >
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { projects } from '@/data/projects';

const route = useRoute();
const thisId = parseInt(route.params.id as string);
const project = projects[thisId];

const carouselIndex = ref(0);
</script>
