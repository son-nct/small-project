<script lang="ts" setup>
import { useAsyncData, useLazyAsyncData, useNuxtApp } from "#app";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useValidatorStore } from "~/stores/validators.store";
import { Loader2 } from "lucide-vue-next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Reactively update address based on the route parameter

const route = useRoute();
const address = ref("");
const validatorStore = useValidatorStore();
const message = ref<string>("");

watchEffect(() => {
  address.value =
    typeof route.params.address === "string" ? route.params.address : "";
});

if (validatorStore.allValidators.length === 0) {
  const { data: allValidators } = await useAsyncData("all-validators", () =>
    validatorStore.fetchValidatorList()
  );
}

const { data: validator } = await useAsyncData(`validators-detail`, () =>
  validatorStore.fetchValidatorDetail(address.value)
);

const { data: blocks, pending } = await useLazyAsyncData(
  `validators-blocks`,
  () => validatorStore.fetchBlocksByAddress(address.value)
);

const formatString = (input: string): string => {
  const trimmedInput = input.trim();
  const words = trimmedInput.split("_");

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  } else if (words.length === 2) {
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return trimmedInput;
};

let fetchInterval = null;
let keyTransition = ref(1);

onMounted(() => {
  fetchInterval = setInterval(async () => {
    const newBlocks = await validatorStore.fetchLatestSignatures(address.value);
    if (newBlocks && newBlocks.length > 0) {
      if (blocks.value.length >= 100) {
        blocks.value.splice(-100, 100);
      }
      blocks.value.unshift(...newBlocks);
      keyTransition.value += 1;
    }
  }, 5000);
});

onUnmounted(() => {
  clearInterval(fetchInterval);
});
</script>

<template lang="pug">
main
    article
        section.bg-dark
            .container(class='z-10 p-8 mx-auto lg:p-10')
                .flex.flex-col.pl-6.w-full.mb-10.items-end
                  h3.text-primary.text-lg shielded-expedition.88f17d1d14
                  p.text-neutralPink https://namada-rpc.validatorvn.com
                .element-section
                    div(class='relative flex flex-col w-full gap-4 h-fit lg:gap-10')
                        h2.uppercase.font-ultraBold.text-white.text-center(class='mb-20 text-5xl lg:text-6xl') Validator Details
                    div(class='grid grid-col-1 lg:grid-cols-3 lg:mt-0 lg:px-10').gap-10
                        .flex.flex-col.gap-4.items-center.justify-center.border-b.pb-4.break-words(v-for='(value, key) in validator')
                            h5.font-ultraBold.text-primary.text-center {{ formatString(key) }}
                            p.text-center.text-lightGray.text-base.tracking-tight.break-words {{ value }}
                .element-section(v-if='validator')
                    div(class='relative flex flex-col w-full gap-4 h-fit lg:gap-10')
                            h2.uppercase.font-ultraBold.text-white.text-center(class='mb-10 text-5xl lg:text-6xl') 100 Blocks
                            ClientOnly
                              div(class='flex flex-wrap items-center justify-start w-full gap-2 p-8 border border-neutral')
                                  div.w-full.h-full.flex.items-center.justify-center(v-if='pending')
                                    Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
                                  TransitionGroup(name='block-list' tag='div' class='flex flex-wrap items-center justify-start w-full gap-2 p-8' v-else)
                                    div.flex.items-center.flex-wrap.gap-2(:key='keyTransition')
                                      TooltipProvider(v-for='(block,index) in blocks' :key="`block-${block.block_number}-${index}`")
                                          Tooltip
                                              TooltipTrigger
                                                  div(:class="block.sign_status ? 'bg-primary' : 'bg-red-500'").w-4.h-4.rounded-xs
                                              TooltipContent.bg-dark.border-neutral.shadow-md
                                                  .flex.flex-col
                                                      .flex.flex-col
                                                          h5.text-primary Height:
                                                          p.text-white {{ block.block_number }}
                                                      .flex.flex-col
                                                          h5.text-primary Signed:
                                                          p(:class="block.sign_status ? 'text-white' : 'text-red-500'") {{ block.sign_status }}
                                  div.w-full.h-full.flex.items-center.justify-center.mt-4.gap-4
                                    div(class='flex flex-col items-center gap-2 lg:flex-row')
                                      .w-4.h-4.rounded-xs.bg-primary
                                      p.text-white Signed Block
                                    div(class='flex flex-col items-center gap-2 lg:flex-row')
                                      .w-4.h-4.rounded-xs.bg-red-500
                                      p.text-white Missed Block
                .container(v-if='!validator')
                  h5.text-primary.text-center.text-3xl No Data Found

</template>

<style lang="scss" scoped>
.block-list-move,
.block-list-enter-active,
.block-list-leave-active {
  transition: all 0.5s ease;
}

.block-list-enter-from,
.block-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.block-list-leave-active {
  position: absolute;
}
</style>
