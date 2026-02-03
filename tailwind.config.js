/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        demos: {
          blue: "#2B36D9",
          orange: "#FF4808",
          magenta: "#FF35F9",
          cyan: "#00DAFF",
          dark: "#010109",
        },
      },
    },
  },
  plugins: [],
};
