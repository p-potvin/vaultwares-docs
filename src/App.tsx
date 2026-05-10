import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './index.css';

const THEMES = [
  'golden-slate', 'codex-solar-light-revisited', 'ocean-dark', 'forest-light',
  'monochrome-dark', 'monochrome-light', 'crimson-dark', 'crimson-light',
  'amethyst-dark', 'amethyst-light'
];

// Dynamically import all mdx files as raw strings
const mdxModules = import.meta.glob('../docs-content/**/*.mdx', { query: '?raw', import: 'default' });

function MarkdownViewer({ lang }: { lang: string }) {
  const { '*': path } = useParams();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    let filePath = path ? `../docs-content/${path}` : `../docs-content/index.mdx`;
    if (!filePath.endsWith('.mdx')) {
      filePath += '.mdx';
    }
    
    const loadContent = async () => {
      const module = mdxModules[filePath];
      if (module) {
        const raw = await module() as string;
        setContent(raw);
      } else {
        setContent(lang === 'EN' ? '# Page Not Found\nThe requested documentation page could not be found.' : '# Page Non Trouvée\nLa page de documentation demandée est introuvable.');
      }
    };
    loadContent();
  }, [path, lang]);

  return (
    <div className="prose prose-invert max-w-none text-text">
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'EN' ? 'QC' : 'EN');
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-primary text-text flex flex-col transition-colors duration-300">
        <nav className="flex justify-between items-center p-4 bg-surface border-b border-border">
          <Link to="/" className="flex items-center gap-4 font-semibold text-xl text-accent hover:text-accent-muted transition-colors">
            <img src="/favicon.svg" alt="VaultWares" className="w-8 h-8" />
            <span>{lang === 'EN' ? 'VaultWares Documentation' : 'Documentation VaultWares'}</span>
          </Link>
          <div className="flex gap-4 items-center">
            <select 
              title="Theme Selector" 
              onChange={(e) => setTheme(e.target.value)} 
              value={theme === 'dark' ? 'golden-slate' : (theme === 'light' ? 'codex-solar-light-revisited' : theme)}
              className="bg-surface-alt text-text border border-border p-2 rounded cursor-pointer hover:border-accent"
            >
              {THEMES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button 
              onClick={toggleTheme}
              className="bg-surface-alt text-text border border-border p-2 rounded cursor-pointer hover:border-accent"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button 
              onClick={toggleLang}
              className="bg-surface-alt text-text border border-border p-2 rounded cursor-pointer hover:border-accent"
            >
              {lang === 'EN' ? 'EN / QC' : 'QC / EN'}
            </button>
          </div>
        </nav>
        <div className="flex flex-1">
          <aside className="w-64 bg-surface border-r border-border p-4 hidden md:block">
            <ul className="space-y-2">
              <li><Link to="/getting-started/overview" className="hover:text-accent transition-colors">{lang === 'EN' ? 'Getting Started' : 'Commencer'}</Link></li>
              <li><Link to="/hardware/encrypted-storage" className="hover:text-accent transition-colors">{lang === 'EN' ? 'Hardware' : 'Matériel'}</Link></li>
              <li><Link to="/software/encryption-software" className="hover:text-accent transition-colors">{lang === 'EN' ? 'Software' : 'Logiciel'}</Link></li>
              <li><Link to="/api-reference/authentication" className="hover:text-accent transition-colors">{lang === 'EN' ? 'API Reference' : 'Référence API'}</Link></li>
            </ul>
          </aside>
          <main className="flex-1 p-8 max-w-4xl mx-auto">
            <Routes>
              <Route path="/*" element={<MarkdownViewer lang={lang} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
