// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // ainda é bom manter este se você estiver usando um arquivo HTML principal
    "./src/**/*.{js,jsx,ts,tsx}", // isso já abrange o App.jsx e outros componentes
    "./src/App.jsx",
    "./src/main.jsx" // inclui o arquivo App.jsx diretamente, embora o padrão já cobre
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A9D8F', 
        secondary: '#264653', 
        background: '#F4F4F9', 
        text: '#1D3557', 
        accent: '#E76F51',
      },
    },
  },
  plugins: [],
};
