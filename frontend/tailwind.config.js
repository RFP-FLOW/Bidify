export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#fff5d7",
        primary: "#3a2d97",
        blackPure: "#000000",
        grayText: "#555555",
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
      },
    },
  },
  plugins: [],
};
