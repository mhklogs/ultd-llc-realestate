/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ActivePage } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Narrative from './components/Narrative';
import Analytics from './components/Analytics';
import Showcase from './components/Showcase';
import MapSection from './components/MapSection';
import ContactSection from './components/ContactSection';
import DisclosuresView from './components/DisclosuresView';
import TermsView from './components/TermsView';
import PrivacyView from './components/PrivacyView';
import LeadershipView from './components/LeadershipView';
import LandingLeadership from './components/LandingLeadership';
import ServicesView from './components/ServicesView';
import PropertiesHub from './components/PropertiesHub';
import DotNavigation from './components/DotNavigation';

type ModalView = 'leadership' | 'terms' | 'privacy' | 'disclosures' | null;

export default function App() {
  const getInitialModal = (): ModalView => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const route = hash || path;
    if (route === 'about' || route === 'leadership') return 'leadership';
    if (route === 'terms') return 'terms';
    if (route === 'privacy') return 'privacy';
    if (route === 'disclosures' || route === 'trec' || route === 'trec-disclosures') return 'disclosures';
    return null;
  };

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeModal, setActiveModal] = useState<ModalView>(getInitialModal);
  const [regulatoryTab, setRegulatoryTab] = useState<'trec' | 'terms' | 'privacy'>('trec');
  const [contactPreFill, setContactPreFill] = useState<string | null>(null);

  // Initialize Lenis Smooth Scroll Engine & GSAP ScrollTrigger Synchronization
  useEffect(() => {
    if (activePage !== 'home') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger markers after DOM layout stabilization & image preloads
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
      (window as any).lenis = null;
      document.documentElement.removeAttribute('style');
      document.body.removeAttribute('style');
    };
  }, [activePage]);

  // Ensure body and html overflow styles & GSAP ScrollTriggers are clean when navigating to subpages
  useEffect(() => {
    if (activePage !== 'home') {
      // Instantly pin scroll position to top (0,0) before frame paint
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const lenis = (window as any).lenis;
      if (lenis) {
        try {
          lenis.stop();
          lenis.destroy();
        } catch (err) {
          // Ignore destroy errors
        }
        (window as any).lenis = null;
      }

      try {
        const triggers = ScrollTrigger.getAll();
        triggers.forEach((t) => {
          try {
            t.disable(false);
            t.kill(false);
          } catch (err) {
            // Ignore unmounted element errors
          }
        });
        ScrollTrigger.clearMatchMedia();
      } catch (err) {
        // Ignore trigger errors
      }

      try {
        document.documentElement.removeAttribute('style');
        document.body.removeAttribute('style');
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
        document.body.style.height = 'auto';
        document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
        document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
      } catch (err) {
        // Ignore style reset errors
      }
    }
  }, [activePage]);

  // Site is a fixed dark cinematic theme; keep the class on both <html> and <body>
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  const scrollToTargetSection = (page: string) => {
    const targetMap: Record<string, string> = {
      home: 'overview',
      overview: 'overview',
      about: 'legacy',
      legacy: 'legacy',
      services: 'services',
      properties: 'properties-section',
      contact: 'contact-section',
    };

    const targetId = targetMap[page] || page;
    if (targetId) {
      const el = document.getElementById(targetId) || document.getElementById(targetId.replace('-section', '')) || document.getElementById('legacy');
      if (el) {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(el, { duration: 1.2, force: true, lock: false });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to section or change route
  const handlePageChange = (page: ActivePage) => {
    // Popup routes open as modal boxes over the home page
    if (page === 'about') {
      setActiveModal('leadership');
      history.pushState(null, '', '#leadership');
      return;
    }
    if (page === 'terms' || page === 'privacy' || page === 'disclosures') {
      setActiveModal(page);
      history.pushState(null, '', `#${page}`);
      return;
    }

    setActiveModal(null);
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }

    // Stop ongoing Lenis momentum scroll before section jump
    const lenis = (window as any).lenis;
    if (lenis) {
      try {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.start();
      } catch (e) {}
    }

    scrollToTargetSection(page);
  };

  // Close modal & clear popup hash
  const closeModal = () => {
    setActiveModal(null);
    if (['#leadership', '#about', '#terms', '#privacy', '#disclosures'].includes(window.location.hash)) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Navigation triggered from inside a modal view (e.g. its return button)
  const handleModalNavigate = (page: ActivePage) => {
    closeModal();
    setTimeout(() => scrollToTargetSection(page), 80);
  };

  // Pause background smooth-scroll while a modal is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (activeModal) {
      try { lenis?.stop(); } catch (e) {}
      document.body.style.overflow = 'hidden';
    } else {
      try { lenis?.start(); } catch (e) {}
      document.body.style.overflow = '';
      // Recalculate pin positions (hero/showcase) after layout settles post-close
      setTimeout(() => ScrollTrigger.refresh(), 60);
    }
  }, [activeModal]);

  // Close modal on Escape
  useEffect(() => {
    if (!activeModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeModal]);

  // URL Hash & Pathname routing listener for popup modals & section deep linking
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const route = hash || path;
      if (!route) {
        setActiveModal(null);
        return;
      }

      if (route === 'terms') {
        setActiveModal('terms');
      } else if (route === 'privacy') {
        setActiveModal('privacy');
      } else if (route === 'disclosures' || route === 'trec-disclosures' || route === 'trec') {
        setActiveModal('disclosures');
      } else if (route === 'about' || route === 'leadership') {
        setActiveModal('leadership');
      } else if (['overview', 'legacy', 'services', 'properties', 'contact'].includes(route)) {
        setActiveModal(null);
        setTimeout(() => {
          scrollToTargetSection(route);
        }, 250);
      }
    };

    syncRouteFromLocation();
    window.addEventListener('hashchange', syncRouteFromLocation);
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromLocation);
      window.removeEventListener('popstate', syncRouteFromLocation);
    };
  }, []);


  // Pre-fill contact form and navigate
  const handleContactPreFill = (subjectMessage: string) => {
    setContactPreFill(subjectMessage);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Clean pre-fill after navigation has occurred
  useEffect(() => {
    if (contactPreFill) {
      const selectEl = document.getElementById('form-subject') as HTMLSelectElement;
      if (selectEl) {
        if (contactPreFill.startsWith('Inquiry Regarding:')) {
          selectEl.value = 'Buying a Property';
        } else if (contactPreFill === 'Off-Market Sourcing Request') {
          selectEl.value = 'Investment Properties';
        }
        
        const event = new Event('change', { bubbles: true });
        selectEl.dispatchEvent(event);
      }

      const textEl = document.getElementById('form-message') as HTMLTextAreaElement;
      if (textEl) {
        textEl.value = `Dear Pat Patton,\n\nI am reaching out regarding the following parameters:\n${contactPreFill}\n\nPlease supply comprehensive comparative architectural underwriting dossiers and schedule a private security consultation at your earliest convenience.\n\nBest regards,`;
        const event = new Event('input', { bubbles: true });
        textEl.dispatchEvent(event);
      }
      
      setContactPreFill(null);
    }
  }, [contactPreFill]);

  return (
    <div className="font-sans selection:bg-brand-orange selection:text-brand-cream overflow-x-hidden min-h-screen flex flex-col transition-colors duration-500 bg-brand-cream text-brand-charcoal">
      {/* Integrated Brand & Section Sidebar Navigation */}
      <DotNavigation 
        activePage={activePage} 
        onChangePage={handlePageChange}
      />

      {/* Mobile Top Navigation (visible on small screens, hidden on desktop) */}
      <Navbar 
        activePage={activePage} 
        onChangePage={handlePageChange} 
      />


      {/* Main Single Page Stage */}
      <main className="flex-grow">
        <div id="main-single-page" className="w-full">
          {/* 1. Hero Video / Hero Section */}
          <Hero onChangePage={handlePageChange} />

          {/* 2. Legacy / About Section */}
          <div id="legacy" className="relative z-10 w-full h-auto min-h-screen bg-[#070709] mb-0 overflow-visible">
            <Narrative onChangePage={handlePageChange} />
            <LandingLeadership onChangePage={handlePageChange} />
          </div>


          {/* 3. Services Section */}
          <ServicesView onChangePage={handlePageChange} />

          {/* 4. Metrics Section */}
          <Analytics />

          {/* 5. Properties Section */}
          <PropertiesHub onContactSeller={handleContactPreFill} />

          {/* 6. Mid-Page Visual Section */}
          <Showcase />

          {/* 7. Location Section */}
          <MapSection />

          {/* 8. Contact / Footer Section */}
          <ContactSection onChangePage={handlePageChange} />
        </div>
      </main>

      {/* Popup Modal Boxes: Leadership / Terms / Privacy / Disclosures */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-[#070709]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={closeModal}
            id="popup-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto overscroll-contain bg-[#070709] border border-white/10 shadow-2xl rounded-[3px] no-scrollbar"
              data-lenis-prevent
              onClick={(e) => e.stopPropagation()}
              id={`popup-modal-${activeModal}`}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="sticky top-4 float-right mr-4 z-20 w-9 h-9 bg-[#16181E] hover:bg-[#C5A059] hover:text-[#070709] text-[#F4F4F6] flex items-center justify-center rounded-full transition-colors cursor-pointer border border-white/10 active:scale-95"
                aria-label="Close"
                id="popup-modal-close-btn"
              >
                <X size={16} />
              </button>

              {activeModal === 'leadership' && <LeadershipView onChangePage={handleModalNavigate} />}
              {activeModal === 'terms' && <TermsView onChangePage={handleModalNavigate} />}
              {activeModal === 'privacy' && <PrivacyView onChangePage={handleModalNavigate} />}
              {activeModal === 'disclosures' && <DisclosuresView onChangePage={handleModalNavigate} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>




    </div>
  );
}

