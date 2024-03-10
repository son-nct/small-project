<script lang="ts" setup>
import { useAsyncData } from "#app";
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Loader2 } from "lucide-vue-next";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { useBlocksStore } from "~/stores/blocks.store";
import { useUtils } from "#imports";

interface BlockDetailType {
  hash: string;
  height: string;
  txs: number;
  proposer: string;
  time: string | null | undefined;
}

const route = useRoute();
const height = ref("");
const blockStore = useBlocksStore();
const blockDetail = ref<BlockDetailType | null>(null);
const dateTime = ref("");
const { formatDateTime } = useUtils();

const navigateToTransactionDetail = (hash: string) => {
  if (!hash) return {};
  return {
    name: "transactions-hash",
    params: { hash },
  };
};


watchEffect(() => {
  height.value =
    typeof route.params.height === "string" ? route.params.height : "";
});

const header = ["No", "Transaction Type", "Hash Id"];

const { data: block } = await useAsyncData(`block-height`, () =>
  blockStore.fetchBlockDetailByHeight(height.value)
);

if (block.value) {
  console.log("block.value", block.value);
  blockDetail.value = blockStore.normalizeBlockData(block.value);
  dateTime.value = formatDateTime(block.value.header.time);
  console.log("dateTime: ", dateTime.value);
}

const isExistHashData = computed(
  () => block.value && block.value.tx_hashes.length > 0
);

const navigateToValidatorDetail = (address: string) => {
  if (!address) return {};
  return {
    name: "validators-address",
    params: { address },
  };
};

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
</script>

<template lang="pug">
main
    article
        section.bg-dark
            .container(class='z-10 p-8 mx-auto lg:p-10')
                div(class='items-start lg:items-end').flex.flex-col.pl-6.w-full.mb-10
                  h3(class='text-base lg:text-lg').text-primary shielded-expedition.88f17d1d14
                  p.text-neutralPink https://namada-rpc.validatorvn.com
                .element-section
                    div(class='relative flex flex-col w-full gap-4 h-fit lg:gap-10')
                        h2.uppercase.font-ultraBold.text-white.text-center(class='mb-20 text-5xl lg:text-6xl')
                          | Block 
                          span(v-if='height').text-primary {{ `#${height}`}}
                    div(class='grid w-full grid-col-1 lg:grid-cols-2 lg:mt-0 lg:px-10').gap-10
                      .w-full.flex.flex-col.gap-4.items-center.justify-center.border-b.pb-4.break-words.overflow-x-auto(v-for='(value, key) in blockDetail')
                          template(v-if='key === "time"')
                            h5.font-ultraBold.text-primary.text-center.text-3xl {{ formatString(key) }}
                            p(class='overflow-x-auto text-base lg:text-lg whitespace-nowrap').text-center.text-neutralPink.tracking-tight.break-words {{ `${value} ( ${dateTime })` }}
                          template(v-else-if='key === "proposer"')
                            h5.font-ultraBold.text-primary.text-center.text-3xl {{ formatString(key) }}
                            NuxtLink(:to='navigateToValidatorDetail(value)' class='text-base lg:text-lg').text-center.text-primary.tracking-tight.break-words {{ value }}
                          template(v-else)
                            h5.font-ultraBold.text-primary.text-center.text-3xl {{ formatString(key) }}
                            p(class='overflow-x-auto text-base lg:text-lg whitespace-nowrap').text-center.text-neutralPink.tracking-tight.break-words {{ value }}
                .element-section(v-if='block')
                    div(class='relative flex flex-col w-full gap-4 h-fit lg:gap-10')
                      h2.uppercase.font-ultraBold.text-white.text-center(class='mb-10 text-3xl md:text-5xl lg:text-6xl') Transactions
                      div(class='w-full lg:container lg:mx-auto')
                      div.w-full.h-full.flex.items-center.justify-center
                          //- Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
                          div(class='flex items-center justify-center w-full lg:px-10' v-if='isExistHashData')
                            Table.mt-3
                              //TableCaption.text-white.text-lg {{ paginationData.start }} - {{ paginationData.end }} of 50
                              TableHeader
                                TableRow
                                  TableHead(v-for='text in header' class='w-[100px] text-primary font-semibold')
                                    | {{ text }}
                              TableBody
                                TableRow(v-for='(block,index) in block.tx_hashes' :key='block.hash_id' class='cursor-pointer')
                                  TableCell.text-white {{ index + 1 }}
                                  TableCell.text-white  {{ block.tx_type }}
                                  TableCell.font-semibold.text-primary 
                                    NuxtLink(:to='navigateToTransactionDetail(block.hash_id)') {{ block.hash_id }}
                            
                    
                .container(v-if='!block')
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
