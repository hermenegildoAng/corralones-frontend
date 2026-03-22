<template>
  <div class="p-4 md:p-10">
    <div class="max-w-7xl mx-auto">
      
      <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-[10px] font-black text-rosa-comp uppercase tracking-[0.3em]">Módulo de Auditoría</span>
          <div class="flex items-center gap-3 mt-2">
            <div class="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-200">
              <PencilSquareIcon class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-3xl font-black text-slate-800 tracking-tighter uppercase">Solicitudes de Edición</h1>
          </div>
          <p class="text-slate-400 text-sm font-medium mt-2">Control de cambios y rectificación de datos oficiales.</p>
        </div>
        
        <button class="bg-primario text-white px-8 py-4 rounded-2xl hover:bg-primario/90 transition-all shadow-xl shadow-primario/20 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
          <PlusIcon class="w-5 h-5" /> Nueva Solicitud
        </button>
      </header>

      <div class="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/50">
              <tr>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Folio / Fecha</th>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Solicitante</th>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Campo Afectado</th>
                <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus</th>
                <th class="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="sol in solicitudes" :key="sol.id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-800">REQ-{{ sol.id }}</span>
                    <span class="text-[10px] text-slate-400 font-bold uppercase">{{ sol.fecha_solicitud }}</span>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span class="text-xs font-bold text-slate-600 uppercase italic">@{{ sol.usuario_solicito }}</span>
                </td>
                <td class="px-8 py-6">
                  <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-slate-200">
                    {{ sol.campo_afectado }}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <span :class="['px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border', statusStyles[sol.estatus]]">
                    {{ sol.estatus }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center">
                  <button @click="abrirRevision(sol)" class="p-3 text-slate-400 hover:text-primario hover:bg-primario/5 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="modalAbierto" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div class="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          
          <div class="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
              <span class="text-[9px] font-black text-primario uppercase tracking-[0.3em]">Revisión Técnica</span>
              <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase">Solicitud REQ-{{ solicitudActiva.id }}</h2>
              <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">ID Registro Afectado: #{{ solicitudActiva.registro_id }}</p>
            </div>
            <button @click="modalAbierto = false" class="text-slate-300 hover:text-red-500 transition-colors">
              <XMarkIcon class="w-8 h-8" />
            </button>
          </div>

          <div class="p-10 space-y-8">
            <div class="bg-amber-50/50 border border-amber-100 p-6 rounded-4xl relative">
              <span class="absolute -top-3 left-6 bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Justificación del Operador</span>
              <p class="text-sm text-amber-900 font-medium italic leading-relaxed">
                "{{ solicitudActiva.justificacion }}"
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Valor Original (Viejo)</span>
                <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-400">
                  <p class="text-[9px] font-black uppercase opacity-50 mb-2">{{ solicitudActiva.campo_afectado }}</p>
                  <p class="text-lg font-mono font-bold break-all line-through opacity-60">{{ solicitudActiva.valor_viejo }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <span class="text-[10px] font-black text-primario uppercase tracking-widest ml-4">Propuesta de Cambio</span>
                <div class="p-6 bg-primario/5 border border-primario/10 rounded-[2rem] text-primario shadow-inner">
                  <p class="text-[9px] font-black uppercase opacity-50 mb-2">{{ solicitudActiva.campo_afectado }}</p>
                  <p class="text-lg font-mono font-black break-all">{{ solicitudActiva.valor_nuevo }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex flex-col md:flex-row justify-end gap-4">
            <button @click="modalAbierto = false" class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">
              Cerrar Vista
            </button>
            <div class="flex gap-2">
              <button class="px-8 py-4 text-[10px] font-black bg-white text-red-600 border border-red-100 hover:bg-red-50 rounded-2xl shadow-sm transition-all uppercase tracking-widest">
                Rechazar
              </button>
              <button class="px-8 py-4 text-[10px] font-black bg-slate-800 text-white hover:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 transition-all uppercase tracking-widest">
                Aprobar y Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PlusIcon, EyeIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

const modalAbierto = ref(false)
const solicitudActiva = ref(null)

const statusStyles = {
  'PENDIENTE': 'bg-amber-50 text-amber-600 border-amber-100',
  'ACEPTADA': 'bg-green-50 text-green-600 border-green-100',
  'RECHAZADA': 'bg-red-50 text-red-600 border-red-100'
}

// Datos de prueba basados estrictamente en tu modelo de Python
const solicitudes = ref([
  {
    id: '882',
    fecha_solicitud: '08 MAR 2026',
    registro_id: 1045,
    usuario_solicito: 'operador_norte',
    campo_afectado: 'NUM_SERIE (VIN)',
    justificacion: 'El operador cometió un error de dedo en el VIN inicial durante el ingreso nocturno. Falta un carácter al final del folio.',
    valor_viejo: '1F6HF2G34HB1023',
    valor_nuevo: '1F6HF2G34HB1023X',
    estatus: 'PENDIENTE'
  }
])

const abrirRevision = (solicitud) => {
  solicitudActiva.value = solicitud
  modalAbierto.value = true
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateY(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateY(-20px); }
</style>