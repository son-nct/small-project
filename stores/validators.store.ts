import { defineStore } from 'pinia'
import type { Validator } from '@/models/validator.ts'

export const useValidatorStore = defineStore('validators', {
  state: () => ({
    validatorList: [] as Validator[],
  }),
  actions: {
    async fetchValidator() {
      try {
      } catch {}
    },
  },
})
