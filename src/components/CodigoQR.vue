<template>
  <div class="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm flex flex-col items-center justify-center w-full h-full">
    <div class="flex items-center gap-2 mb-6 text-center w-full justify-center">
      <QrCodeIcon class="w-6 h-6 text-amber-500" />
      <h3 class="font-black text-slate-800 uppercase text-xs tracking-widest">Identificador Digital</h3>
    </div>

    <div class="bg-slate-50 rounded-4xl p-8 w-full flex flex-col items-center border border-slate-50 flex-1 justify-center">
      <div v-if="contenido" class="text-center animate-in fade-in zoom-in duration-500">
        <div class="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 inline-block hover:shadow-xl transition-shadow cursor-default">
          <img 
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${contenido}`" 
            alt="Código QR"
            class="w-32 h-32"
          />
        </div>
        <p class="mt-3 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{{ contenido }}</p>
        
        <button 
          @click="descargarQR"
          class="mt-4 flex items-center gap-2 text-[9px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-full transition-all uppercase tracking-widest"
        >
          <ArrowDownTrayIcon class="w-3.5 h-3.5" />
          Imprimir
        </button>
      </div>

      <div v-else class="py-10 text-center space-y-2 opacity-30">
        <QrCodeIcon class="w-12 h-12 mx-auto" />
        <p class="text-[10px] font-bold uppercase italic">Sin datos de origen</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

// Definimos las props para que reciba la placa del auto padre
const props = defineProps({
  contenido: {
    type: String,
    required: true
  }
})

const descargarQR = () => {
  if (!props.contenido) return
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${props.contenido}`
  window.open(url, '_blank')
}
</script>