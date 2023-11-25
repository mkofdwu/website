<script setup lang="ts">
import CTFAwardTile from '@/components/CTFAwardTile.vue';
</script>

<template>
  <div class="mx-32 my-20">
    <h1 class="text-3xl font-bold mb-7">CTFs</h1>
    <p class="mb-20">
      From 2018-2021, I mainly did web and mobile app development. But around the 4th quarter of
      2022 I shifted my focus to cybersecurity and started playing a lot of CTFs. Currently, I
      mainly do challenges in the web and pwn categories.
    </p>
    <h1 class="text-3xl font-bold mb-8">Awards</h1>
    <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))">
      <CTFAwardTile imageUrl="/cddc.jpg" title="CDDC 2023" award="1st place" is-first />
      <CTFAwardTile imageUrl="/aycep.jpg" title="AYCEP 2023" award="1st place" is-first />
      <CTFAwardTile imageUrl="/cyberthon.jpg" title="Cyberthon 2023" award="3rd place" />
      <CTFAwardTile
        imageUrl="https://instagram.fsin4-1.fna.fbcdn.net/v/t39.30808-6/391630768_296639796467663_9052451824086746302_n.jpg?stp=dst-jpg_e15&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEwODAuc2RyIn0&_nc_ht=instagram.fsin4-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=S_wdILUjSXMAX9BZTFT&edm=ACWDqb8AAAAA&ccb=7-5&ig_cache_key=MzIxNzU0OTAyNTA0NTQ4ODE3MQ%3D%3D.2-ccb7-5&oh=00_AfDbUWCFMhciozl9kAyKgl54D3UhETqyEIAl-2dXzAo0tQ&oe=65670BEB&_nc_sid=ee9879"
        title="TISC 2023"
        award="15th place | 8/10 levels"
      />
      <CTFAwardTile imageUrl="" title="Whitehacks 2023" award="6th place" />
    </div>
  </div>
</template>
