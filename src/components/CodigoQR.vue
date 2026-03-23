<script setup>
import { computed } from 'vue'
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

// 1. La misma "llave" que definimos en el Scanner
const SISTEMA_ID = "MSYT-CORRALON-";

const props = defineProps({
  contenido: {
    type: String, // Aquí recibes el ID o Folio del vehículo
    required: true
  }
})

// 2. Generamos el contenido del QR con el prefijo de seguridad
const qrSeguro = computed(() => {
  if (!props.contenido) return ''
  return `${SISTEMA_ID}${props.contenido}`
})

const descargarQR = () => {
  if (!qrSeguro.value) return
  
  // Usamos el contenido ya procesado con el prefijo
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrSeguro.value)}`
  
  // Abrir en pestaña nueva para descargar
  window.open(url, '_blank')
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
    <div class="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 relative group">
      <img 
        v-if="contenido"
        :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrSeguro}`" 
        alt="QR Code"
        class="w-40 h-40 mix-blend-multiply"
      />
      <QrCodeIcon v-else class="w-12 h-12 text-slate-300" />
    </div>

    <button 
      @click="descargarQR"
      :disabled="!contenido"
      class="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primario transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowDownTrayIcon class="w-4 h-4" />
      Descargar QR Oficial
    </button>
    
    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
      ID Encriptado: {{ qrSeguro }}
    </p>
  </div>
</template>