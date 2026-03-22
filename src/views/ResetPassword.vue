<template>
  <main class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-12 border border-gray-100">

      <!-- Header -->
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-black text-slate-800 uppercase">
          Restablecer contraseña
        </h2>
        <p class="text-slate-400 mt-2 text-sm">
          Ingresa tu nueva contraseña
        </p>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-4 text-red-500 text-sm text-center font-bold">
        {{ errorMsg }}
      </div>

      <!-- Success -->
      <div v-if="successMsg" class="mb-4 text-green-600 text-sm text-center font-bold">
        {{ successMsg }}
      </div>

      <form @submit.prevent="handleReset" class="space-y-5">

        <!-- Nueva contraseña -->
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-2">
            Nueva contraseña
          </label>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-5 py-3 bg-slate-50 border rounded-xl outline-none pr-12"
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Eye v-if="!showPassword" size="20" />
              <EyeOff v-else size="20" />
            </button>
          </div>
        </div>

        <!-- Confirmar contraseña -->
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-2">
            Confirmar contraseña
          </label>

          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-5 py-3 bg-slate-50 border rounded-xl outline-none pr-12"
            />

            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Eye v-if="!showConfirmPassword" size="20" />
              <EyeOff v-else size="20" />
            </button>
          </div>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primario text-white py-3 rounded-xl font-bold uppercase text-sm disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>

      </form>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import clienteAxios from '../api/axios'
import { Eye, EyeOff } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

const handleReset = async () => {
  errorMsg.value = ''

  if (!password.value || !confirmPassword.value) {
    errorMsg.value = 'Todos los campos son obligatorios'
    return
  }

  if (password.value.length < 8) {
    errorMsg.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    loading.value = true

    const payload = {
      uid: route.params.uid,
      token: route.params.token,
      new_password: password.value
    }

    await clienteAxios.post('password-reset/confirm/', payload)

    successMsg.value = 'Contraseña actualizada correctamente'

    setTimeout(() => {
      router.push('/')
    }, 2000)

  } catch (error) {
    errorMsg.value =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      'El enlace es inválido o expiró'
  } finally {
    loading.value = false
  }
}
</script>