<template>
  <div class="p-4 md:p-10 space-y-8">
    <div class="max-w-7xl mx-auto">
      
      <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-[10px] font-black text-rosa-comp uppercase tracking-[0.3em]">Seguimiento de Trámites</span>
          <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase mt-2">Historial de Peticiones</h1>
          <p class="text-slate-400 text-sm font-medium mt-1">Consulta el estado de las correcciones que has solicitado al Administrador.</p>
        </div>

        <div class="flex bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
          <button 
            v-for="f in ['TODAS', 'PENDIENTE', 'ACEPTADA', 'RECHAZADA']" 
            :key="f"
            @click="filtroActual = f"
            :class="[
              'px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all',
              filtroActual === f ? 'bg-primario text-white shadow-lg shadow-primario/20' : 'text-slate-400 hover:text-slate-600'
            ]"
          >
            {{ f }}
          </button>
        </div>
      </header>

      <div class="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/50">
              <tr>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Ticket / Fecha</th>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Campo a Corregir</th>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Justificación</th>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus</th>
                <th class="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalle</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-if="filtradas.length === 0">
                <td colspan="5" class="px-8 py-20 text-center">
                  <div class="flex flex-col items-center opacity-20">
                    <PencilSquareIcon class="w-12 h-12 mb-2" />
                    <p class="text-xs font-black uppercase tracking-widest">Sin solicitudes registradas</p>
                  </div>
                </td>
              </tr>

              <tr v-for="sol in filtradas" :key="sol.id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-800">REQ-{{ sol.id }}</span>
                    <span class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{{ sol.fecha_solicitud }}</span>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">
                    {{ sol.campo_afectado }}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <p class="text-xs text-slate-500 font-medium italic max-w-xs truncate" :title="sol.justificacion">
                    "{{ sol.justificacion }}"
                  </p>
                </td>
                <td class="px-8 py-6">
                  <span 
                    :class="[
                      'px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border',
                      statusStyles[sol.estatus]
                    ]"
                  >
                    {{ sol.estatus }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center">
                  <button 
                    @click="verDetalle(sol)"
                    class="p-3 text-slate-300 hover:text-primario hover:bg-primario/5 rounded-2xl border border-slate-100 transition-all shadow-sm"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div v-if="modalAbierto" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div class="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div class="p-10">
          <div class="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
            <div>
              <span class="text-[9px] font-black text-primario uppercase tracking-[0.3em]">Resumen de Petición</span>
              <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase mt-1">Ticket REQ-{{ solicitudActiva.id }}</h2>
            </div>
            <button @click="modalAbierto = false" class="text-slate-300 hover:text-red-500 text-2xl transition-colors">✕</button>
          </div>

          <div class="space-y-6">
            <div class="bg-slate-50 p-6 rounded-[2rem]">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Justificación técnica:</label>
              <p class="text-sm text-slate-600 italic leading-relaxed">"{{ solicitudActiva.justificacion }}"</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-5 bg-red-50/50 border border-red-100 rounded-2xl">
                <label class="text-[8px] font-black text-red-400 uppercase block mb-1">Valor Anterior</label>
                <p class="text-xs font-mono font-bold text-red-700 line-through">{{ solicitudActiva.valor_viejo }}</p>
              </div>
              <div class="p-5 bg-green-50/50 border border-green-100 rounded-2xl">
                <label class="text-[8px] font-black text-green-400 uppercase block mb-1">Valor Propuesto</label>
                <p class="text-xs font-mono font-bold text-green-700">{{ solicitudActiva.valor_nuevo }}</p>
              </div>
            </div>

            <div v-if="solicitudActiva.estatus === 'RECHAZADA'" class="p-4 bg-red-600 text-white rounded-2xl animate-pulse">
               <p class="text-[10px] font-black uppercase tracking-widest mb-1 text-center">⚠️ Motivo de Rechazo</p>
               <p class="text-xs text-center font-medium">El VIN proporcionado no coincide con la calcomanía de la puerta.</p>
            </div>
          </div>

          <button @click="modalAbierto = false" class="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-10 hover:bg-slate-900 transition-all shadow-xl shadow-slate-200">
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EyeIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

const filtroActual = ref('TODAS')
const modalAbierto = ref(false)
const solicitudActiva = ref(null)

const statusStyles = {
  'PENDIENTE': 'bg-amber-50 text-amber-600 border-amber-100',
  'ACEPTADA': 'bg-green-50 text-green-600 border-green-100',
  'RECHAZADA': 'bg-red-50 text-red-600 border-red-100'
}

// Datos de prueba (Basados en tu modelo Django SolicitudEdicion)
const solicitudes = ref([
  {
    id: '882',
    fecha_solicitud: '08 MAR 2026',
    campo_afectado: 'NUM_SERIE (VIN)',
    justificacion: 'Error de captura durante el ingreso nocturno. Falta un carácter.',
    valor_viejo: '1F6HF2G34HB1023',
    valor_nuevo: '1F6HF2G34HB1023X',
    estatus: 'PENDIENTE'
  },
  {
    id: '875',
    fecha_solicitud: '05 MAR 2026',
    campo_afectado: 'PLACAS',
    justificacion: 'Dígito incorrecto por desgaste de placa física.',
    valor_viejo: 'XAB-123',
    valor_nuevo: 'XAB-124',
    estatus: 'ACEPTADA'
  }
])

const filtradas = computed(() => {
  if (filtroActual.value === 'TODAS') return solicitudes.value
  return solicitudes.value.filter(s => s.estatus === filtroActual.value)
})

const verDetalle = (sol) => {
  solicitudActiva.value = sol
  modalAbierto.value = true
}
</script>