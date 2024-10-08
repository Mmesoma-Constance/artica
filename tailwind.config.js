/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public//*.{html,js}"],
  theme: {
    extend: {
      screens: {
        lg: "980px",
        smlg: "1320px",
      },
    },
  },
  plugins: [],
};
