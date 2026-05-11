import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { THEMES } from './themes';
import { translations } from './translations';
import type { Lang } from './translations';
import './index.css';

// VaultWares Logo Component
const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L12 7M12 7L16 3M12 7L8 3M20 12H14M14 12L18 16M14 12L10 16M12 23V17M12 17L8 21M12 17L16 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Dynamically import all mdx files as raw strings
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
          setContent(raw);
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
    <div className="prose prose-vault max-w-none text-text prose-headings:text-text-primary prose-a:text-accent hover:prose-a:text-accent-muted prose-code:text-accent prose-pre:bg-surface-alt prose-strong:text-text-primary prose-blockquote:border-accent prose-blockquote:text-text-secondary transition-colors duration-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function App() {
  // Initialize state from localStorage
  const [themeId, setThemeId] = useState(() => localStorage.getItem('vw-theme-id') || 'golden-slate');
  const [mode, setMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('vw-theme-mode') as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('vw-lang') as Lang) || 'EN');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = translations[lang];

  const currentTheme = useMemo(() => {
    return THEMES.find(t => t.id === themeId) || THEMES[0];
  }, [themeId]);

  // Apply theme variables to document root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'id' && key !== 'mode') {
        root.style.setProperty(`--${key.replace('_', '-')}`, value);
      }
    });
    // Sync localStorage
    localStorage.setItem('vw-theme-id', themeId);
    localStorage.setItem('vw-theme-mode', mode);
  }, [currentTheme, themeId, mode]);

  useEffect(() => {
    localStorage.setItem('vw-lang', lang);
  }, [lang]);

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    // Switch to default theme for mode if current theme doesn't match
    if (newMode === 'dark' && currentTheme.mode !== 'dark') {
      setThemeId('golden-slate');
    } else if (newMode === 'light' && currentTheme.mode !== 'light') {
      setThemeId('codex-solarized-light-revisited');
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'EN' ? 'QC' : 'EN');
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
      <div className="min-h-screen bg-background text-text flex flex-col font-sans transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg leading-none text-text-primary">{t.title}</h1>
                <p className="text-xs text-text-muted mt-0.5">{t.tagline}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme Picker */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-xs font-medium text-text-muted">{t.theme}:</span>
                <select 
                  value={themeId}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="bg-surface-alt hover:bg-surface-elevated text-text text-sm border border-border rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer transition-all"
                >
                  {THEMES.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="flex items-center bg-surface-alt rounded-full p-1 border border-border">
                <button 
                  onClick={toggleMode}
                  className="p-1.5 rounded-full hover:bg-surface-elevated text-text transition-colors"
                  title={mode === 'dark' ? t.light : t.dark}
                >
                  {mode === 'dark' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  )}
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button 
                  onClick={toggleLang}
                  className="px-2 py-0.5 text-xs font-bold hover:bg-surface-elevated rounded-full transition-colors"
                >
                  {lang}
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-text hover:bg-surface-alt rounded-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
          {/* Sidebar */}
          <aside className={`
            ${isMenuOpen ? 'block' : 'hidden'} 
            md:block w-full md:w-64 bg-surface/50 border-r border-border p-6 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto
          `}>
            <nav className="space-y-1">
              {navLinks.map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/10 hover:text-accent transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-10 pt-10 border-t border-border lg:hidden">
              <span className="text-xs font-medium text-text-muted block mb-3">{t.theme}:</span>
              <select 
                value={themeId}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full bg-surface-alt text-text text-sm border border-border rounded-md px-2 py-2 outline-none"
              >
                {THEMES.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 p-6 md:p-10 lg:p-16">
            <div className="max-w-3xl">
              <Routes>
                <Route path="/*" element={<MarkdownViewer lang={lang} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
