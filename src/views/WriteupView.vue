<script setup lang="ts">
import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';
import namedCodeBlocks from 'markdown-it-named-code-blocks';
import hljs from 'highlight.js';
import theOtherObligatoryPyjail from '@/assets/writeups/the-other-obligatory-pyjail.md?raw';
import diskArchaeology from '@/assets/writeups/tisc23/disk-archaeology.md?raw';
import recklessMistake from '@/assets/writeups/tisc23/reckless-mistake.md?raw';
import kpa from '@/assets/writeups/tisc23/kpa.md?raw';
import rubg from '@/assets/writeups/tisc23/rubg.md?raw';
import palindromesInvitation from '@/assets/writeups/tisc23/palindromes-invitation.md?raw';
import theChosenOnes from '@/assets/writeups/tisc23/the-chosen-ones.md?raw';
import devSecMeow from '@/assets/writeups/tisc23/devsecmeow.md?raw';
import blindSqlInjection from '@/assets/writeups/tisc23/blind-sql-injection.md?raw';
import ChalInfoCard from '@/components/ChalInfoCard.vue';
import { chals } from '@/data/writeups';

const writeups: { [slug: string]: string } = {
  'the-other-obligatory-pyjail': theOtherObligatoryPyjail,
  'disk-archaeology': diskArchaeology,
  'reckless-mistake': recklessMistake,
  kpa: kpa,
  rubg: rubg,
  'palindromes-invitation': palindromesInvitation,
  'the-chosen-ones': theChosenOnes,
  devsecmeow: devSecMeow,
  'blind-sql-injection': blindSqlInjection
};

const { slug } = useRoute().params;
if (typeof slug !== 'string' || !(slug in chals)) {
  useRouter().push('/writeups/disk-archaeology');
}

const chalInfo = chals[slug as string];

const md = new MarkdownIt().use(namedCodeBlocks);
let content = md.render(writeups[slug as string]);

nextTick(() => {
  hljs.highlightAll();
});
</script>

<template>
  <div class="flex flex-col items-center py-20">
    <div class="w-2/3">
      <chal-info-card :info="chalInfo" class="mb-12" />
      <div class="text-sm opacity-40 mx-10 mb-4">Posted 9 Sep 2023</div>
      <div id="article" class="mx-10 flex flex-col gap-y-2" v-html="content"></div>
    </div>
  </div>
</template>

<style scoped>
#article :deep(pre) {
  overflow: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

#article :deep(pre > code) {
  padding: 1.75rem;
  border-radius: 1.25rem;
}

#article :deep(pre.named-fence-block > code) {
  padding-top: 4rem;
}

#article :deep(code) {
  font-size: 0.875rem;
}

#article :deep(.named-fence-block) {
  position: relative;
}

#article :deep(.named-fence-filename) {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  padding: 4px 8px 4px 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

#article :deep(h1) {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 1rem;
}

#article :deep(img) {
  /* width: 100%; */
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

#article :deep(a) {
  color: #478c3c;
  text-decoration: underline;
}
</style>
