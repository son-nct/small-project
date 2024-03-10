<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted, reactive } from 'vue'
import { useAsyncData } from '#app'
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Loader2, ChevronRight, ChevronLeft } from "lucide-vue-next";
import ShieldedHeader from "~/components/molecules/ShieldedHeader.vue";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useTransactionStore } from '~/stores/transactions.store'
import { useUtils } from '~/composables/useUtils'

const header = ['No', 'Tx', 'Height', 'Type', 'Shielded', 'Status', 'Time']

const searchValue = ref('')
const isLoading = ref(false)
const isLoadingInterval = ref(false)
const forceUpdate = ref(1)

const transactionStore = useTransactionStore()

const forceUpdateUI = () => {
  forceUpdate.value += 1;
};

const navigateToValidatorDetail = (address: string) => {
  if (!address) return {}
  return {
    name: 'validators-address',
    params: { address },
  }
}

const setLoading = (status: boolean) => (isLoading.value = status);

const updateCurrentPage = async (type: string) => {
  if (isLoading.value) return
  switch (type) {
    case "next":
      if (transactionStore.currentPage * transactionStore.pageSize < transactionStore.totalData) {
        setLoading(true);
        transactionStore.currentPage += 1;
        await transactionStore.fetchLatestTransactionList();
        forceUpdateUI();
      }
      break;
    case "prev":
      if (transactionStore.currentPage > 1) {
        setLoading(true);
        transactionStore.currentPage -= 1;
        await transactionStore.fetchLatestTransactionList();
        forceUpdateUI();
      }
      break;
    default:
      break;
  }
  setLoading(false);
};

const { data: transactions, pending } = await useAsyncData(
  'latest-transactions',
  () => transactionStore.fetchLatestTransactionList(),
)

const hasTransactionData = computed(
  () => transactionStore.latestTransaction.length > 0,
)

const navigateToBlockDetail = (height: string) => {
  if (!height) return {}
  return {
    name: 'blocks-height',
    params: { height },
  }
}

const navigateToTransactionDetail = (hash: string) => {
  if (!hash) return {}
  return {
    name: 'transactions-hash',
    params: { hash },
  }
}

const router = useRouter()
const searchByTransactionHash = () => {
  if (searchValue.value.trim().length === 0) return
  router.push({
    name: 'transactions-hash',
    params: { hash: searchValue.value },
  })
}

const trunCateText = (text: string) => {
  const { truncateText } = useUtils()
  const startChars = 7
  const endCharts = 5
  return truncateText(text, startChars, endCharts)
}

let fetchInterval = null

onMounted(() => {
  fetchInterval = setInterval(async () => {
    if (transactionStore.currentPage === 1 && !pending.value && !isLoadingInterval.value) {
      isLoadingInterval.value = true
      await transactionStore.fetchLatestTransactionList()
      forceUpdateUI()
      isLoadingInterval.value = false
    }
  }, 4000)
})

onUnmounted(() => {
  clearInterval(fetchInterval)
})
</script>

<template lang="pug">
main
  article
    section.bg-dark.relative.overflow-hidden.min-h-screen
      .container(class='z-10 p-8 mx-auto lg:p-10')
        shielded-header
        div(class='relative w-full h-fit rounded-3xl')
          .flex.flex-col.items-center.justify-center.gap-10.w-full
            h2.uppercase.font-ultraBold.text-white.text-center
              | Transactions
            div(class='flex flex-col items-center w-full space-y-5 lg:space-y-0 lg:flex-row')
              div.flex.w-full.items-center.justify-center
                div(class='w-full lg:w-1/3').border.border-primary.h-14
                  input(@keyup.enter='searchByTransactionHash' type='text' v-model='searchValue' class='placeholder:text-primary' placeholder="Search by Transaction Hash...").w-full.h-full.p-4.outline-none.border-none.bg-transparent.text-primary
                button(type='button' class='hidden w-full px-6 py-3 cursor-pointer bg-primary font-ultraBold lg:w-fit h-14 lg:block' @click='searchByTransactionHash') Search
            div(class='w-full lg:container lg:mx-auto')
              div(class='flex items-center justify-center w-full lg:px-10')
                ClientOnly
                    div.w-full.h-full.flex.items-center.justify-center(v-if='pending')
                        Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
                    Table.my-3(v-if='hasTransactionData' :key='forceUpdate')
                        div(class='z-50 bg-black/80' v-if='isLoading').absolute.w-full.h-full
                          div.w-full.h-full.flex.items-center.justify-center
                            Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
                        TableCaption.text-white.text-lg {{ ((transactionStore.currentPage - 1 ) * transactionStore.pageSize) + 1 }} - {{ transactionStore.currentPage * transactionStore.pageSize }} of {{ transactionStore.totalData }}
                        TableHeader
                            TableRow
                                TableHead(v-for='text in header' class='w-[100px] text-primary font-semibold')
                                    | {{ text }}
                        TableBody
                            TableRow(v-for='(transaction,index) in transactionStore.latestTransaction' :key='transaction.tx' class='cursor-pointer')
                                TableCell.text-white {{ (transactionStore.currentPage * transactionStore.pageSize) + index + 1 - transactionStore.pageSize }}
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
              div.flex.items-center.justify-center.gap-4.w-full.mt-10
                Button(class='hover:bg-primary group border-primary' @click='updateCurrentPage("prev")').bg-transparent(variant='outline' size='icon')
                  ChevronLeft(class='group-hover:text-black').text-primary.w-5.h-5
                Button(class='hover:bg-primary group border-primary' @click='updateCurrentPage("next")').bg-transparent(variant='outline' size='icon')
                  ChevronRight(class='group-hover:text-black').text-primary.w-5.h-5
</template>

<style lang="scss" scoped></style>
