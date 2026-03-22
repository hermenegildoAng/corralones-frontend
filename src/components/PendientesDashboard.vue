<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
    <h2 class="text-lg font-black text-slate-800 mb-4">
      📝 Pendientes del Sistema
    </h2>

    <!-- Input -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="nuevo"
        @keyup.enter="agregar"
        type="text"
        placeholder="Escribe un pendiente..."
        class="flex-1 px-4 py-2 rounded-xl border border-slate-200 outline-none"
      />
      <button
        @click="agregar"
        class="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold"
      >
        +
      </button>
    </div>

    <!-- Lista -->
    <ul class="space-y-2 max-h-60 overflow-auto">
      <li
        v-for="(item, index) in lista"
        :key="index"
        class="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl"
      >
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="item.done" @change="guardar" />
          <span :class="item.done ? 'line-through text-slate-400' : ''">
            {{ item.texto }}
          </span>
        </div>

        <button
          @click="eliminar(index)"
          class="text-red-500 font-bold"
        >
          ✕
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const lista = ref([])
const nuevo = ref('')

// cargar
onMounted(() => {
  const data = localStorage.getItem('pendientes')
  if (data) lista.value = JSON.parse(data)
})

// guardar
const guardar = () => {
  localStorage.setItem('pendientes', JSON.stringify(lista.value))
}

// agregar
const agregar = () => {
  if (!nuevo.value.trim()) return

  lista.value.push({
    texto: nuevo.value,
    done: false
  })

  nuevo.value = ''
  guardar()
}

// eliminar
const eliminar = (index) => {
  lista.value.splice(index, 1)
  guardar()
}
</script>