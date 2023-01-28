<template>
  <transition name="fade" appear>
    <div>
      <nav-button />
      <h1
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-humongous font-bold opacity-5 select-none">
        contact
      </h1>
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-x-8">
        <div class="material-symbols-outlined text-6xl">mail</div>
        <span class="text-xl">Drop me an email at <br />
          <a href="mailto:h1810076@nushigh.edu.sg"
            class="border-b border-b-black hover:border-b-2 active:border-b-4">h1810076@nushigh.edu.sg</a></span>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import NavButton from "@/components/NavButton.vue";
</script>
