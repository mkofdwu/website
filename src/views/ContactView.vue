<script setup lang="ts">
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
        <a class="group flex flex-col items-center cursor-pointer" href="mailto:mkofdwu@gmail.com">
          <div
            class="w-20 h-20 rounded-full bg-almost-black group-hover:bg-primary grid place-items-center mt-11 mb-4 transition-colors"
          >
            <i class="material-symbols-outlined text-white text-3xl">mail</i>
          </div>
          <span class="text-xl font-bold tracking-wide">email</span>
        </a>
        <a
          class="group flex flex-col items-center cursor-pointer"
          href="https://linkedin.com/in/lee-jia-jie"
          target="_blank"
        >
          <div
            class="w-20 h-20 rounded-full bg-almost-black group-hover:bg-primary grid place-items-center mt-11 mb-4 transition-colors"
          >
            <linked-in-icon />
          </div>
          <span class="text-xl font-bold tracking-wide">linkedin</span>
        </a>
        <a
          class="group flex flex-col items-center cursor-pointer"
          href="https://github.com/mkofdwu"
          target="_blank"
        >
          <div
            class="w-20 h-20 rounded-full bg-almost-black group-hover:bg-primary grid place-items-center mt-11 mb-4 transition-colors"
          >
            <github-icon />
          </div>
          <span class="text-xl font-bold tracking-wide">github</span>
        </a>
      </div>
    </div>
  </transition>
</template>
