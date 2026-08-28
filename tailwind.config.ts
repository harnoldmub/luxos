import type { Config } from "tailwindcss";

/**
 * Luxos RDC — Design system « Terre & Or architectural »
 * Le luxe vient de la typographie, des proportions et du blanc, pas des effets.
 * Les clés de couleur historiques (or / encre / ivoire / creme / rdc) sont conservées
 * pour la refonte progressive ; seules les valeurs sont affinées + le système étendu.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Archivo", "system-ui", "sans-serif"]
      },
      colors: {
        // Or — accent signature
        or: {
          DEFAULT: "#B8902F",
          clair: "#C9A24B",
          pale: "#EBDCB6",
          fond: "#F6EFDD",
          deep: "#8C6D22" // pour texte or lisible sur fond clair (AA)
        },
        // Encre — texte & sections sombres éditoriales
        encre: {
          DEFAULT: "#16140F",
          soft: "#3A362B",
          muted: "#6B6455" // texte secondaire lisible
        },
        // Surfaces claires
        ivoire: "#FBF6EA",
        blanc: "#FCFAF4",
        creme: "#F3ECDD",
        sable: "#EFE7D6",
        // Ligne / bordures chaudes
        ligne: "#E4D9C2",
        // Accents fonctionnels (statuts uniquement — pas de décor drapeau)
        rdc: {
          green: "#2E7D5B",
          blue: "#2C5BA8",
          red: "#B23A2E"
        }
      },
      fontSize: {
        // Échelle éditoriale fluide pour les display
        "display-xl": ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 5.2vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.018em" }],
        "display-md": ["clamp(2rem, 3.6vw, 3.25rem)", { lineHeight: "1.06", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.6rem, 2.4vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        eyebrow: ["0.72rem", { lineHeight: "1", letterSpacing: "0.24em" }]
      },
      letterSpacing: {
        eyebrow: "0.24em",
        label: "0.14em"
      },
      maxWidth: {
        prose: "62ch"
      },
      borderRadius: {
        // Bords quasi nets — architectural
        sm: "2px",
        DEFAULT: "4px",
        lg: "8px",
        xl: "12px"
      },
      boxShadow: {
        // Ombres basses et diffuses uniquement
        luxos: "0 30px 70px -40px rgba(22,20,15,.45)",
        soft: "0 12px 34px -20px rgba(22,20,15,.28)",
        card: "0 1px 0 0 rgba(22,20,15,.04), 0 18px 40px -30px rgba(22,20,15,.30)",
        float: "0 24px 60px -28px rgba(22,20,15,.40)"
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: ".6" },
          "100%": { transform: "scale(1.6)", opacity: "0" }
        }
      },
      animation: {
        fadeUp: "fadeUp .8s cubic-bezier(0.22,1,0.36,1) forwards",
        pulseRing: "pulseRing 2.4s cubic-bezier(0.22,1,0.36,1) infinite"
      }
    }
  },
  plugins: []
};

export default config;
