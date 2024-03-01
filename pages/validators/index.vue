<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useUtils } from '@/composables/useUtils.ts'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'
import DataListLayout from '@/components/templates/validators/DataListLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const searchValue = defineModel('')
// Column: VALIDATOR,	MONIKER,	UP TIME,	VOTING POWER,
const header = ['Validator', 'Moniker', 'Up Time', 'Voting Power']

const invoices = [
    {
        invoice: 'INV001',
        paymentStatus: 'Paid',
        totalAmount: '$250.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV002',
        paymentStatus: 'Pending',
        totalAmount: '$150.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV003',
        paymentStatus: 'Unpaid',
        totalAmount: '$350.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV004',
        paymentStatus: 'Paid',
        totalAmount: '$450.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV005',
        paymentStatus: 'Paid',
        totalAmount: '$550.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV006',
        paymentStatus: 'Pending',
        totalAmount: '$200.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV007',
        paymentStatus: 'Unpaid',
        totalAmount: '$300.00',
        paymentMethod: 'Credit Card',
    },
]

const route = useRoute()

const { uppercaseFirstCharacter } = useUtils()
const currentPageName = ref<string>('')
currentPageName.value = route.name ? uppercaseFirstCharacter(route.name) : ''
</script>

<template>
    <DataListLayout>
        <template #breadcrumb>
            <breadcrumb :currentPageName class='my-5' />
        </template>
        <template #search>
            <!-- <Input :model-value="modelValue" placeholder="Search Validator"/> -->
            <div class="flex items-center w-full gap-2"> 
                <div class="relative items-center w-full max-w-md">
                    <Input v-model="searchValue" id="search" type="text" placeholder="Search Validator..." class="pl-10" />
                    <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
                        <Icon name="radix-icons:magnifying-glass" class="size-6 text-muted-foreground" />
                    </span>
                </div>
                <Button>Search</Button>
            </div>
        </template>

        <template #dataList>
            <Table class="mt-3">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead v-for='text in header' class="w-[100px]">
                            {{ text }}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="invoice in invoices" :key="invoice.invoice">
                        <TableCell class="font-medium">
                            {{ invoice.invoice }}
                        </TableCell>
                        <TableCell>{{ invoice.paymentStatus }}</TableCell>
                        <TableCell>{{ invoice.paymentMethod }}</TableCell>
                        <TableCell class="text-right">
                            {{ invoice.totalAmount }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </template>
    </DataListLayout>
</template>

<style lang="scss" scoped></style>
