<template>
  <main class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-12 border border-gray-100">

      <div class="mb-8 text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primario" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight uppercase">¿Olvidaste tu contraseña?</h2>
        <p class="text-slate-400 mt-2 text-sm font-medium">Ingresa tu correo y te enviaremos un enlace de recuperación.</p>
      </div>

      <div v-if="enviado" class="text-center py-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-slate-700 font-bold text-lg">¡Correo enviado!</p>
        <p class="text-slate-400 text-sm mt-2">Revisa tu bandeja de entrada y sigue las instrucciones.</p>
        <button @click="$router.push('/')" class="mt-6 text-primario font-bold text-sm hover:underline">
          Volver al login
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2 tracking-widest">
            Correo Electrónico
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="tu@correo.com"
            class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-primario/10 focus:border-primario outline-none transition-all font-bold text-slate-700"
          />
        </div>

        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-primario text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primario/90 transition-all disabled:opacity-50"
        >
          {{ cargando ? 'Enviando...' : 'Enviar enlace de recuperación' }}
        </button>

        <p v-if="error" class="text-center text-xs text-red-500 font-bold">{{ error }}</p>

        <div class="text-center">
          <button type="button" @click="$router.push('/')" class="text-sm text-slate-400 hover:text-primario transition-colors font-medium">
            ← Volver al login
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import clienteAxios from '../api/axios'

const email    = ref('')
const cargando = ref(false)
const enviado  = ref(false)
const error    = ref('')

const handleSubmit = async () => {
  try {
    cargando.value = true
    error.value    = ''
    await clienteAxios.post('password-reset/', { email: email.value })
    enviado.value = true
  } catch (err) {
    error.value = 'Error al enviar el correo. Intenta de nuevo.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}
</script>