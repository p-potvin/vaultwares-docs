export type DocsLang = 'EN' | 'QC'

export interface UiText {
  docsTitle: string
  subtitle: string
  pageMissingTitle: string
  pageMissingBody: string
  renderErrorTitle: string
  renderErrorBody: string
  missingIndex: string
}

export const UI_TEXT: Record<DocsLang, UiText> = {
  EN: {
    docsTitle: 'VaultWares Docs',
    subtitle: 'Privacy first. Security in service.',
    pageMissingTitle: 'Page Missing',
    pageMissingBody: 'This page is not available in this build.',
    renderErrorTitle: 'Render Error',
    renderErrorBody: 'The document could not be rendered. Please check source formatting.',
    missingIndex: 'Missing docs index page',
  },
  QC: {
    docsTitle: 'Documentation VaultWares',
    subtitle: 'Confidentialité d’abord. Sécurité en service.',
    pageMissingTitle: 'Page introuvable',
    pageMissingBody: 'Cette page n’est pas disponible dans cette version.',
    renderErrorTitle: 'Erreur de rendu',
    renderErrorBody: 'Le document n’a pas pu être affiché. Vérifiez le format source.',
    missingIndex: 'Page index de la documentation introuvable',
  },
}

export const SECTION_ORDER = [
  'root',
  'getting-started',
  'essentials',
  'hardware',
  'software',
  'installation',
  'guides',
  'operations',
  'security',
  'compliance',
  'api-reference',
  'support',
  'ai-tools',
  'branding',
] as const

export const SECTION_LABELS: Record<DocsLang, Record<string, string>> = {
  EN: {
    root: 'Overview',
    'getting-started': 'Getting Started',
    essentials: 'Essentials',
    hardware: 'Hardware',
    software: 'Software',
    installation: 'Installation',
    guides: 'Guides',
    operations: 'Operations',
    security: 'Security',
    compliance: 'Compliance',
    'api-reference': 'API Reference',
    support: 'Support',
    'ai-tools': 'AI Tools',
    branding: 'Branding',
  },
  QC: {
    root: 'Aperçu',
    'getting-started': 'Commencer',
    essentials: 'Essentiels',
    hardware: 'Matériel',
    software: 'Logiciel',
    installation: 'Installation',
    guides: 'Guides',
    operations: 'Opérations',
    security: 'Sécurité',
    compliance: 'Conformité',
    'api-reference': 'Référence API',
    support: 'Assistance',
    'ai-tools': 'Outils IA',
    branding: 'Image de marque',
  },
}
