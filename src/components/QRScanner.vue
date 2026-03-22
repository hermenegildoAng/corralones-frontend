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

const modalAbierto      = ref(false)
const videoRef          = ref(null)
const canvasRef         = ref(null)
const estadoCamara      = ref('Iniciando cámara...')
const resultadoQR       = ref(null)
const vehiculoEncontrado = ref(null)
const errorCamara       = ref('')

let stream        = null
let animacionId   = null
let vehiculoId    = null

// ✅ Abre el modal e inicia la cámara
const abrirScanner = async () => {
  modalAbierto.value       = true
  resultadoQR.value        = null
  vehiculoEncontrado.value = null
  errorCamara.value        = ''
  estadoCamara.value       = 'Iniciando cámara...'

  try {
    // ✅ Primero pide permiso genérico para que el navegador liste las cámaras
    const permiso = await navigator.mediaDevices.getUserMedia({ video: true })
    permiso.getTracks().forEach(t => t.stop()) // cierra ese stream temporal

    // ✅ Lista todos los dispositivos de video disponibles
    const dispositivos = await navigator.mediaDevices.enumerateDevices()
    const camaras = dispositivos.filter(d => d.kind === 'videoinput')

    console.log('Cámaras disponibles:', camaras.map(c => c.label))

    // ✅ Filtra solo cámaras que NO sean del teléfono conectado
    // Las cámaras USB/externas suelen tener "USB" o el nombre del teléfono en su label
    const camaraLocal = camaras.find(c =>
      !c.label.toLowerCase().includes('vivo') &&
      !c.label.toLowerCase().includes('android') &&
      !c.label.toLowerCase().includes('phone') &&
      !c.label.toLowerCase().includes('usb')
    )

    // ✅ Usa la cámara local encontrada, o la primera disponible
    const deviceId = camaraLocal?.deviceId || camaras[0]?.deviceId

    stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } }
    })

    await new Promise(r => setTimeout(r, 100))
    videoRef.value.srcObject = stream
    await videoRef.value.play()

    estadoCamara.value = 'Buscando QR...'
    escanearFrame()

  } catch (err) {
    console.error('Error cámara:', err)
    if (err.name === 'NotAllowedError') {
      errorCamara.value = 'Permiso de cámara denegado.'
    } else if (err.name === 'NotFoundError') {
      errorCamara.value = 'No se encontró ninguna cámara.'
    } else {
      errorCamara.value = 'Error: ' + err.message
    }
  }
}

// ✅ Bucle de escaneo frame por frame
const escanearFrame = () => {
  if (!videoRef.value || videoRef.value.readyState !== videoRef.value.HAVE_ENOUGH_DATA) {
    animacionId = requestAnimationFrame(escanearFrame)
    return
  }

  const canvas  = canvasRef.valune
  const video   = videoRef.value
  canvas.width  = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const qr = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert'
  })

  if (qr) {
    // ✅ QR detectado — procesa los datos
    procesarQR(qr.data)
  } else {
    animacionId = requestAnimationFrame(escanearFrame)
  }
}

// ✅ Procesa el JSON del QR y busca en el sistema
const procesarQR = async (rawData) => {
  estadoCamara.value = '¡QR detectado! Buscando...'
  detenerCamara()

  try {
    const datos = JSON.parse(rawData)
    resultadoQR.value = datos

    // Busca por placa u otro campo identificador
    const identificador = datos.placa || datos.id || datos.folio
    if (!identificador) {
      vehiculoEncontrado.value = null
      return
    }

    // ✅ Busca en tu API de Django
    const response = await clienteAxios.get(`ingresos/?search=${identificador}`)
    const resultados = response.data?.results || response.data

    if (resultados && resultados.length > 0) {
      vehiculoEncontrado.value = resultados[0]
      vehiculoId = resultados[0].id
    } else {
      vehiculoEncontrado.value = null
    }

  } catch (err) {
    console.error('Error procesando QR:', err)
    vehiculoEncontrado.value = null
    // Si no es JSON válido
    resultadoQR.value = { raw: rawData }
  }
}

// ✅ Navega al expediente del vehículo
const irAlVehiculo = () => {
  cerrarScanner()
  if (vehiculoId) {
    router.push(`/ingresos/${vehiculoId}`)
  }
}

const reiniciarScanner = () => {
  resultadoQR.value        = null
  vehiculoEncontrado.value = null
  estadoCamara.value       = 'Buscando QR...'
  abrirScanner()
}

const detenerCamara = () => {
  if (animacionId) cancelAnimationFrame(animacionId)
  if (stream) stream.getTracks().forEach(t => t.stop())
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