
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          dark: "hsl(var(--border-dark))",
        },
        input: {
          DEFAULT: "hsl(var(--input))",
          dark: "hsl(var(--input-dark))",
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
          dark: "hsl(var(--ring-dark))",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          dark: "hsl(222 20% 18%)",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          dark: "hsl(0 0% 98%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(0 0% 98%)",
          "dark-foreground": "hsl(240 5.9% 10%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          dark: "hsl(240 3.7% 15.9%)",
          "dark-foreground": "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          dark: "hsl(240 3.7% 15.9%)",
          "dark-foreground": "hsl(240 5% 64.9%)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          dark: "hsl(240 3.7% 15.9%)",
          "dark-foreground": "hsl(0 0% 98%)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
          dark: "hsl(240 10% 3.9%)",
          "dark-foreground": "hsl(0 0% 98%)",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          dark: "hsl(240 10% 3.9%)",
          "dark-foreground": "hsl(0 0% 98%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
