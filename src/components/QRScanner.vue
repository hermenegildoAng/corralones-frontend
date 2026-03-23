<template>
  <!-- Botón para abrir -->
  <button @click="abrirScanner"
    class="flex items-center gap-2 bg-primario text-white px-4 py-2.5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-primario/90 transition-all shadow-lg shadow-primario/20">
    <QrCodeIcon class="w-4 h-4" />
    Escanear QR
  </button>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center p-4">

        <!-- Overlay -->
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="cerrarScanner" />

        <!-- Contenido del modal -->
        <div class="relative z-10 bg-white rounded-4xl shadow-2xl w-full max-w-md overflow-hidden">

          <!-- Header -->
          <div class="bg-primario p-6 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-white/20 p-2 rounded-xl">
                  <QrCodeIcon class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-black text-sm uppercase tracking-widest">Escáner QR</h3>
                  <p class="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Apunta al código QR del vehículo</p>
                </div>
              </div>
              <button @click="cerrarScanner" class="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Cámara -->
          <div class="relative bg-slate-900">
            <video ref="videoRef" class="w-full h-72 object-cover" autoplay playsinline muted />
            <canvas ref="canvasRef" class="hidden" />

            <!-- Marco de escaneo -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="relative w-48 h-48">
                <!-- Esquinas del marco -->
                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                <!-- Línea de escaneo animada -->
                <div class="absolute inset-x-0 h-0.5 bg-rosa-comp/80 shadow-[0_0_8px_rgba(255,0,100,0.8)] scan-line" />
              </div>
            </div>

            <!-- Estado -->
            <div class="absolute bottom-3 inset-x-0 flex justify-center">
              <span class="bg-slate-900/70 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                {{ estadoCamara }}
              </span>
            </div>
          </div>

          <!-- Resultado -->
          <div v-if="resultadoQR" class="p-6 border-t border-slate-100">
            <div v-if="vehiculoEncontrado" class="space-y-2">
              <p class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircleIcon class="w-4 h-4" /> Vehículo Encontrado
              </p>
              <div class="bg-slate-50 rounded-2xl p-4 space-y-2">
                <div v-for="(val, key) in vehiculoEncontrado" :key="key" class="flex justify-between items-center">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ key }}</span>
                  <span class="text-xs font-black text-slate-700">{{ val }}</span>
                </div>
              </div>
              <button @click="irAlVehiculo"
                class="w-full mt-3 bg-primario text-white py-3 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-primario/90 transition-all">
                Ver Expediente Completo →
              </button>
            </div>

            <div v-else class="text-center py-2">
              <p class="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center justify-center gap-2">
                <XCircleIcon class="w-4 h-4" /> Vehículo no encontrado en el sistema
              </p>
              <button @click="reiniciarScanner"
                class="mt-3 text-[10px] font-black text-primario uppercase tracking-widest hover:underline">
                Escanear de nuevo
              </button>
            </div>
          </div>

          <!-- Error de cámara -->
          <div v-if="errorCamara" class="p-6 text-center">
            <p class="text-[10px] font-black text-red-500 uppercase tracking-widest">{{ errorCamara }}</p>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import jsQR from 'jsqr'
import clienteAxios from '../api/axios'
import { QrCodeIcon, XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// --- CONFIGURACIÓN DE SEGURIDAD ---
const SISTEMA_ID = "MSYT-CORRALON-"; // Prefijo obligatorio en tus QRs

const modalAbierto       = ref(false)
const videoRef           = ref(null)
const canvasRef          = ref(null)
const estadoCamara       = ref('Iniciando cámara...')
const vehiculoEncontrado = ref(null)
const errorCamara        = ref('')
const escaneando         = ref(false)

let stream       = null
let animacionId  = null

// ✅ Abre el modal e inicia la cámara
const abrirScanner = async () => {
  modalAbierto.value       = true
  vehiculoEncontrado.value = null
  errorCamara.value        = ''
  estadoCamara.value       = 'Iniciando cámara...'
  escaneando.value         = true

  try {
    // Forzamos la cámara trasera usando facingMode: environment
    // Esto es el estándar para móviles para evitar la cámara frontal
    const constraints = {
      video: { 
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints)
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      // Esperamos a que el video esté listo para reproducir
      videoRef.value.onloadedmetadata = () => {
        videoRef.value.play()
        estadoCamara.value = 'Buscando QR del sistema...'
        escanearFrame()
      }
    }

  } catch (err) {
    console.error('Error cámara:', err)
    errorCamara.value = 'No se pudo acceder a la cámara trasera. Verifica los permisos.'
  }
}

// ✅ Bucle de escaneo optimizado
const escanearFrame = () => {
  if (!escaneando.value || !videoRef.value) return

  if (videoRef.value.readyState === videoRef.value.HAVE_ENOUGH_DATA) {
    const canvas = canvasRef.value
    const video  = videoRef.value
    
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    const qr = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    })

    if (qr) {
      validarYProcesar(qr.data)
      return // Detenemos el bucle si encuentra algo
    }
  }
  
  animacionId = requestAnimationFrame(escanearFrame)
}

// ✅ VALIDACIÓN: Aquí filtramos que sea nuestro QR
const validarYProcesar = async (rawData) => {
  // 1. Verificar prefijo de seguridad
  if (!rawData.startsWith(SISTEMA_ID)) {
    estadoCamara.value = "QR inválido o ajeno al sistema."
    // Reiniciamos escaneo tras un breve delay para que el usuario pueda quitar el QR malo
    setTimeout(escanearFrame, 2000) 
    return
  }

  // 2. Si es válido, procedemos
  escaneando.value = false
  detenerCamara()
  estadoCamara.value = '¡QR Válido! Consultando unidad...'

  try {
    // Extraemos el ID o Folio (lo que venga después del prefijo)
    const identificador = rawData.replace(SISTEMA_ID, "")
    
    // 3. Buscamos en el backend
    const response = await clienteAxios.get(`ingresos/?search=${identificador}`)
    const resultados = response.data?.results || response.data

    if (resultados && resultados.length > 0) {
      vehiculoEncontrado.value = resultados[0]
      // Si quieres navegar directo:
      // router.push(`/ingresos/${resultados[0].id}`)
    } else {
      errorCamara.value = "Vehículo no encontrado en la base de datos."
    }
  } catch (err) {
    console.error('Error API:', err)
    errorCamara.value = "Error al conectar con el servidor."
  }
}

const detenerCamara = () => {
  escaneando.value = false
  if (animacionId) cancelAnimationFrame(animacionId)
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
}

const cerrarScanner = () => {
  detenerCamara()
  modalAbierto.value = false
}

onUnmounted(() => detenerCamara())
</script>

<style scoped>
.scan-line {
  animation: scan 2s linear infinite;
}
@keyframes scan {
  0%   { top: 0; }
  50%  { top: calc(100% - 2px); }
  100% { top: 0; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>