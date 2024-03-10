<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted, reactive } from "vue";
import { useAsyncData, useLazyAsyncData } from "#app";
import { Loader2 } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

import _ from "lodash";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "vue-router";
import { useTransactionStore } from "~/stores/transactions.store";
import { useUtils } from "~/composables/useUtils";

const header = ["No", "Tx", "Height", "Type", "Shielded", "Status", "Time"];

const searchValue = ref("");
const isLoading = ref(false);
const isSearching = ref(false);
const forceUpdate = ref(1);
const latestBlockId = ref("");
const latestHeight = ref(0);
const latestTime = ref("");

const transactionStore = useTransactionStore();

const navigateToValidatorDetail = (address: string) => {
  if (!address) return {};
  return {
    name: "validators-address",
    params: { address },
  };
};

const { data: transactions, pending } = await useAsyncData(
  "latest-transactions",
  () => transactionStore.fetchLatestTransactionList()
);

const hasTransactionData = computed(
  () => transactionStore.latestTransaction.length > 0
);

const navigateToBlockDetail = (height: string) => {
  if (!height) return {};
  return {
    name: "blocks-height",
    params: { height },
  };
};

const navigateToTransactionDetail = (hash: string) => {
  if (!hash) return {};
  return {
    name: "transactions-hash",
    params: { hash },
  };
};

const router = useRouter();
const searchByTransactionHash = () => {
  if (searchValue.value.trim().length === 0) return;
  router.push({
    name: "transactions-hash",
    params: { hash: searchValue.value },
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
    await transactionStore.fetchLatestTransactionList();
    forceUpdate.value += 1;
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
          p.text-neutralPink https://namada-rpc.validatorvn.com
        div(class='relative w-full h-fit rounded-3xl')
          .flex.flex-col.items-center.justify-center.gap-10.w-full
            h2.uppercase.font-ultraBold.text-white.text-center
              | Latest 10 Transactions
            div(class='flex flex-col items-center w-full space-y-5 lg:space-y-0 lg:flex-row')
              div.flex.w-full.items-center.justify-center
                div(class='w-full lg:w-1/3').border.border-primary.h-14
                  input(type='text' v-model='searchValue' class='placeholder:text-primary' placeholder="Search by Transaction Hash...").w-full.h-full.p-4.outline-none.border-none.bg-transparent.text-primary
                button(type='button' class='hidden w-full px-6 py-3 cursor-pointer bg-primary font-ultraBold lg:w-fit h-14 lg:block' @click='searchByTransactionHash') Search
            div(class='w-full lg:container lg:mx-auto')
              div(class='flex items-center justify-center w-full lg:px-10')
                ClientOnly
                    div.w-full.h-full.flex.items-center.justify-center(v-if='pending')
                        Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
                    Table.mt-3(v-if='hasTransactionData' :key='forceUpdate')
                        //TableCaption.text-white.text-lg
                        TableHeader
                            TableRow
                                TableHead(v-for='text in header' class='w-[100px] text-primary font-semibold')
                                    | {{ text }}
                        TableBody
                            TableRow(v-for='(transaction,index) in transactionStore.latestTransaction' :key='transaction.tx' class='cursor-pointer')
                                TableCell.text-white {{ index + 1 }}
                                TableCell.font-semibold.text-primary
                                  NuxtLink(:to='navigateToTransactionDetail(transaction.tx)') {{ trunCateText(transaction.tx) }}
                                TableCell.font-semibold.text-primary
                                  NuxtLink(:to='navigateToBlockDetail(transaction.height)') {{ transaction.height }}
                                    
                                TableCell.text-white {{ transaction.type }}
                                TableCell.text-white {{ transaction.shielded }}
                                TableCell.text-white
                                    Badge(variant="outline" v-if='transaction.status === "Fail"').border-red-500.text-red-500
                                        | {{ transaction.status }}
                                    Badge(variant="outline" v-else).border-green-500.text-primary
                                        | {{ transaction.status }}
                                TableCell.text-white {{ transaction.time }}
</template>

<style lang="scss" scoped></style>
