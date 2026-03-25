<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
    <div class="flex items-center gap-2 mb-6">
      <ClipboardDocumentListIcon class="w-6 h-6 text-slate-600" />
      <h2 class="text-lg font-black text-slate-800 uppercase tracking-tight">
        Pendientes del Sistema
      </h2>
    </div>

    <div class="relative flex gap-2 mb-6">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <PencilSquareIcon class="h-5 w-5 text-slate-400" />
      </div>
      <input
        v-model="nuevo"
        @keyup.enter="agregar"
        type="text"
        placeholder="Añadir nueva tarea..."
        class="flex-1 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
      />
      <button
        @click="agregar"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-sm shadow-indigo-200 active:scale-95 flex items-center gap-1"
      >
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">Añadir</span>
      </button>
    </div>

    <div class="overflow-y-auto pr-2 custom-scrollbar" style="max-height: 280px;">
      <transition-group name="list" tag="ul" class="space-y-3">
        <li
          v-for="(item, index) in lista"
          :key="index"
          class="group flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 px-4 py-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all"
        >
          <div class="flex items-center gap-3">
            <label class="relative flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="item.done" 
                @change="guardar"
                class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:bg-indigo-600 checked:border-indigo-600 transition-all" 
              />
              <CheckIcon class="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </label>
            
            <span 
              :class="item.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'"
              class="text-sm transition-all"
            >
              {{ item.texto }}
            </span>
          </div>

          <button
            @click="eliminar(index)"
            class="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            title="Eliminar tarea"
          >
            <TrashIcon class="w-5 h-5" />
          </button>
        </li>
      </transition-group>

      <div v-if="lista.length === 0" class="flex flex-col items-center justify-center py-10 text-slate-300">
        <CheckCircleIcon class="w-12 h-12 mb-2 opacity-20" />
        <p class="text-xs font-bold uppercase tracking-widest">Todo al día</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Importación de Heroicons
import { 
  ClipboardDocumentListIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon,
  PencilSquareIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const lista = ref([])
const nuevo = ref('')

onMounted(() => {
  const data = localStorage.getItem('pendientes')
  if (data) lista.value = JSON.parse(data)
})

const guardar = () => {
  localStorage.setItem('pendientes', JSON.stringify(lista.value))
}

const agregar = () => {
  if (!nuevo.value.trim()) return
  lista.value.unshift({ // .unshift para que el nuevo aparezca arriba
    texto: nuevo.value,
    done: false
  })
  nuevo.value = ''
  guardar()
}

const eliminar = (index) => {
  lista.value.splice(index, 1)
  guardar()
}
</script>

<style scoped>
/* Animaciones para la lista */
.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Scrollbar personalizada */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>