import { defineNuxtRouteMiddleware, navigateTo } from "#app"

export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path !== '/validators') {
        return navigateTo('/validators')
    }
  })