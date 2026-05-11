import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import matter from 'gray-matter';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from './themes';
import type { Lang } from './translations';
import { translations } from './translations';
import './index.css';

// VaultWares Logo Component
const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L12 7M12 7L16 3M12 7L8 3M20 12H14M14 12L18 16M14 12L10 16M12 23V17M12 17L8 21M12 17L16 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Custom MDX Components
const Card = ({ title, icon, href, children }: { title: string; icon: string; href: string; children: React.ReactNode }) => (
  <Link to={href} className="group p-6 bg-surface-alt hover:bg-surface-elevated border border-border rounded-xl transition-all duration-300 block no-underline mb-4">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
        <span className="text-accent text-xl">{icon === 'rocket' ? '🚀' : icon === 'microchip' ? '🔬' : icon === 'shield-halved' ? '🛡️' : '📁'}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent transition-colors mt-0">{title}</h3>
        <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
      </div>
    </div>
  </Link>
);

const CardGroup = ({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4 my-8`}>
    {children}
  </div>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 my-6 bg-info-bg border-l-4 border-info rounded-r-lg">
    <div className="flex gap-3">
      <span className="text-info font-bold">ℹ️</span>
      <div className="text-sm text-text-secondary">{children}</div>
    </div>
  </div>
);

const mdxModules = import.meta.glob('../docs-content/**/*.mdx', { query: '?raw', import: 'default' });

function MarkdownViewer({ lang }: { lang: Lang }) {
  const { '*': path } = useParams();
  const [content, setContent] = useState<string>('');
  const t = translations[lang];

  useEffect(() => {
    let filePath = path ? `../docs-content/${path}` : `../docs-content/index.mdx`;
    if (!filePath.endsWith('.mdx')) {
      filePath += '.mdx';
    }
    
    const loadContent = async () => {
      const module = mdxModules[filePath];
      if (module) {
        try {
          const raw = await module() as string;
          const { content: mdxContent, data } = matter(raw);
          setContent(mdxContent);
          if (data.title) {
            document.title = `${data.title} | VaultWares`;
          }
        } catch {
          setContent(`# ${t.notFoundTitle}\n${t.notFoundDesc}`);
        }
      } else {
        setContent(`# ${t.notFoundTitle}\n${t.notFoundDesc}`);
      }
    };
    loadContent();
  }, [path, lang, t]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="prose prose-vault max-w-none"
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // @ts-expect-error - Custom MDX component
          Card,
          CardGroup,
          Note,
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}

export default function App() {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('vw-theme-id') || 'golden-slate');
  const [mode, setMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('vw-theme-mode') as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('vw-lang') as Lang) || 'EN');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = translations[lang];
  const currentTheme = useMemo(() => THEMES.find(t => t.id === themeId) || THEMES[0], [themeId]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'id' && key !== 'mode') {
        root.style.setProperty(`--${key.replace('_', '-')}`, value);
      }
    });
    localStorage.setItem('vw-theme-id', themeId);
    localStorage.setItem('vw-theme-mode', mode);
  }, [currentTheme, themeId, mode]);

  useEffect(() => {
    localStorage.setItem('vw-lang', lang);
  }, [lang]);

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    if (newMode === 'dark' && currentTheme.mode !== 'dark') setThemeId('golden-slate');
    else if (newMode === 'light' && currentTheme.mode !== 'light') setThemeId('codex-solarized-light-revisited');
  };

  const handleThemeChange = (id: string) => {
    const theme = THEMES.find(t => t.id === id);
    if (theme) {
      setThemeId(id);
      setMode(theme.mode);
    }
  };

  const navLinks = [
    { to: '/getting-started/overview', label: t.gettingStarted },
    { to: '/hardware/encrypted-storage', label: t.hardware },
    { to: '/software/encryption-software', label: t.software },
    { to: '/api-reference/authentication', label: t.apiReference },
  ];

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-text flex flex-col font-sans transition-colors duration-300">
        <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo className="w-8 h-8 text-accent group-hover:rotate-12 transition-transform duration-500" />
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg leading-none text-text-primary tracking-tight">{t.title}</h1>
                <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-text-muted mt-0.5">{t.tagline}</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center bg-surface-alt rounded-lg border border-border p-1 gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted pl-2">{t.theme}</span>
                <select 
                  value={themeId}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="bg-transparent text-text text-xs font-medium px-2 py-1 outline-none cursor-pointer"
                >
                  {THEMES.map(theme => (
                    <option key={theme.id} value={theme.id} className="bg-surface">{theme.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center bg-surface-alt rounded-full p-1 border border-border">
                <button 
                  onClick={toggleMode}
                  className="p-1.5 rounded-full hover:bg-surface-elevated text-text transition-all active:scale-90"
                >
                  {mode === 'dark' ? '☀️' : '🌙'}
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button 
                  onClick={() => setLang(lang === 'EN' ? 'QC' : 'EN')}
                  className="px-2 py-0.5 text-[10px] font-black hover:bg-surface-elevated rounded-full transition-all active:scale-90"
                >
                  {lang}
                </button>
              </div>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-text hover:bg-surface-alt rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full pt-16">
          <aside className={`
            ${isMenuOpen ? 'fixed inset-0 top-16 bg-background z-[90] block p-8' : 'hidden'} 
            md:block md:relative md:inset-auto md:w-64 md:bg-transparent border-r border-border/50 p-6 h-[calc(100vh-4rem)] md:sticky md:top-16 overflow-y-auto
          `}>
            <nav className="space-y-1.5">
              {navLinks.map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-accent/10 hover:text-accent transition-all duration-200 border border-transparent hover:border-accent/20"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 p-6 md:p-12 lg:p-20">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/*" element={<MarkdownViewer lang={lang} />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
