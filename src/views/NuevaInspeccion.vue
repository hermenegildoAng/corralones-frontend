<template>
  <div class="p-4 md:p-10 space-y-8">
    <div class="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
      
      <header class="bg-slate-800 p-10 text-white flex justify-between items-center">
        <div>
          <span class="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Auditoría de Registro</span>
          <h1 class="text-3xl font-black tracking-tighter uppercase mt-2">Inspección Administrativa</h1>
          <p class="text-slate-400 text-xs font-bold mt-1 uppercase">Validando Folio: {{ ingreso.folio }}</p>
        </div>
        <div :class="['w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-xs transition-all', colorResultado]">
          {{ form.resultado }}
        </div>
      </header>

      <div class="p-8 md:p-12 space-y-10">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="check in checks" :key="check.model" 
               class="flex items-center justify-between p-6 rounded-3xl border transition-all"
               :class="form[check.model] ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'">
            <div class="flex flex-col">
              <span class="text-[10px] font-black uppercase tracking-widest" :class="form[check.model] ? 'text-green-600' : 'text-red-600'">
                {{ check.label }}
              </span>
              <p class="text-xs font-bold text-slate-500 mt-1">{{ form[check.model] ? 'Verificado y Correcto' : 'Presenta Anomalías' }}</p>
            </div>
            <button @click="form[check.model] = !form[check.model]" 
                    :class="['w-12 h-6 rounded-full transition-colors relative', form[check.model] ? 'bg-green-500' : 'bg-red-500']">
              <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', form[check.model] ? 'left-7' : 'left-1']"></div>
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Resultado de la Inspección</label>
          <div class="grid grid-cols-3 gap-4">
            <button v-for="res in RESULTADOS" :key="res.value"
                    @click="form.resultado = res.value"
                    :class="[
                      'py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2',
                      form.resultado === res.value ? 'bg-slate-800 text-white border-slate-800 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                    ]">
              {{ res.text }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Comentarios y Observaciones</label>
          <textarea v-model="form.observaciones_admin" rows="4" 
                    class="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-medium focus:ring-2 focus:ring-primario/20 outline-none resize-none"
                    placeholder="Escriba aquí los detalles encontrados durante la revisión..."></textarea>
        </div>

        <div class="flex gap-4 pt-6">
          <button @click="$router.back()" class="flex-1 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
          <button @click="guardarInspeccion" class="flex-1 py-5 bg-primario text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primario/20 hover:scale-105 active:scale-95 transition-all">
            Finalizar Dictamen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const ingreso = ref({ folio: 'SMyT-2026-0412' }) // Simulado

const form = ref({
  identificacion_ok: true,
  inventario_ok: true,
  estado_fisico_ok: true,
  documentacion_ok: true,
  resultado: 'APROBADO',
  observaciones_admin: ''
})

const checks = [
  { model: 'identificacion_ok', label: 'Datos ID (Placas/VIN)' },
  { model: 'inventario_ok', label: 'Inventario Físico' },
  { model: 'estado_fisico_ok', label: 'Daños Físicos (Fotos)' },
  { model: 'documentacion_ok', label: 'Documentación' }
]

const RESULTADOS = [
  { value: 'APROBADO', text: 'Aprobar' },
  { value: 'RECHAZADO', text: 'Rechazar' },
  { value: 'OBSERVADO', text: 'Observaciones' }
]

const colorResultado = computed(() => {
  if (form.value.resultado === 'APROBADO') return 'border-green-500 text-green-500'
  if (form.value.resultado === 'RECHAZADO') return 'border-red-500 text-red-500'
  return 'border-amber-500 text-amber-500'
})

const guardarInspeccion = () => {
  alert('Inspección guardada y sincronizada con el folio ' + ingreso.value.folio)
}
</script>