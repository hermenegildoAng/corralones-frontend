import { defineStore } from 'pinia'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 🔄 Cambiamos a sessionStorage para que cada pestaña sea independiente
    token:           sessionStorage.getItem('access_token') || null,
    rol:             sessionStorage.getItem('user_role') || null,
    nombre_user:     sessionStorage.getItem('user_name') || '',
    id_deposito:     sessionStorage.getItem('user_deposito') || null,
    nombre_deposito: sessionStorage.getItem('user_deposito_nombre') || null,
    user_id:         sessionStorage.getItem('user_id') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    login(userData) {
      this.token           = userData.access
      this.rol             = userData.rol
      this.id_deposito     = userData.id_deposito
      this.nombre_user     = userData.nombre_user
      this.nombre_deposito = userData.nombre_deposito
      this.user_id         = userData.user_id

      // 🔥 Guardamos en sessionStorage (Se borra al cerrar la pestaña)
      sessionStorage.setItem('access_token', userData.access)
      sessionStorage.setItem('user_role', userData.rol)
      sessionStorage.setItem('user_name', userData.nombre_user)
      sessionStorage.setItem('user_deposito', userData.id_deposito)
      sessionStorage.setItem('user_deposito_nombre', userData.nombre_deposito)
      sessionStorage.setItem('user_id', String(userData.user_id))
      
      // Opcional: Guardar el objeto completo para que el router lo lea fácil
      sessionStorage.setItem('user_data', JSON.stringify(userData))
    },

    logout() {
      this.$reset()

      // 🧹 Limpieza total de la sesión de esta pestaña
      sessionStorage.clear() 

      router.push('/')
    }
  }
})