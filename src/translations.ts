export const translations = {
  EN: {
    title: "VaultWares Documentation",
    tagline: "Privacy first. Security in service.",
    theme: "Theme",
    mode: "Mode",
    lang: "Language",
    search: "Search...",
    gettingStarted: "Getting Started",
    hardware: "Hardware",
    software: "Software",
    apiReference: "API Reference",
    notFoundTitle: "Page Not Found",
    notFoundDesc: "The requested documentation page could not be found.",
    light: "Light",
    dark: "Dark",
  },
  QC: {
    title: "Documentation VaultWares",
    tagline: "La confidentialité d'abord. La sécurité au service.",
    theme: "Thème",
    mode: "Mode",
    lang: "Langue",
    search: "Rechercher...",
    gettingStarted: "Commencer",
    hardware: "Matériel",
    software: "Logiciel",
    apiReference: "Référence API",
    notFoundTitle: "Page Non Trouvée",
    notFoundDesc: "La page de documentation demandée est introuvable.",
    light: "Clair",
    dark: "Sombre",
  }
};

export type Lang = keyof typeof translations;
