export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        track: {
          lane: "#8B0000",
          field: "#FFD700",
          sky: "#FFED4E",
          ink: "#1F1F1F"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(20, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};
