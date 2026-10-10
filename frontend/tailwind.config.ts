import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F3EE",
        bone: "#EDE8DF",
        ink: "#16171A",
        charcoal: "#1E2024",
        graphite: "#2B2E33",
        steel: "#6B6F76",
        line: "#DDD7CC",
        // Rose pink accent theme.
        amber: {
          DEFAULT: "#E11D48",
          deep: "#BE123C",
          soft: "#FFE4E6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22,23,26,.04), 0 12px 32px -12px rgba(22,23,26,.18)",
        lift: "0 24px 60px -24px rgba(22,23,26,.35)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "none" } },
        drift: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "success-heartbeat": { "0%, 42%, 100%": { transform: "scale(1)" }, "10%": { transform: "scale(1.012)" }, "20%": { transform: "scale(1)" }, "30%": { transform: "scale(1.008)" } },
      },
      animation: {
        rise: "rise .8s cubic-bezier(.2,.7,.2,1) both",
        drift: "drift 40s linear infinite",
        "success-heartbeat": "success-heartbeat 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
