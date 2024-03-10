<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted, reactive } from "vue";
import { useAsyncData } from "#app";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-vue-next";
import { useRouter } from "vue-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useBlocksStore } from "~/stores/blocks.store";
import { useUtils } from "~/composables/useUtils";

const header = ["No", "Height", "Hash", "Txs", "Proposer", "Time"];

const searchValue = ref("");
const isLoading = ref(false);
const forceUpdate = ref(1);

const blockStore = useBlocksStore();

const updateLatestData = async (newData: any) => {
  blockStore.latestBlocks = newData.map((block: any) => ({
    ...blockStore.normalizeBlockData(block),
  }));
};

const forceUpdateUI = () => {
  forceUpdate.value += 1;
};
const setLoading = (status: boolean) => (isLoading.value = status);

const updateCurrentPage = async (type: string) => {
  let newData = [];
  if (isLoading.value) return
  switch (type) {
    case "next":
      if (blockStore.currentPage * blockStore.pageSize < blockStore.totalData) {
        setLoading(true);
        blockStore.currentPage += 1;
        newData = await blockStore.fetchLatestBlocksList();
        updateLatestData(newData);
        forceUpdateUI();
      }
      break;
    case "prev":
      if (blockStore.currentPage > 1) {
        setLoading(true);
        blockStore.currentPage -= 1;
        newData = await blockStore.fetchLatestBlocksList();
        updateLatestData(newData);
        forceUpdateUI();
      }
      break;
    default:
      break;
  }
  setLoading(false);
};

const navigateToValidatorDetail = (address: string) => {
  if (!address) return {};
  return {
    name: "validators-address",
    params: { address },
  };
};

const { data: blocks, pending } = await useAsyncData("latest-block", () =>
  blockStore.fetchLatestBlocksList()
);

await updateLatestData(blocks.value);

const hasBlocksData = computed(() => blockStore.latestBlocks.length > 0);

const navigateToBlockDetail = (height: string) => {
  if (!height) return {};
  return {
    name: "blocks-height",
    params: { height },
  };
};

const router = useRouter();

const searchByBlockHeight = () => {
  if (searchValue.value.trim().length === 0) return;
  router.push({
    name: "blocks-height",
    params: { height: searchValue.value },
  });
};

const trunCateText = (text: string) => {
  const { truncateText } = useUtils();
  const startChars = 7;
  const endCharts = 5;
  return truncateText(text, startChars, endCharts);
};

let fetchInterval = null;

onMounted(() => {
  fetchInterval = setInterval(async () => {
    if (blockStore.currentPage === 1) {
      const newData = await blockStore.fetchLatestBlocksList();
      updateLatestData(newData);
      forceUpdateUI();
    }
  }, 4000);
});

onUnmounted(() => {
  clearInterval(fetchInterval);
});
</script>

<template lang="pug">
main
  article
    section.bg-dark.relative.overflow-hidden.min-h-screen
      .container(class='z-10 p-8 mx-auto lg:p-10')
        div(class='items-start lg:items-end').flex.flex-col.pl-6.w-full.mb-10
          h3(class='text-base lg:text-lg').text-primary shielded-expedition.88f17d1d14
          a(href='https://namada-rpc.validatorvn.com' target="_blank").text-neutralPink https://namada-rpc.validatorvn.com
        div(class='relative w-full h-fit rounded-3xl')
          .flex.flex-col.items-center.justify-center.gap-10.w-full
            h2.uppercase.font-ultraBold.text-white.text-center
              | Blocks
            div(class='flex flex-col items-center w-full space-y-5 lg:space-y-0 lg:flex-row')
              div.flex.w-full.items-center.justify-center
                div(class='w-full lg:w-1/3').border.border-primary.h-14
                  input(@keyup.enter='searchByBlockHeight' type='text' v-model='searchValue' class='placeholder:text-primary' placeholder="Search by Block Height...").w-full.h-full.p-4.outline-none.border-none.bg-transparent.text-primary
                button(type='button' class='hidden w-full px-6 py-3 cursor-pointer bg-primary font-ultraBold lg:w-fit h-14 lg:block' @click='searchByBlockHeight') Search
            div(class='w-full lg:container lg:mx-auto')
              div.w-full.h-full.flex.items-center.justify-center(v-if='pending')
                Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
              div(class='flex items-center justify-center w-full lg:px-10' v-else)
                ClientOnly
                  Table.mt-3(v-if='hasBlocksData' :key='forceUpdate' class='relative')
                    div(class='z-50 bg-black/80' v-if='isLoading').absolute.w-full.h-full
                      div.w-full.h-full.flex.items-center.justify-center
                        Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
                    TableCaption.text-white.text-lg {{ ((blockStore.currentPage - 1 ) * blockStore.pageSize) + 1 }} - {{ blockStore.currentPage * blockStore.pageSize }} of {{ blockStore.totalData }}
                    TableHeader
                      TableRow
                        TableHead(v-for='text in header' class='w-[100px] text-primary font-semibold')
                          | {{ text }}
                    TableBody
                      TableRow(v-for='(block,index) in blockStore.latestBlocks' :key='block.hash' class='cursor-pointer')
                        TableCell.text-white {{ (blockStore.currentPage * blockStore.pageSize) + index + 1 - blockStore.pageSize }}
                        //- TableCell.text-white {{ ((blockStore.currentPage - 1) * blockStore.pageSize) + (index + 1) }}
                        TableCell.font-semibold.text-primary
                          NuxtLink(:to='navigateToBlockDetail(block.height)') {{ block.height }}
                        TableCell.text-white {{ trunCateText(block.hash) }}
                        TableCell.text-white {{ block.txs }}
                        TableCell.font-semibold.text-primary
                          NuxtLink(:to='navigateToValidatorDetail(block.proposer)') {{ block.proposer }}
                        TableCell.text-white {{ block.time }}
            div.flex.items-center.justify-center.gap-4.w-full(v-if='hasBlocksData')
              Button(class='hover:bg-primary group border-primary' @click='updateCurrentPage("prev")').bg-transparent(variant='outline' size='icon')
                ChevronLeft(class='group-hover:text-black').text-primary.w-5.h-5
              Button(class='hover:bg-primary group border-primary' @click='updateCurrentPage("next")').bg-transparent(variant='outline' size='icon')
                ChevronRight(class='group-hover:text-black').text-primary.w-5.h-5
            h3(v-if='!hasBlocksData').font-ultraBold.text-white.text-center.text-3xl  No Data Found         
</template>

<style lang="scss" scoped></style>
