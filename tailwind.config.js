/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // animation
      animation: {
        loader: 'loader 0.6s infinite alternate'
      },
      keyframes: {
        loader: {
          to: {
            opacity: 0.1,
            transform: 'translate3d(0, -1rem, 0)'
          }
        }
      },

      colors: {
        primary: "#f3e5f5",
        secondary: "#ce93d8",
        accent: "#ab47bc",
      },
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "600px",
        md: "720px",
        lg: "984px",
        xl: "1240px",
        "2xl": "1496px",
      },
    },


  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  corePlugins: {
    preflight: false,
  },
};