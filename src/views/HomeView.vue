<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="flex h-5/6">
    <div class="flex-1 flex flex-col items-start justify-center pl-32 pr-48">
      <h1 class="text-9xl font-bold uppercase mb-8">Jia Jie</h1>
      <p class="text-base">
        Elementum id laoreet risus ullamcorper lectus pellentesque ultrices
        lacinia varius. Lorem morbi in in viverra mi ornare elementum eros.
        Velit amet integer nec turpis quis suspendisse ipsum laoreet. Donec
        aliquet hac duis ultrices commodo odio.
      </p>
    </div>
    <div class="flex-1 flex flex-col items-start justify-center gap-10 pl-32">
      <router-link
        to="/about"
        class="text-xl font-medium uppercase tracking-wider hover:opacity-40 transition-opacity"
      >
        About
      </router-link>
      <router-link
        to="/about"
        class="text-xl font-medium uppercase tracking-wider hover:opacity-40 transition-opacity"
      >
        Projects
      </router-link>
      <router-link
        to="/about"
        class="text-xl font-medium uppercase tracking-wider hover:opacity-40 transition-opacity"
      >
        Contact
      </router-link>
    </div>
  </main>
  <img src="@/assets/logo.svg" />
</template>
