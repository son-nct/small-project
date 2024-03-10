<script lang="ts" setup>
import { useAsyncData } from '#app'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

import { useTransactionStore } from '~/stores/transactions.store'
import { useUtils } from '#imports'

interface TransactionDetail {
  chanId: string
  txHash: string
  gasWanted: string
  gasUsed: string
  status: 'Success' | 'false'
  height: number
  time: string
  fee: string
  gas: string
  shielded: 'Yes' | 'No'
}

const route = useRoute()
const transactionStore = useTransactionStore()
const hash = ref('')
const { formatDateTime } = useUtils()
const transactionDetail = ref<TransactionDetail | null>(null)

const navigateToTransactionDetail = (address: string) => {
  if (!address) return {}
  return {
    name: 'validators-address',
    params: { address },
  }
}

const navigateToBlockDetail = (height: string) => {
  if (!height) return {}
  return {
    name: 'blocks-height',
    params: { height },
  }
}

watchEffect(() => {
  hash.value = typeof route.params.hash === 'string' ? route.params.hash : ''
})

const { data: transaction } = await useAsyncData(
  `transaction-detail-by-hash`,
  () => transactionStore.fetchTransactionByHash(hash.value),
)

const { data: detail, pending } = await useAsyncData(
  `transaction-detail-normalize`,
  () => transactionStore.normalizeTransactionByHash(transaction.value),
)

transactionDetail.value = detail.value

const hasTransactionData = computed(() => transactionDetail.value)

const formatDateTimeFunc = (dateTimeString: string) => {
  if (!dateTimeString) return ''
  return formatDateTime(dateTimeString)
}

const navigateToValidatorDetail = (address: string) => {
  if (!address) return {}
  return {
    name: 'validators-address',
    params: { address },
  }
}

const formatString = (input: string): string => {
  const trimmedInput = input.trim()
  const words = trimmedInput.split('_')

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1)
  } else if (words.length === 2) {
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return trimmedInput
}

const copyDataToClipboard = () => {
  navigator.clipboard
    .writeText(transactionStore.rawData)
    .then(() => {
      // console.log('Data copied to clipboard successfully!');
      transactionStore.showCopiedToast()
    })
    .catch((err) => {
      console.error('Failed to copy data to clipboard:', err)
    })
}
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
                        h2.uppercase.font-ultraBold.text-white.text-center(class='mb-20 text-3xl md:text-5xl lg:text-6xl')
                          | Transaction Details
                        .w-full.flex.justify-center.h-10(v-if='pending')
                          Loader2(class="w-10 h-10 mr-2 text-primary animate-spin")
                    div(class='grid grid-col-1 lg:grid-cols-2 lg:mt-0 lg:px-10').gap-10
                        .flex.flex-col.gap-4.items-center.justify-center.border-b.pb-4.break-words.overflow-x-auto(v-for='(value, key) in transactionDetail')
                            template(v-if='key === "time"')
                              h5.font-ultraBold.text-primary.text-center.text-3xl {{ formatString(key) }}
                              p(class='overflow-x-auto text-base lg:text-lg whitespace-nowrap').text-center.text-neutralPink.tracking-tight.break-words {{ `${transactionStore.formatTimeAgo(value)} ( ${formatDateTimeFunc(value) })` }}
                            template(v-else-if='key === "height"')
                              h5.font-ultraBold.text-primary.text-center.text-3xl {{ formatString(key) }}
                              NuxtLink(:to="navigateToBlockDetail(value)").text-center.text-primary.tracking-tight.break-words {{ value }}
                            template(v-else-if='key === "status"')
                              h5.font-ultraBold.text-primary.text-center.text-3xl {{ formatString(key) }}
                              Badge(variant="outline" v-if='value === "Fail"').border-red-500.text-red-500
                                | {{ value }}
                              Badge(variant="outline" v-else).border-green-500.text-primary
                                | {{ value }}
                            template(v-else)
                              h5.font-ultraBold.text-primary.text-center.text-3xl {{ formatString(key) }}
                              p(class='overflow-x-auto text-base lg:text-lg whitespace-nowrap').text-center.text-neutralPink.tracking-tight.break-words {{ value }}
                .element-section(v-if='transaction')
                  div(class='relative flex flex-col w-full gap-4 h-fit lg:gap-10')
                    h2.uppercase.font-ultraBold.text-white.text-center(class='mb-10 text-5xl lg:text-6xl') Raw Data
                    div(class='w-full lg:container lg:mx-auto')
                      div(class='relative flex items-start justify-between w-full p-4 m-2 mb-8 space-x-3 overflow-x-scroll rounded stories drop-shadow-xl').h-auto.border.border-primary.rounded-lg.text-white.overflow-x-auto.overflow-y-auto
                        Icon(name="solar:clipboard-bold" size="3rem" class='absolute top-0 right-0 z-10 cursor-pointer text-primary' @click='copyDataToClipboard')
                        pre(style='max-height: 500px; overflow-x: auto; overflow-y: auto;')
                          | {{ transactionStore.rawData }}
                .container(v-if='!hasTransactionData')
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
