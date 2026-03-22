<template>
  <div class="px-8 py-5 flex items-center justify-between">

    <!-- Info página -->
    <span class="text-[9px] font-black text-black uppercase tracking-widest">
      Página {{ modelValue }} de {{ totalPaginas }}
    </span>

    <!-- Controles -->
    <div class="flex items-center gap-2">

      <!-- Anterior -->
      <button
        @click="cambiar(modelValue - 1)"
        :disabled="modelValue === 1"
        class="px-4 py-2 rounded-xl border border-slate-100 text-[9px] font-black text-black uppercase tracking-widest hover:border-primario/40 hover:text-primario disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← Anterior
      </button>

      <!-- Páginas con ventana deslizante -->
      <template v-for="p in paginasVisibles" :key="p">
        <!-- Elipsis -->
        <span
          v-if="p === '...'"
          class="w-9 h-9 flex items-center justify-center text-[9px] font-black text-slate-300"
        >
          ···
        </span>

        <!-- Número -->
        <button
          v-else
          @click="cambiar(p)"
          :class="[
            'w-9 h-9 rounded-xl text-[9px] font-black uppercase transition-all',
            p === modelValue
              ? 'bg-primario text-white shadow-lg shadow-primario/20'
              : 'border border-slate-100 text-slate-400 hover:border-primario/40 hover:text-primario'
          ]"
        >
          {{ p }}
        </button>
      </template>

      <!-- Siguiente -->
      <button
        @click="cambiar(modelValue + 1)"
        :disabled="modelValue === totalPaginas"
        class="px-4 py-2 rounded-xl border border-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-primario/40 hover:text-primario disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Siguiente →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// ─── PROPS ────────────────────────────────────────────────────
const props = defineProps({
  /** Página actual — usar con v-model */
  modelValue: {
    type: Number,
    required: true,
  },
  /** Total de páginas calculado por el padre */
  totalPaginas: {
    type: Number,
    required: true,
  },
  /**
   * Cuántos números mostrar alrededor de la página activa.
   * Ej: delta=1 → [ 1 ... 4 5 6 ... 12 ] con activa=5
   */
  delta: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['update:modelValue'])

// ─── CAMBIAR PÁGINA ───────────────────────────────────────────
const cambiar = (p) => {
  if (p < 1 || p > props.totalPaginas) return
  emit('update:modelValue', p)
}

// ─── VENTANA DESLIZANTE CON ELIPSIS ──────────────────────────
const paginasVisibles = computed(() => {
  const total   = props.totalPaginas
  const current = props.modelValue
  const d       = props.delta

  if (total <= 7) {
    // Pocas páginas: mostrar todas sin elipsis
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const left  = Math.max(2, current - d)
  const right = Math.min(total - 1, current + d)

  const pages = [1]

  if (left > 2)       pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')

  pages.push(total)

  return pages
})
</script>