/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#0F766E",
        "primary-light": "#ccfbf1",
        "app-bg": "#F8FAFC",
        "surface": "#FFFFFF",
        "accent": "#0EA5E9",
        "text-primary": "#0F172A",
        "text-secondary": "#64748B",
        "error": "#F43F5E",
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        interMedium: ['Inter_500Medium'],
        interBold: ['Inter_700Bold'],
      }
    },
  },
  plugins: [],
}
