/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ahora 'font-sans' usará Plus Jakarta Sans
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        'primario': '#572671',   // Morado
        'secundario': '#FEE6C4', // Crema
        'rosa-comp': '#AA0365',  // Rosa
        'verde-comp': '#91ABA5', // Verde
      },
    },
  },
  plugins: [],
}