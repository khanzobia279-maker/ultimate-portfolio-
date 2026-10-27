/** Colors read CSS variables, which GSAP tweens on theme change. */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { bg: "var(--bg)", fg: "var(--fg)", muted: "var(--muted)", card: "var(--card)", line: "var(--line)", accent: "var(--accent)" },
      fontFamily: { display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"], body: ['"Instrument Sans"', "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};
