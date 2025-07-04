/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px 0 rgba(0, 0, 0, 0.1)",
        medium: "0 4px 20px 0 rgba(0, 0, 0, 0.15)",
        strong: "0 8px 30px 0 rgba(0, 0, 0, 0.2)",
        "neon-blue": "0 0 20px rgba(59, 130, 246, 0.5)",
        "neon-green": "0 0 20px rgba(34, 197, 94, 0.5)",
        "neon-purple": "0 0 20px rgba(147, 51, 234, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Menlo",
          "monospace",
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "carbon-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [
    // Custom utilities
    function ({ addUtilities, addComponents, theme }) {
      // Glass morphism utilities
      addUtilities({
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".text-gradient": {
          background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-gradient-green": {
          background: "linear-gradient(45deg, #10b981, #34d399, #6ee7b7)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".scroll-smooth": {
          "scroll-behavior": "smooth",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });

      // Card components
      addComponents({
        ".card": {
          background: theme("colors.white"),
          "border-radius": theme("borderRadius.xl"),
          padding: theme("spacing.6"),
          "box-shadow": theme("boxShadow.soft"),
          border: `1px solid ${theme("colors.gray.200")}`,
          transition: "all 0.3s ease",
        },
        ".card-hover": {
          "&:hover": {
            transform: "translateY(-2px)",
            "box-shadow": theme("boxShadow.medium"),
          },
        },
        ".card-gradient": {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: theme("colors.white"),
          border: "none",
        },
        ".card-glass": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: theme("colors.white"),
        },
        ".btn-primary": {
          background: theme("colors.primary.600"),
          color: theme("colors.white"),
          padding: `${theme("spacing.3")} ${theme("spacing.6")}`,
          "border-radius": theme("borderRadius.lg"),
          "font-weight": theme("fontWeight.semibold"),
          transition: "all 0.2s ease",
          border: "none",
          cursor: "pointer",
          "&:hover": {
            background: theme("colors.primary.700"),
            transform: "translateY(-1px)",
            "box-shadow": theme("boxShadow.medium"),
          },
          "&:active": {
            transform: "translateY(0)",
          },
          "&:disabled": {
            opacity: "0.6",
            cursor: "not-allowed",
            transform: "none",
          },
        },
        ".btn-secondary": {
          background: theme("colors.gray.100"),
          color: theme("colors.gray.700"),
          padding: `${theme("spacing.3")} ${theme("spacing.6")}`,
          "border-radius": theme("borderRadius.lg"),
          "font-weight": theme("fontWeight.semibold"),
          transition: "all 0.2s ease",
          border: `1px solid ${theme("colors.gray.300")}`,
          cursor: "pointer",
          "&:hover": {
            background: theme("colors.gray.200"),
            transform: "translateY(-1px)",
            "box-shadow": theme("boxShadow.soft"),
          },
        },
        ".input-field": {
          width: "100%",
          padding: `${theme("spacing.3")} ${theme("spacing.4")}`,
          border: `1px solid ${theme("colors.gray.300")}`,
          "border-radius": theme("borderRadius.lg"),
          transition: "all 0.2s ease",
          background: theme("colors.white"),
          "&:focus": {
            outline: "none",
            "border-color": theme("colors.primary.500"),
            "box-shadow": `0 0 0 3px ${theme("colors.primary.100")}`,
          },
        },
        ".metric-card": {
          background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
          color: theme("colors.white"),
          padding: theme("spacing.6"),
          "border-radius": theme("borderRadius.xl"),
          "text-align": "center",
          "box-shadow": theme("boxShadow.soft"),
        },
        ".alert-card": {
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
          color: theme("colors.white"),
          padding: theme("spacing.6"),
          "border-radius": theme("borderRadius.xl"),
          "box-shadow": theme("boxShadow.soft"),
        },
        ".success-card": {
          background: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
          color: theme("colors.white"),
          padding: theme("spacing.6"),
          "border-radius": theme("borderRadius.xl"),
          "box-shadow": theme("boxShadow.soft"),
        },
        ".ranking-card": {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: theme("colors.white"),
          padding: theme("spacing.6"),
          "border-radius": theme("borderRadius.xl"),
          "box-shadow": theme("boxShadow.soft"),
        },
        ".chart-container": {
          background: theme("colors.white"),
          padding: theme("spacing.6"),
          "border-radius": theme("borderRadius.xl"),
          "box-shadow": theme("boxShadow.soft"),
          border: `1px solid ${theme("colors.gray.200")}`,
        },
      });
    },
  ],
};
