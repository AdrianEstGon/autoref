import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0066cc",
          foreground: "#ffffff",
          50: "#e6f2ff",
          100: "#cce5ff",
          500: "#0066cc",
          600: "#0052a3",
          700: "#003d7a",
        },
        secondary: {
          DEFAULT: "#fbbf24",
          foreground: "#1f2937",
          50: "#fef9e7",
          100: "#fef3c7",
          500: "#fbbf24",
          600: "#f59e0b",
        },
        accent: {
          DEFAULT: "#f8fafc",
          foreground: "#0f172a",
        },
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#0066cc",
        background: "#ffffff",
        foreground: "#0f172a",
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
