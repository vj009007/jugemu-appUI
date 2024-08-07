import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        initial: "initial",

        accent: {
          foreground: "#65EDFF",
          emphasis: "rgba(101, 237, 255, 0.12)",
          muted: "rgba(101, 237, 255, 0.8)",
          subtle: "rgba(225, 56, 253, 0.15)",
        },
        foreground: {
          DEFAULT: "#101112",
          onEmphasis: "#18191B",
          muted: "#6E7781",
          subtle: "rgba(255, 255, 255, 0.04)",
          inset: "rgba(255, 255, 255, 0.08)",
        },
        canvas: {
          DEFAULT: "#FFFFFF",
          overlay: "#FFFFFF",
          subtle: "#F6F8FA",
          subtleStrong: "#F1F4F7",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.12)",
          muted: "rgba(216, 222, 228, 0.6)",
          subtle: "rgba(27, 31, 36, 0.15)",
          inset: "rgba(255, 255, 255, 0.4)",
        },
      },
      opacity: {
        "15": "0.15",
      },
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        hide: "hide 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
