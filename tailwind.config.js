module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primaryHover)",
        background: "var(--color-background)",
        inputBackground: "var(--color-inputBackground)",
        text: "var(--color-text)",
        error: "var(--color-error)",
        border: "var(--color-border)",
        buttonText: "var(--color-buttonText)",
        disabled: "var(--color-disabled)",
      },
    },
  },
  plugins: [],
};