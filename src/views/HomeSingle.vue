<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col">
    <main class="flex justify-center py-20" style="height: 70vh">
      <div class="w-96 flex flex-col items-end justify-center mr-24">
        <h1 class="text-7.5xl font-bold mb-5">Jia Jie</h1>
        <p class="text-xl text-right">
          NUS High student studying Computer Science and Cybersecurity
        </p>
      </div>
      <div class="w-px bg-black opacity-10 mr-20"></div>
      <div class="w-96 flex flex-col items-start justify-center gap-6">
        <router-link
          v-for="[link, text] in [
            ['/about', 'about'],
            ['/projects', 'projects'],
            ['/writeups', 'ctf writeups'],
            ['/contact', 'contact']
          ]"
          :to="link"
          class="text-2xl font-medium tracking-wide hover:text-primary hover:tracking-wider transition-all"
        >
          {{ text }}
        </router-link>
      </div>
    </main>
    <img
      src="@/assets/images/me.jpg"
      class="img-fade-in saturate-50 mx-6 rounded-4xl"
      onload="this.style.opacity = 1"
    />
  </div>
</template>
