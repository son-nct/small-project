import { defineStore } from 'pinia'
import type { Validator } from '@/models/validator.ts'
import { useFetch, useRuntimeConfig } from '#app'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'

export const useValidatorStore = defineStore('validators', {
  state: () => ({
    validatorList: [] as Validator[],
  }),
  actions: {
    showErrToast() {
      const { toast } = useToast()
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
        action: h(
          ToastAction,
          {
            altText: 'Try again'
          },
          {
            default: () => 'Try again'
          }
        )
      })
    },
    async fetchValidator(currentPage: number, pageSize: number = 25) {
      try {
        const runtimeConfig = useRuntimeConfig()
        const baseURI = '/validators'
        const apiUrl = runtimeConfig.public.RPC_URL + baseURI

        const { data, error } = await useFetch(`${apiUrl}` , {
          params: {
            'page': currentPage,
            'per_page': pageSize
          }
        })

        if (data.value) {
          console.log('data:' , data.value)
        }

        if (error.value) {
          this.showErrToast()
        }
      } catch(error) {
        this.showErrToast()
      }
    },
  },
})
