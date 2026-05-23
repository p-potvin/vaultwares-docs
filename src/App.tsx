import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from './themes';
import type { Lang } from './translations';
import { translations } from './translations';
import './index.css';

type FrontmatterData = {
  title?: string;
  description?: string;
};

function parseFrontmatter(raw: string): { content: string; data: FrontmatterData } {
  // Vite raw imports preserve CRLF, and the production inlined strings include
  // explicit `\r` escapes. Normalize first so delimiter matching is reliable.
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (!normalized.startsWith('---\n')) {
    return { content: normalized, data: {} };
  }

  const endIndex = normalized.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { content: normalized, data: {} };
  }

  const fmBlock = normalized.slice(4, endIndex).trim();
  const data: FrontmatterData = {};

  for (const line of fmBlock.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();
    value = value.replace(/^['"]/, '').replace(/['"]$/, '');

    if (key === 'title') data.title = value;
    if (key === 'description') data.description = value;
  }

  const content = normalized.slice(endIndex + '\n---\n'.length);
  return { content, data };
}

// ── Minimal-gold icon (mode-aware per vault-themes AGENTS.md) ─────────────────
const VaultIcon = ({ mode, className = 'w-8 h-8' }: { mode: 'light' | 'dark'; className?: string }) => (
  <img
    src={mode === 'dark' ? '/vaultwares-minimal-gold.png' : '/vaultwares-minimal-ink.png'}
    alt="VaultWares"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

// ── MDX Custom Components ─────────────────────────────────────────────────────
const Card = ({ title, icon, href, children }: { title: string; icon: string; href: string; children: React.ReactNode }) => (
  <Link
    to={href}
    className="group p-6 rounded-xl border border-border bg-surface-alt transition-all duration-200 block no-underline mb-4 hover:bg-surface-elevated hover:border-accent"
  >
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg transition-colors bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]">
        <span className="text-xl text-accent">
          {icon === 'rocket' ? '🚀' : icon === 'microchip' ? '🔬' : icon === 'shield-halved' || icon === 'shield-check' ? '🛡️' : icon === 'code' ? '💻' : icon === 'headset' ? '🎧' : icon === 'envelope' ? '✉️' : icon === 'circle-question' ? '❓' : '📁'}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1 mt-0 transition-colors text-text-primary group-hover:text-accent">{title}</h3>
        <div className="text-sm leading-relaxed text-text-secondary">{children}</div>
      </div>
    </div>
  </Link>
);

const CardGroup = ({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) => (
  <div className="grid gap-4 my-8" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
    {children}
  </div>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 my-6 rounded-r-lg bg-info-bg border-l-[3px] border-info">
    <div className="flex gap-3">
      <span className="font-bold text-info">ℹ️</span>
      <div className="text-sm text-text-secondary">{children}</div>
    </div>
  </div>
);

// Steps/Step are Mintlify MDX components used in some docs — render gracefully
const Steps = ({ children }: { children: React.ReactNode }) => (
  <ol className="space-y-4 my-6 pl-0 list-none">{children}</ol>
);

const Step = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <li className="flex gap-4 p-4 rounded-lg bg-surface-alt border border-border">
    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 bg-accent text-text-inverse">
      ›
    </div>
    <div>
      <div className="font-semibold mb-1 text-text-primary">{title}</div>
      <div className="text-sm text-text-secondary">{children}</div>
    </div>
  </li>
);

// ── MDX glob ─────────────────────────────────────────────────────────────────
const mdxModules = import.meta.glob('../docs-content/**/*.mdx', { query: '?raw', import: 'default' });

// ── Nav structure (mirrors docs.json exactly) ─────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'Getting started',
    labelFR: 'Commencer',
    icon: '🚀',
    links: [
      { to: '/getting-started/overview', labelEN: 'Overview', labelFR: 'Aperçu' },
      { to: '/getting-started/products-and-services', labelEN: 'Products & services', labelFR: 'Produits et services' },
      { to: '/getting-started/system-requirements', labelEN: 'System requirements', labelFR: 'Configuration requise' },
      { to: '/getting-started/quick-installation', labelEN: 'Quick installation', labelFR: 'Installation rapide' },
    ],
  },
  {
    label: 'Hardware',
    labelFR: 'Matériel',
    icon: '🔬',
    links: [
      { to: '/hardware/encrypted-storage', labelEN: 'Encrypted storage', labelFR: 'Stockage chiffré' },
      { to: '/hardware/hsm', labelEN: 'HSM', labelFR: 'HSM' },
      { to: '/hardware/biometric-devices', labelEN: 'Biometric devices', labelFR: 'Dispositifs biométriques' },
      { to: '/hardware/network-appliances', labelEN: 'Network appliances', labelFR: 'Appareils réseau' },
    ],
  },
  {
    label: 'Software',
    labelFR: 'Logiciel',
    icon: '💻',
    links: [
      { to: '/software/encryption-software', labelEN: 'Encryption software', labelFR: 'Logiciel de chiffrement' },
      { to: '/software/access-control', labelEN: 'Access control', labelFR: 'Contrôle d\'accès' },
      { to: '/software/backup-recovery', labelEN: 'Backup & recovery', labelFR: 'Sauvegarde et reprise' },
      { to: '/software/security-monitoring', labelEN: 'Security monitoring', labelFR: 'Surveillance sécurité' },
    ],
  },
  {
    label: 'Installation',
    labelFR: 'Installation',
    icon: '🔧',
    links: [
      { to: '/installation/hardware-installation', labelEN: 'Hardware installation', labelFR: 'Installation matérielle' },
      { to: '/installation/software-deployment', labelEN: 'Software deployment', labelFR: 'Déploiement logiciel' },
      { to: '/installation/initial-configuration', labelEN: 'Initial configuration', labelFR: 'Configuration initiale' },
      { to: '/installation/integration-guides', labelEN: 'Integration guides', labelFR: 'Guides d\'intégration' },
    ],
  },
  {
    label: 'User guides',
    labelFR: 'Guides utilisateur',
    icon: '📖',
    links: [
      { to: '/guides/daily-operations', labelEN: 'Daily operations', labelFR: 'Opérations quotidiennes' },
      { to: '/guides/best-practices', labelEN: 'Best practices', labelFR: 'Meilleures pratiques' },
      { to: '/guides/troubleshooting', labelEN: 'Troubleshooting', labelFR: 'Dépannage' },
      { to: '/guides/maintenance', labelEN: 'Maintenance', labelFR: 'Maintenance' },
    ],
  },
  {
    label: 'Operations (Private)',
    labelFR: 'Opérations (Privé)',
    icon: '🛠️',
    links: [
      { to: '/operations/network-map', labelEN: 'Network map', labelFR: 'Carte du réseau' },
      { to: '/operations/tailscale', labelEN: 'Tailscale', labelFR: 'Tailscale' },
      { to: '/operations/secrets', labelEN: 'Secrets', labelFR: 'Secrets' },
    ],
  },
  {
    label: 'Security & compliance',
    labelFR: 'Sécurité et conformité',
    icon: '🛡️',
    links: [
      { to: '/security/zero-knowledge-encryption-standard', labelEN: 'Zero-knowledge encryption', labelFR: 'Chiffrement zéro connaissance' },
      { to: '/security/encryption-protocols', labelEN: 'Encryption protocols', labelFR: 'Protocoles de chiffrement' },
      { to: '/security/certifications', labelEN: 'Certifications', labelFR: 'Certifications' },
      { to: '/security/industry-standards', labelEN: 'Industry standards', labelFR: 'Normes industrielles' },
      { to: '/compliance/gdpr', labelEN: 'GDPR', labelFR: 'RGPD' },
      { to: '/compliance/hipaa', labelEN: 'HIPAA', labelFR: 'HIPAA' },
      { to: '/compliance/pci-dss', labelEN: 'PCI DSS', labelFR: 'PCI DSS' },
      { to: '/compliance/data-residency', labelEN: 'Data residency', labelFR: 'Résidence des données' },
    ],
  },
  {
    label: 'API reference',
    labelFR: 'Référence API',
    icon: '⚡',
    links: [
      { to: '/api-reference/authentication', labelEN: 'Authentication', labelFR: 'Authentification' },
      { to: '/api-reference/endpoints', labelEN: 'Endpoints', labelFR: 'Points de terminaison' },
      { to: '/api-reference/webhooks', labelEN: 'Webhooks', labelFR: 'Webhooks' },
      { to: '/api-reference/sdk', labelEN: 'SDK', labelFR: 'SDK' },
    ],
  },
  {
    label: 'Support',
    labelFR: 'Assistance',
    icon: '🎧',
    links: [
      { to: '/support/faq', labelEN: 'FAQ', labelFR: 'FAQ' },
      { to: '/support/contact', labelEN: 'Contact', labelFR: 'Contact' },
      { to: '/support/warranty', labelEN: 'Warranty', labelFR: 'Garantie' },
      { to: '/support/rma', labelEN: 'RMA', labelFR: 'RMA' },
      { to: '/support/updates', labelEN: 'Updates', labelFR: 'Mises à jour' },
    ],
  },
  {
    label: 'AI tools',
    labelFR: 'Outils IA',
    icon: '🤖',
    links: [
      { to: '/ai-tools/claude-code', labelEN: 'Claude Code', labelFR: 'Claude Code' },
      { to: '/ai-tools/cursor', labelEN: 'Cursor', labelFR: 'Cursor' },
      { to: '/ai-tools/windsurf', labelEN: 'Windsurf', labelFR: 'Windsurf' },
      { to: '/ai-tools/assistant-protocols', labelEN: 'Assistant protocols', labelFR: 'Protocoles assistants' },
    ],
  },
  {
    label: 'Brand & voice',
    labelFR: 'Marque et voix',
    icon: '🎨',
    links: [
      { to: '/branding', labelEN: 'Branding', labelFR: 'Image de marque' },
    ],
  },
];

// ── Markdown viewer ───────────────────────────────────────────────────────────
function MarkdownViewer({ lang }: { lang: Lang }) {
  const { '*': path } = useParams();
  const [content, setContent] = useState<string>('');
  const t = translations[lang];

  useEffect(() => {
    // Normalize: strip leading slash if present
    const cleanPath = path ? path.replace(/^\/+/, '') : '';
    let filePath = cleanPath ? `../docs-content/${cleanPath}` : `../docs-content/index.mdx`;
    if (!filePath.endsWith('.mdx')) {
      filePath += '.mdx';
    }

    const loadContent = async () => {
      let module = mdxModules[filePath];
      // Attempt to load Quebecois translation if selected
      if (lang === 'QC') {
        const qcPath = filePath.replace('.mdx', '-QC.mdx');
        if (mdxModules[qcPath]) {
          module = mdxModules[qcPath];
        }
      }

      if (module) {
        try {
          const raw = await module() as string;
          const { content: mdxContent, data } = parseFrontmatter(raw);
          setContent(mdxContent);
          if (data.title) {
            document.title = `${data.title} | VaultWares`;
          }
        } catch (err) {
          // Keep the UI stable even if a page is malformed, but leave a trail for diagnosis.
          // eslint-disable-next-line no-console
          console.error('[docs] Failed to load page content', { filePath }, err);
          setContent(`# ${t.notFoundTitle}\n\n${t.notFoundDesc}`);
        }
      } else {
        // Try with index.mdx suffix for directory paths
        const indexPath = filePath.replace('.mdx', '/index.mdx');
        let indexModule = mdxModules[indexPath];
        
        if (lang === 'QC') {
          const indexQcPath = indexPath.replace('.mdx', '-QC.mdx');
          if (mdxModules[indexQcPath]) {
            indexModule = mdxModules[indexQcPath];
          }
        }

        if (indexModule) {
          try {
            const raw = await indexModule() as string;
            const { content: mdxContent, data } = parseFrontmatter(raw);
            setContent(mdxContent);
            if (data.title) {
              document.title = `${data.title} | VaultWares`;
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[docs] Failed to load index page content', { indexPath }, err);
            setContent(`# ${t.notFoundTitle}\n\n${t.notFoundDesc}`);
          }
        } else {
          setContent(`# ${t.notFoundTitle}\n\n${t.notFoundDesc}\n\n_Path tried: \`${filePath}\`_`);
        }
      }
    };
    loadContent();
  }, [path, lang, t]);

  return (
    <motion.div
      key={path}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="prose prose-vault max-w-none"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // @ts-expect-error - Custom MDX components
          Card,
          CardGroup,
          Note,
          Steps,
          Step,
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
function Sidebar({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  return (
    <nav className="py-4 px-3 space-y-6">
      {NAV_SECTIONS.map(section => (
        <div key={section.label}>
          <div
            className="flex items-center gap-2 px-3 mb-2"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            <span>{section.icon}</span>
            <span>{lang === 'QC' ? section.labelFR : section.label}</span>
          </div>
          <div className="space-y-0.5">
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? 'nav-active' : ''}`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                })}
                onMouseEnter={e => {
                  if (!(e.currentTarget as HTMLElement).classList.contains('nav-active')) {
                    (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--surface-elevated) 60%, transparent)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (!(e.currentTarget as HTMLElement).dataset.active) {
                    (e.currentTarget as HTMLElement).style.background = '';
                    (e.currentTarget as HTMLElement).style.color = '';
                  }
                }}
              >
                {lang === 'QC' ? link.labelFR : link.labelEN}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem('vw-theme-id') || 'golden-slate'
  );
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('vw-theme-mode') as 'light' | 'dark')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem('vw-lang') as Lang) || 'EN'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = translations[lang];
  const currentTheme = useMemo(() => THEMES.find(th => th.id === themeId) || THEMES[0], [themeId]);

  // Apply all theme tokens to :root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'id' && key !== 'mode') {
        root.style.setProperty(`--${key.replaceAll('_', '-')}`, value);
      }
    });
    root.setAttribute('data-mode', currentTheme.mode);
    localStorage.setItem('vw-theme-id', themeId);
    localStorage.setItem('vw-theme-mode', currentTheme.mode);
  }, [currentTheme, themeId]);

  useEffect(() => {
    localStorage.setItem('vw-lang', lang);
  }, [lang]);

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    if (newMode === 'dark' && currentTheme.mode !== 'dark') setThemeId('golden-slate');
    else if (newMode === 'light' && currentTheme.mode !== 'light') setThemeId('solarized-light-revisited');
  };

  const handleThemeChange = (id: string) => {
    const theme = THEMES.find(th => th.id === id);
    if (theme) {
      setThemeId(id);
      setMode(theme.mode);
    }
  };

  return (
    <BrowserRouter>
      <div
        id="app-root"
        className="min-h-screen flex flex-col font-sans transition-colors"
        style={{ background: 'var(--background)', color: 'var(--text)', transitionDuration: '300ms' }}
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header
          id="main-header"
          className="fixed top-0 left-0 right-0 z-[100] h-14 flex items-center px-4 border-b"
          style={{
            background: 'color-mix(in srgb, var(--surface) 88%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderColor: 'var(--border)',
            boxShadow: '0 1px 0 color-mix(in srgb, var(--border) 60%, transparent)',
          }}
        >
          <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-4">
            {/* Logo — responsive collapse: icon+title+tagline → icon+title → icon only */}
            <Link to="/" id="header-logo" className="flex items-center gap-2.5 min-w-0 shrink-0">
              <VaultIcon mode={currentTheme.mode} className="header-icon" />
              <div className="header-brand-text overflow-hidden">
                <div
                  className="header-title font-semibold leading-none whitespace-nowrap"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t.title}
                </div>
                <div
                  className="header-tagline whitespace-nowrap"
                  style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginTop: '1px',
                  }}
                >
                  {t.tagline}
                </div>
              </div>
            </Link>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme picker — hidden on small screens */}
              <div
                className="theme-picker hidden lg:flex items-center rounded-lg border p-1 gap-2"
                style={{ background: 'var(--surface-alt)', borderColor: 'var(--border)' }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    paddingLeft: '4px',
                  }}
                >
                  {t.theme}
                </span>
                <select
                  id="theme-select"
                  value={themeId}
                  onChange={e => handleThemeChange(e.target.value)}
                  className="bg-transparent text-xs font-medium px-2 py-1 outline-none cursor-pointer"
                  style={{ color: 'var(--text)' }}
                >
                  {THEMES.map(theme => (
                    <option key={theme.id} value={theme.id} style={{ background: 'var(--surface)' }}>
                      {t.themeNames[theme.id as keyof typeof t.themeNames] || theme.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode + lang toggles */}
              <div
                className="flex items-center rounded-full p-1 border"
                style={{ background: 'var(--surface-alt)', borderColor: 'var(--border)' }}
              >
                <button
                  id="toggle-mode"
                  onClick={toggleMode}
                  className="p-1.5 rounded-full transition-all active:scale-90"
                  style={{ color: 'var(--text)' }}
                  title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}
                >
                  {mode === 'dark' ? '☀️' : '🌙'}
                </button>
                <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />
                <button
                  id="toggle-lang"
                  onClick={() => setLang(lang === 'EN' ? 'QC' : 'EN')}
                  className="px-2 py-0.5 rounded-full transition-all active:scale-90 text-[10px] font-black"
                  style={{ color: 'var(--text)' }}
                  title={lang === 'EN' ? 'Basculer en français' : 'Switch to English'}
                >
                  {lang}
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 pt-14 max-w-[1400px] mx-auto w-full">
          {/* Sidebar — fixed on mobile, sticky on md+ */}
          <aside
            id="docs-sidebar"
            className={`${isMenuOpen ? 'fixed inset-0 top-14 z-[90] block overflow-y-auto' : 'hidden'} md:block md:relative md:inset-auto md:w-60 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:overflow-y-auto border-r shrink-0`}
            style={{
              background: 'var(--background)',
              borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)',
            }}
          >
            <Sidebar lang={lang} onClose={() => setIsMenuOpen(false)} />
          </aside>

          {/* Content */}
          <main
            id="docs-content"
            className="flex-1 min-w-0 px-6 py-10 md:px-10 lg:px-16"
          >
            <AnimatePresence mode="wait">
              <Routes>
                {/* Redirect root to overview */}
                <Route path="/" element={<Navigate to="/getting-started/overview" replace />} />
                <Route path="/*" element={<MarkdownViewer lang={lang} />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
