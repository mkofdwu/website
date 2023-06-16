<script setup lang="ts">
import MaterialIcon from '@/components/MaterialIcon.vue';
import LinkedInIcon from '@/components/icons/LinkedInIcon.vue';
import GithubIcon from '@/components/icons/GithubIcon.vue';
</script>

<template>
  <transition name="fade" appear>
    <div>
      <h1
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-humongous font-bold opacity-5 select-none"
      >
        contact
      </h1>
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-x-16"
      >
        <div class="group flex flex-col items-center cursor-pointer">
          <div
            class="w-20 h-20 rounded-full bg-almost-black group-hover:bg-primary grid place-items-center mt-11 mb-4 transition-colors"
          >
            <material-icon name="mail" class="text-white text-3xl" />
          </div>
          <span class="text-xl font-bold tracking-wide">email</span>
        </div>
        <div class="group flex flex-col items-center cursor-pointer">
          <div
            class="w-20 h-20 rounded-full bg-almost-black group-hover:bg-primary grid place-items-center mt-11 mb-4 transition-colors"
          >
            <linked-in-icon />
          </div>
          <span class="text-xl font-bold tracking-wide">linkedin</span>
        </div>
        <div class="group flex flex-col items-center cursor-pointer">
          <div
            class="w-20 h-20 rounded-full bg-almost-black group-hover:bg-primary grid place-items-center mt-11 mb-4 transition-colors"
          >
            <github-icon />
          </div>
          <span class="text-xl font-bold tracking-wide">github</span>
        </div>
      </div>
    </div>
  </transition>
</template>
