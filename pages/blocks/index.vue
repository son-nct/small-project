<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted, reactive } from 'vue'
import { useAsyncData, useLazyAsyncData } from '#app'
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

import { useBlocksStore } from '~/stores/blocks.store'
import { useUtils } from '~/composables/useUtils'

const header = ['No', 'Height', 'Hash', 'Txs', 'Proposer', 'Time']

const searchValue = ref('')
const currentPage = ref(1)
const isLoading = ref(false)
const isSearching = ref(false)
const forceUpdate = ref(1)

const blockStore = useBlocksStore()
const paginationData = reactive({
  start: 1,
  end: 10,
  totalPage: 5,
  data: [] as any[],
})

const updateLatestData = (newData: any) => {
  blockStore.latestBlocks = newData.map((block: any) => ({
    ...blockStore.normalizeBlockData(block),
  }))
}

const updatePaginatedBlock = () => {
  const { start, end, data, totalPage } = blockStore.paginatedBlocks()
  paginationData.start = start
  paginationData.end = end
  paginationData.totalPage = totalPage
  paginationData.data = data
}

const updateCurrentPage = (type: string) => {
  switch (type) {
    case 'next':
      if (blockStore.currentPage < paginationData.totalPage) {
        blockStore.currentPage += 1
      }
      break
    case 'prev':
      if (blockStore.currentPage > 1) {
        blockStore.currentPage -= 1
      }
      break
    default:
      break
  }
  updatePaginatedBlock()
  forceUpdate.value += 1
}

const navigateToValidatorDetail = (address: string) => {
  if (!address) return {}
  return {
    name: 'validators-address',
    params: { address },
  }
}

const { data: blocks, pending } = await useAsyncData('latest-block', () =>
  blockStore.fetchLatestBlocksList(),
)

updateLatestData(blocks.value)
updatePaginatedBlock()

const hasBlocksData = computed(() => blockStore.latestBlocks.length > 0)

const navigateToBlockDetail = (height: string) => {
  if (!height) return {}
  return {
    name: 'blocks-height',
    params: { height },
  }
}

const router = useRouter()

const searchByBlockHeight = () => {
  if (searchValue.value.trim().length === 0) return
  router.push({
    name: 'blocks-height',
    params: { height: searchValue.value },
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
    const newData = await blockStore.fetchLatestBlocksList()
    updateLatestData(newData)
    updatePaginatedBlock()
    forceUpdate.value += 1
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
        div(class='items-start lg:items-end').flex.flex-col.pl-6.w-full.mb-10
          h3(class='text-base lg:text-lg').text-primary shielded-expedition.88f17d1d14
          p.text-neutralPink https://namada-rpc.validatorvn.com
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
                  Table.mt-3(v-if='hasBlocksData' :key='forceUpdate')
                    TableCaption.text-white.text-lg {{ paginationData.start }} - {{ paginationData.end }} of 50
                    TableHeader
                      TableRow
                        TableHead(v-for='text in header' class='w-[100px] text-primary font-semibold')
                          | {{ text }}
                    TableBody
                      TableRow(v-for='(block,index) in paginationData.data' :key='block.hash' class='cursor-pointer')
                        TableCell.text-white {{ paginationData.start + index }}
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
            h3(v-if='!isSearching && !hasBlocksData').font-ultraBold.text-white.text-center.text-3xl  No Data Found         
</template>

<style lang="scss" scoped></style>
