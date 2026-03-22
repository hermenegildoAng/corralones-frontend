<template>
  <div class="p-4 md:p-8 bg-slate-50 min-h-screen flex font-sans">
    <div class="bg-white rounded-4xl shadow-sm border border-slate-100 w-full flex flex-col xl:flex-row flex-1 overflow-hidden">
      
      <!-- PANEL IZQUIERDO -->
      <section class="w-full xl:w-5/12 bg-slate-800 text-white relative flex flex-col">
        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primario via-transparent to-transparent"></div>

        <div class="p-8 md:p-12 relative z-10 flex flex-col items-center pt-16 flex-1 text-center">
          
          <div class="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center shadow-2xl overflow-hidden mb-6">
            <UserIcon class="w-16 h-16 text-slate-500" />
          </div>

          <h2 class="text-3xl lg:text-4xl font-black uppercase tracking-tighter">
            {{ profile.nombre_user || 'Cargando...' }}
          </h2>

          <p class="text-[10px] sm:text-xs font-black text-primario uppercase tracking-widest mt-2">
            @{{ profile.username }}
          </p>

          <div class="mt-8">
            <span class="px-6 py-2.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {{ profile.rol || 'Operador' }}
            </span>
          </div>

          <div class="w-full mt-auto space-y-5 text-left bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
            
            <div>
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Afiliación</p>
              <div class="flex items-center gap-2">
                <BuildingOfficeIcon class="w-4 h-4 text-primario" />
                <p class="text-xs sm:text-sm font-bold text-slate-200 uppercase">
                  {{ profile.corralon || 'Sede Municipal' }}
                </p>
              </div>
            </div>

            <div>
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</p>
              <div class="flex items-center gap-2">
                <EnvelopeIcon class="w-4 h-4 text-slate-400" />
                <p class="text-xs sm:text-sm font-bold text-slate-200 truncate">
                  {{ profile.email }}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- PANEL DERECHO -->
      <section class="w-full xl:w-7/12 p-8 md:p-14 lg:p-20 flex flex-col bg-white">

        <div class="mb-10">
          <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tighter">Configuración</h3>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Actualiza tus credenciales
          </p>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="py-20 text-center">
          <div class="w-10 h-10 border-4 border-t-primario border-slate-200 rounded-full animate-spin mx-auto"></div>
        </div>

        <!-- FORM -->
        <form v-else @submit.prevent="handleUpdate" class="space-y-8">

          <!-- USERNAME -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-widest">
              Nombre de Usuario
            </label>

            <div class="relative">
              <UserCircleIcon class="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                v-model="profile.username"
                type="text"
                :class="[
                  'w-full pl-16 pr-12 py-5 border rounded-3xl outline-none font-bold text-slate-700 bg-slate-50 transition-all duration-200',
                  usernameError
                    ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50'
                    : 'border-slate-100 focus:border-primario focus:ring-4 focus:ring-primario/10 focus:bg-white'
                ]"
                @blur="validateUsername"
              />
              <!-- Ícono de estado username -->
              <div class="absolute right-5 top-1/2 -translate-y-1/2">
                <CheckCircleIcon v-if="profile.username && !usernameError" class="w-5 h-5 text-green-500" />
                <ExclamationCircleIcon v-else-if="usernameError" class="w-5 h-5 text-red-400" />
              </div>
            </div>
            <p v-if="usernameError" class="mt-2 ml-2 text-[10px] text-red-500 font-bold uppercase tracking-wide">
              {{ usernameError }}
            </p>
          </div>

          <!-- PASSWORD SECTION -->
          <div class="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">

            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <KeyIcon class="w-4 h-4" /> Seguridad — Cambio de Contraseña
            </h4>

            <div class="space-y-5">

              <!-- NUEVA CONTRASEÑA -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                  Nueva Contraseña
                </label>
                <div class="relative">
                  <input 
                    v-model="passwordData.newPassword"
                    :type="showNew ? 'text' : 'password'"
                    placeholder="Mínimo 8 caracteres"
                    :class="[
                      'w-full pl-5 pr-14 py-4 bg-white border rounded-2xl outline-none font-bold text-slate-700 transition-all duration-200',
                      newPasswordError
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50'
                        : passwordData.newPassword && passwordStrength.score >= 3
                          ? 'border-green-300 focus:border-green-400 focus:ring-4 focus:ring-green-50'
                          : 'border-slate-200 focus:border-primario focus:ring-4 focus:ring-primario/10'
                    ]"
                    @input="validateNewPassword"
                    @blur="validateNewPassword"
                  />
                  <button
                    type="button"
                    @click="showNew = !showNew"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <EyeSlashIcon v-if="showNew" class="w-5 h-5" />
                    <EyeIcon v-else class="w-5 h-5" />
                  </button>
                </div>
                <p v-if="newPasswordError" class="mt-1.5 ml-1 text-[10px] text-red-500 font-bold uppercase tracking-wide">
                  {{ newPasswordError }}
                </p>

                <!-- MEDIDOR DE FORTALEZA -->
                <div v-if="passwordData.newPassword" class="mt-4 space-y-2">
                  <div class="flex gap-1.5">
                    <div
                      v-for="i in 4"
                      :key="i"
                      :class="[
                        'h-1.5 flex-1 rounded-full transition-all duration-300',
                        i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                      ]"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between">
                    <p :class="['text-[10px] font-black uppercase tracking-widest', passwordStrength.textColor]">
                      {{ passwordStrength.label }}
                    </p>
                    <!-- Reglas visuales -->
                    <div class="flex gap-3">
                      <span
                        v-for="rule in passwordRules"
                        :key="rule.label"
                        :class="[
                          'text-[9px] font-bold uppercase tracking-wide flex items-center gap-1',
                          rule.met ? 'text-green-500' : 'text-slate-300'
                        ]"
                      >
                        <span>{{ rule.met ? '✓' : '○' }}</span> {{ rule.label }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CONFIRMAR CONTRASEÑA -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                  Confirmar Contraseña
                </label>
                <div class="relative">
                  <input 
                    v-model="passwordData.confirmPassword"
                    :type="showConfirm ? 'text' : 'password'"
                    placeholder="Repite la contraseña"
                    :class="[
                      'w-full pl-5 pr-14 py-4 bg-white border rounded-2xl outline-none font-bold text-slate-700 transition-all duration-200',
                      confirmError
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50'
                        : passwordData.confirmPassword && !confirmError
                          ? 'border-green-300 focus:border-green-400 focus:ring-4 focus:ring-green-50'
                          : 'border-slate-200 focus:border-primario focus:ring-4 focus:ring-primario/10'
                    ]"
                    @blur="validateConfirm"
                  />
                  <button
                    type="button"
                    @click="showConfirm = !showConfirm"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <EyeSlashIcon v-if="showConfirm" class="w-5 h-5" />
                    <EyeIcon v-else class="w-5 h-5" />
                  </button>
                </div>
                <p v-if="confirmError" class="mt-1.5 ml-1 text-[10px] text-red-500 font-bold uppercase tracking-wide">
                  {{ confirmError }}
                </p>
                <p v-else-if="passwordData.confirmPassword && !confirmError" class="mt-1.5 ml-1 text-[10px] text-green-500 font-bold uppercase tracking-wide">
                  ✓ Las contraseñas coinciden
                </p>
              </div>

            </div>
          </div>

          <!-- ERROR GLOBAL -->
          <div v-if="errorMsg" class="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
            ⚠️ {{ errorMsg }}
          </div>

          <!-- ÉXITO -->
          <div v-if="successMsg" class="p-4 bg-green-50 text-green-600 text-xs font-bold rounded-xl border border-green-100">
            ✓ {{ successMsg }}
          </div>

          <!-- BOTONES -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="$router.back()"
              class="text-slate-400 hover:text-slate-600 font-bold text-sm uppercase tracking-widest transition-colors px-4 py-3"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-200',
                isFormValid
                  ? 'bg-primario text-white hover:bg-primario/90 hover:shadow-lg hover:shadow-primario/20 hover:-translate-y-0.5'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              ]"
            >
              Guardar Cambios
            </button>
          </div>

        </form>

      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import {
  UserIcon, BuildingOfficeIcon, EnvelopeIcon, UserCircleIcon, KeyIcon,
  EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const loading = ref(true)
const errorMsg = ref('')
const successMsg = ref('')

const profile = ref({
  username: '', nombre_user: '', email: '', rol: '', corralon: ''
})

const passwordData = ref({
  newPassword: '', confirmPassword: ''
})

// ── Mostrar/ocultar contraseñas ──────────────────────────────────────────────
const showNew     = ref(false)
const showConfirm = ref(false)

// ── Errores individuales ─────────────────────────────────────────────────────
const usernameError    = ref('')
const newPasswordError = ref('')
const confirmError     = ref('')

// ── Validación username ──────────────────────────────────────────────────────
const validateUsername = () => {
  const val = profile.value.username.trim()
  if (!val) {
    usernameError.value = 'El nombre de usuario es obligatorio'
  } else if (val.length < 3) {
    usernameError.value = 'Mínimo 3 caracteres'
  } else if (!/^[a-zA-Z0-9_]+$/.test(val)) {
    usernameError.value = 'Solo letras, números y guión bajo'
  } else {
    usernameError.value = ''
  }
}

// ── Reglas de contraseña ─────────────────────────────────────────────────────
const passwordRules = computed(() => [
  { label: '8+',   met: passwordData.value.newPassword.length >= 8 },
  { label: 'A-Z',  met: /[A-Z]/.test(passwordData.value.newPassword) },
  { label: '0-9',  met: /[0-9]/.test(passwordData.value.newPassword) },
  { label: '#!@',  met: /[^a-zA-Z0-9]/.test(passwordData.value.newPassword) },
])

// ── Nivel de fortaleza (0–4) ─────────────────────────────────────────────────
const passwordStrength = computed(() => {
  const score = passwordRules.value.filter(r => r.met).length

  const map = {
    0: { score: 0, label: '',           color: 'bg-slate-200',  textColor: 'text-slate-300' },
    1: { score: 1, label: 'Muy débil',  color: 'bg-red-400',    textColor: 'text-red-400'   },
    2: { score: 2, label: 'Débil',      color: 'bg-orange-400', textColor: 'text-orange-400'},
    3: { score: 3, label: 'Buena',      color: 'bg-yellow-400', textColor: 'text-yellow-500'},
    4: { score: 4, label: 'Fuerte',     color: 'bg-green-500',  textColor: 'text-green-500' },
  }
  return map[score]
})

// ── Validar nueva contraseña ─────────────────────────────────────────────────
const validateNewPassword = () => {
  const val = passwordData.value.newPassword
  if (!val) {
    newPasswordError.value = ''
    return
  }
  if (val.length < 8) {
    newPasswordError.value = 'Mínimo 8 caracteres'
  } else {
    newPasswordError.value = ''
  }
  // revalidar confirmar si ya tiene contenido
  if (passwordData.value.confirmPassword) validateConfirm()
}

// ── Validar confirmar contraseña ─────────────────────────────────────────────
const validateConfirm = () => {
  if (!passwordData.value.confirmPassword) {
    confirmError.value = ''
    return
  }
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    confirmError.value = 'Las contraseñas no coinciden'
  } else {
    confirmError.value = ''
  }
}

// ── ¿El formulario es válido para enviar? ────────────────────────────────────
const isFormValid = computed(() => {
  const usernameOk = profile.value.username.trim().length >= 3 && !usernameError.value

  // Si no escribió contraseña nueva, se permite guardar solo el username
  if (!passwordData.value.newPassword) return usernameOk

  // Si escribió contraseña, debe pasar todas las validaciones
  const passwordOk =
    !newPasswordError.value &&
    !confirmError.value &&
    passwordData.value.newPassword === passwordData.value.confirmPassword &&
    passwordData.value.newPassword.length >= 8

  return usernameOk && passwordOk
})

// ── Cargar perfil ────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const userId = auth.user_id || sessionStorage.getItem('user_id')
    const res = await clienteAxios.get(`usuarios/${userId}/`)

    // ✅ Valores por defecto por si algún campo no viene en la respuesta
    const {
      username    = '',
      nombre_user = '',
      email       = '',
      rol         = '',
      corralon    = ''
    } = res.data ?? {}

    profile.value = { username, nombre_user, email, rol, corralon }

  } catch (err) {
    console.error('Error al cargar perfil:', err)
    errorMsg.value = err.response?.data?.detail || 'Error al cargar perfil'
  } finally {
    loading.value = false
  }
})
// ── Guardar cambios ──────────────────────────────────────────────────────────
const handleUpdate = async () => {
  // Disparar todas las validaciones antes de enviar
  validateUsername()
  if (passwordData.value.newPassword) {
    validateNewPassword()
    validateConfirm()
  }

  if (!isFormValid.value) return

  try {
    errorMsg.value   = ''
    successMsg.value = ''

    // ✅ Fix 1: Usar sessionStorage en lugar de localStorage
    const userId = auth.user_id || sessionStorage.getItem('user_id')

    const payload = { username: profile.value.username }
    if (passwordData.value.newPassword) {
      payload.password = passwordData.value.newPassword
    }

    await clienteAxios.patch(`usuarios/${userId}/`, payload)

    // ✅ Fix 4: El mensaje de éxito desaparece automáticamente tras 4 segundos
    successMsg.value = 'Perfil actualizado correctamente'
    setTimeout(() => { successMsg.value = '' }, 4000)

    // Limpiar campos de contraseña tras éxito
    passwordData.value = { newPassword: '', confirmPassword: '' }

  } catch (err) {
    // ✅ Fix 3: Loguear el error real y mostrar mensaje del backend si existe
    console.error('Error al actualizar perfil:', err)
    errorMsg.value = err.response?.data?.detail || 'Error al actualizar el perfil'
  }
}
</script>