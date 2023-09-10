<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';
import namedCodeBlocks from 'markdown-it-named-code-blocks';
import hljs from 'highlight.js';
import frogWaf from '@/assets/writeups/frog-waf.md?raw';
import theOtherObligatoryPyjail from '@/assets/writeups/the-other-obligatory-pyjail.md?raw';
import type { ChalInfo } from '@/types/ChalInfo';
import ChalInfoCard from '@/components/ChalInfoCard.vue';
import { nextTick, onMounted } from 'vue';

const chals: { [slug: string]: ChalInfo } = {
  'frog-waf': {
    title: 'Frog WAF',
    subtitle: 'Author: irogir',
    description:
      'FrogCorp™ has recently developed a cutting-edge web application designed to thoroughly test their brand new security feature (Frog-WAF). Can you beat their innovative protection?',
    cat: 'web',
    numSolves: 29,
    numPoints: 413,
    attachments: [{ name: 'dist.zip', url: '' }],
    sourceUrl: ''
  },
  'the-other-obligatory-pyjail': {
    title: 'the other obligatory pyjail',
    subtitle: 'Author: quasar',
    description:
      'nowadays, setattr jails seem to be all the hype, and everyone loves builtins, so enjoy a setattr jail with builtins :>',
    cat: 'misc',
    numSolves: 6,
    numPoints: 400,
    attachments: [
      {
        name: 'jail.py',
        url: 'http://34.27.167.72/dl/?misc/the%20other%20obligatory%20pyjail/jail.py'
      }
    ],
    sourceUrl: ''
  }
};

const writeups: { [slug: string]: string } = {
  'frog-waf': frogWaf,
  'the-other-obligatory-pyjail': theOtherObligatoryPyjail
};

const { slug } = useRoute().params;
if (typeof slug !== 'string' || !(slug in chals)) {
  useRouter().push('/writeups/frog-waf');
}

const chalInfo = chals[slug as string];

const md = new MarkdownIt().use(namedCodeBlocks);
let content = md.render(writeups[slug as string]);

nextTick(() => {
  console.log('nextTick');
  hljs.highlightAll();
});
</script>

<template>
  <div class="writeup flex flex-col px-20 py-20">
    <chal-info-card :info="chalInfo" class="mb-12" />
    <div class="h-px bg-black bg-opacity-10 mb-12"></div>
    <span class="text-sm opacity-40 mb-4">Posted 9 Sep 2023</span>
    <div id="article" class="flex flex-col gap-y-3" v-html="content"></div>
  </div>
</template>

<style scoped>
#article :deep(pre) {
  overflow: auto;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

#article :deep(pre > code) {
  padding: 4rem 1.75rem 1.75rem 1.75rem;
  border-radius: 1.25rem;
}

#article :deep(.named-fence-block) {
  position: relative;
}

#article :deep(.named-fence-filename) {
  position: absolute;
  top: 1.25rem;
  left: 1.75rem;
  color: white;
  font-weight: bold;
}

#article :deep(h1) {
  font-size: 1.125rem;
  font-weight: bold;
  margin-top: 0.25rem;
}
</style>
