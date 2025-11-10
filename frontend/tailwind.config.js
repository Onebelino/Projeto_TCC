/** @type {import('tailwindcss').Config} */
export default {
  // 'content' diz ao Tailwind quais arquivos monitorar
  content: [
    "./index.html", // O HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Todos os seus componentes React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}