<template>
  <div class="flex flex-col">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="w-full h-64 rounded-2xl mb-6 object-cover shadow-lg"
    />
    <div
      v-else
      class="w-full h-64 rounded-2xl mb-6 bg-almost-black-lighter grid place-items-center"
    >
      <MaterialIcon name="question_mark" class="text-7xl text-white" />
    </div>
    <div class="mx-2 flex items-center justify-between">
      <div class="flex flex-col items-start">
        <span class="mx-2 text-sm font-bold opacity-40 uppercase tracking-wider">
          {{ award }}
        </span>
        <h3 class="mx-2 text-xl font-medium">{{ title }}</h3>
      </div>
      <MaterialIcon v-if="isFirst" name="trophy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MaterialIcon from './MaterialIcon.vue';

defineProps({
  imageUrl: String,
  title: String,
  award: String,
  isFirst: Boolean
});
</script>
