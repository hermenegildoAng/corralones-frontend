<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <Sidebar v-if="auth.isLoggedIn && !$route.meta.hideSidebar" />

    <main :class="[
  (auth.isLoggedIn && !$route.meta.hideSidebar) ? 'md:pl-64' : 'pl-0',
  'transition-all duration-300'
]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Sidebar from './components/Sidebar.vue'


const auth = useAuthStore()
</script>


