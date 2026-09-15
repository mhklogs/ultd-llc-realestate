import { useState, useEffect } from 'react';
import { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  onChangePage: (page: ActivePage) => void;
}

export default function Navbar({ activePage, onChangePage }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    if (activePage !== 'home') return;
    const checkSection = () => {
      const viewportCenter = window.innerHeight / 2;
      const sectionIds = ["overview", "legacy", "services", "properties-section", "philosophy", "location", "contact-section"];
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          setActiveSection(id.replace('-section', ''));
        }
      });
    };
    checkSection();
    window.addEventListener('scroll', checkSection, { passive: true });
    return () => window.removeEventListener('scroll', checkSection);
  }, [activePage]);

  const isFrameSection = activePage === 'home' && (activeSection === 'overview' || activeSection === 'philosophy');

  const handleLogoClick = () => {
    if (activePage !== 'home') {
      onChangePage('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks: { label: string; page: ActivePage | 'legacy' }[] = [
    { label: 'OVERVIEW', page: 'home' },
    { label: 'LEGACY', page: 'legacy' },
    { label: 'SERVICES', page: 'services' },
    { label: 'PORTFOLIO', page: 'properties' },
    { label: 'CONTACT', page: 'contact' },
  ];

  return (
    <header
      className={`md:hidden fixed top-0 left-0 w-full px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center z-[1000] select-none transition-all duration-300 ${
        activePage === 'home' && !activeModalHash()
          ? 'bg-[#070709]/80 backdrop-blur-md border-b border-white/5'
          : 'bg-[#070709]/95 border-b border-white/10 backdrop-blur-md'
      }`}
      id="mobile-navbar"
    >
      {/* Raw, Unboxed, Clean Logo Text (Hidden in Overview when frames play) */}
      <div
        onClick={handleLogoClick}
        style={{
          opacity: isFrameSection ? 0 : 1,
          pointerEvents: isFrameSection ? 'none' : 'auto',
          transition: 'opacity 0.4s ease',
        }}
        className="flex flex-col cursor-pointer group"
        id="mobile-nav-logo"
      >
        <span className="font-display font-semibold text-sm tracking-widest leading-none text-[#F4F4F6] group-hover:text-[#C5A059] transition-colors duration-300">
          ULTD LLC
        </span>
        <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-[#C5A059] mt-0.5 uppercase">
          TEXAS REAL ESTATE
        </span>
      </div>

      {/* Pure Stealth Borderless Text Navigation — horizontally scrollable */}
      <nav className="flex items-center space-x-3 sm:space-x-5 overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const isActive = activePage === link.page || (link.page === 'legacy' && activePage === 'home');
          return (
            <button
              key={link.label}
              onClick={(e) => {
                e.preventDefault();
                onChangePage(link.page as ActivePage);
              }}
              className={`font-mono text-[10px] sm:text-xs font-medium cursor-pointer bg-transparent border-none p-0 tracking-wider uppercase whitespace-nowrap transition-all active:scale-95 ${
                isActive ? 'text-[#C5A059] font-bold' : 'text-white/60 hover:text-[#C5A059]'
              }`}
              id={`mobile-nav-item-${link.label.toLowerCase()}`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

function activeModalHash() {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.replace('#', '').toLowerCase();
  return ['leadership', 'about', 'terms', 'privacy', 'disclosures'].includes(hash);
}
