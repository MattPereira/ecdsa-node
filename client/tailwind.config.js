/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  purge: ["./index.html", "./src/*.{vue,js,ts,jsx,tsx}"],
  content: [],
  theme: {
    extend: {
      colors: {
        tan: "rgb(237, 223, 214)",
        dark: "#222",
      },
      fontFamily: {
        cubano: ["cubano", "sans-serif"],
        gothic: ["didact gothic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
