import React, { useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Phone, Mail, MapPin, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { ActivePage } from '../types';

interface ContactSectionProps {
  onChangePage: (page: ActivePage) => void;
}

interface ToastNotification {
  id: string;
  type: 'error' | 'success';
  message: string;
}

export default function ContactSection({ onChangePage }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Buying a Property',
    message: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showDisclosuresModal, setShowDisclosuresModal] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'disclosures' | 'terms' | 'privacy'>('disclosures');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const openModalWithTab = (tab: 'disclosures' | 'terms' | 'privacy') => {
    setModalTab(tab);
    setShowDisclosuresModal(true);
  };

  // Magnetic button position state
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  const subjects = [
    'Buying a Property',
    'Selling a Property',
    'Commercial Real Estate',
    'Investment Advisory & Yield Modeling',
    'Mortgage & Financing (NMLS #215194)',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addToast = (type: 'error' | 'success', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Form Submission & Validation Logic
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addToast('error', 'VALIDATION FAILURE: Please specify your Full Name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      addToast('error', 'VALIDATION FAILURE: Please enter a valid Email Address.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      addToast('error', 'VALIDATION FAILURE: Message brief must contain at least 10 characters.');
      return;
    }
    if (!acceptedTerms) {
      addToast('error', 'VALIDATION FAILURE: Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    // Trigger Success State & Toast
    setSubmitted(true);
    addToast('success', 'DOSSIER TRANSMITTED: Your inquiry has been securely routed to Designated Broker Pat Patton.');

    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Buying a Property',
        message: ''
      });
      setSubmitted(false);
    }, 5000);
  };

  // Magnetic Hover CTA Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * 0.35;
    const distanceY = (e.clientY - centerY) * 0.35;

    setMagneticPos({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  return (
    <section 
      id="contact-section"
      className="relative bg-[#08080A] text-[#F4F4F6] overflow-hidden select-none md:pl-28"
    >
      {/* Subtle Ambient Background Radial Gradient in Warm Champagne Gold */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(197, 160, 89, 0.07) 0%, rgba(8, 8, 10, 1) 75%)'
        }}
      />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 relative z-10">
        
        {/* Left Column: Direct Contact Info */}
        <div className="md:col-span-5 space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-[9px] text-[#C5A059] font-bold uppercase tracking-[0.25em] block">
              GET IN TOUCH
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-wide text-[#F4F4F6] uppercase leading-none">
              CONTACT <span className="text-[#C5A059]">ULTD LLC</span>
            </h2>
          </div>

          {/* Direct Info Links */}
          <div className="space-y-5 font-mono text-xs text-[#F4F4F6]">
            <a href="tel:5125607284" className="flex items-center space-x-3 text-[#8E909A] hover:text-[#C5A059] transition-colors" id="contact-info-phone">
              <Phone size={14} className="text-[#C5A059] flex-shrink-0" />
              <span>(512) 560-7284</span>
            </a>

            <a href="mailto:ultd@swbell.net" className="flex items-center space-x-3 text-[#8E909A] hover:text-[#C5A059] transition-colors" id="contact-info-email">
              <Mail size={14} className="text-[#C5A059] flex-shrink-0" />
              <span>ultd@swbell.net</span>
            </a>

            <div className="flex items-start space-x-3 text-[#8E909A]" id="contact-info-address">
              <MapPin size={14} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
              <span>2112 Baltusrol Dr, Austin, TX 78747-1202</span>
            </div>
          </div>
        </div>

        {/* Right Column: Minimal Form */}
        <div className="md:col-span-7" id="contact-form-container">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 border border-white/10 text-center space-y-3 rounded-[2px]"
              id="submission-success"
            >
              <CheckCircle2 size={28} className="text-[#C5A059] mx-auto" />
              <h3 className="font-display font-semibold text-lg text-[#F4F4F6] uppercase">MESSAGE SENT</h3>
              <p className="font-sans text-xs text-[#8E909A]">Thank you. Our team will get back to you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="contact-form" noValidate>
              
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="FULL NAME *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 py-3 px-4 text-xs font-mono text-[#F4F4F6] placeholder-[#8E909A] focus:outline-none focus:border-[#C5A059] transition-colors rounded-[2px]"
                  id="form-name"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  placeholder="EMAIL ADDRESS *"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 py-3 px-4 text-xs font-mono text-[#F4F4F6] placeholder-[#8E909A] focus:outline-none focus:border-[#C5A059] transition-colors rounded-[2px]"
                  id="form-email"
                />

                <input
                  type="tel"
                  placeholder="PHONE NUMBER"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 py-3 px-4 text-xs font-mono text-[#F4F4F6] placeholder-[#8E909A] focus:outline-none focus:border-[#C5A059] transition-colors rounded-[2px]"
                  id="form-phone"
                />
              </div>

              {/* Subject Select */}
              <div>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 py-3 px-4 text-xs font-mono text-[#F4F4F6] placeholder-[#8E909A] focus:outline-none focus:border-[#C5A059] transition-colors rounded-[2px] appearance-none cursor-pointer"
                  id="form-subject"
                >
                  {subjects.map((subj) => (
                    <option key={subj} value={subj} className="bg-[#101114] text-[#F4F4F6]">
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Input */}
              <div>
                <textarea
                  required
                  rows={4}
                  placeholder="YOUR MESSAGE *"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 py-3 px-4 text-xs font-mono text-[#F4F4F6] placeholder-[#8E909A] focus:outline-none focus:border-[#C5A059] transition-colors resize-none rounded-[2px]"
                  id="form-message"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="form-terms-checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-[2px] border-white/20 bg-[#101114] accent-[#C5A059] cursor-pointer"
                />
                <label htmlFor="form-terms-checkbox" className="font-sans text-[11px] text-[#8E909A] cursor-pointer select-none">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => onChangePage('terms')}
                    className="text-[#C5A059] hover:underline"
                  >
                    Terms
                  </button>
                  {' '}&{' '}
                  <button
                    type="button"
                    onClick={() => onChangePage('privacy')}
                    className="text-[#C5A059] hover:underline"
                  >
                    Privacy Policy
                  </button>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#C5A059] text-[#08080A] hover:bg-[#F4F4F6] font-mono text-xs font-bold tracking-widest py-3.5 uppercase transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer rounded-[2px] active:scale-98"
                id="form-submit-btn"
              >
                <span>SEND MESSAGE</span>
                <Send size={13} />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* MINIMALIST SLEEK FOOTER */}
      <footer className="bg-[#0A0B0D] text-[#F4F4F6] py-6 sm:py-8 px-6 sm:px-12 border-t border-white/10 relative z-10" id="global-site-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brokerage Summary */}
          <div className="flex items-center space-x-3">
            <span className="font-display font-semibold text-base tracking-wider text-[#F4F4F6]">ULTD LLC</span>
            <span className="text-[#C5A059] text-xs">·</span>
            <span className="font-mono text-[9px] tracking-widest text-[#8E909A] font-medium">TEXAS REAL ESTATE BROKERAGE · TREC #0594267</span>
          </div>

          {/* Minimalist Text Legal Links */}
          <div className="flex items-center space-x-4 font-mono text-[10px] font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => openModalWithTab('disclosures')}
              className="text-[#C5A059] hover:text-[#F4F4F6] hover:underline transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Disclosures ↗
            </button>
          </div>

          {/* Bottom Legal Copyright */}
          <div className="font-mono text-[9px] text-[#8E909A] tracking-widest uppercase">
            © 2026 ULTD LLC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>


      {/* LEGAL & REGULATORY DISCLOSURES & COMPLIANCE MODAL POPUP */}
      <AnimatePresence>
        {showDisclosuresModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#070709]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowDisclosuresModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#101114] text-[#F4F4F6] border border-white/10 p-6 sm:p-8 max-w-3xl w-full rounded-[2px] shadow-2xl relative space-y-6 max-h-[90vh] flex flex-col justify-between overflow-y-auto overscroll-contain"
              data-lenis-prevent
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header & Tabs */}
              <div className="space-y-4 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg text-[#C5A059] uppercase tracking-wide">
                    COMPLIANCE & LEGAL MANDATES
                  </h3>
                  <button
                    onClick={() => setShowDisclosuresModal(false)}
                    className="text-[#8E909A] hover:text-[#F4F4F6] p-1 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Tab Switcher */}
                <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
                  <button
                    onClick={() => setModalTab('disclosures')}
                    className={`font-mono text-[10px] font-bold px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer uppercase tracking-wider ${
                      modalTab === 'disclosures'
                        ? 'bg-[#C5A059] text-[#070709]'
                        : 'bg-[#18191D] text-white/60 hover:text-white'
                    }`}
                  >
                    TREC DISCLOSURES & IABS
                  </button>
                  <button
                    onClick={() => setModalTab('terms')}
                    className={`font-mono text-[10px] font-bold px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer uppercase tracking-wider ${
                      modalTab === 'terms'
                        ? 'bg-[#C5A059] text-[#070709]'
                        : 'bg-[#18191D] text-white/60 hover:text-white'
                    }`}
                  >
                    TERMS OF USE
                  </button>
                  <button
                    onClick={() => setModalTab('privacy')}
                    className={`font-mono text-[10px] font-bold px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer uppercase tracking-wider ${
                      modalTab === 'privacy'
                        ? 'bg-[#C5A059] text-[#070709]'
                        : 'bg-[#18191D] text-white/60 hover:text-white'
                    }`}
                  >
                    PRIVACY POLICY
                  </button>
                </div>
              </div>

              {/* Tab Content Display */}
              <div className="space-y-4 font-mono text-xs text-[#8E909A] leading-relaxed overflow-y-auto max-h-[50vh] pr-2">
                {modalTab === 'disclosures' && (
                  <div className="space-y-4">
                    <p>
                      <span className="text-[#C5A059] font-bold">TREC COMPLIANCE MANDATE:</span> ULTD LLC is a licensed Texas real estate brokerage (TREC License #0594267). Pat Patton, Designated Broker (TREC License #0175549).
                    </p>

                    <div className="bg-[#08080A] border border-white/10 p-4 rounded-[2px] space-y-2">
                      <span className="text-[#C5A059] font-bold block text-[10px]">TEXAS REAL ESTATE COMMISSION CONSUMER PROTECTION NOTICE</span>
                      <p className="text-[11px] text-[#8E909A]">
                        TREC regulates real estate brokers, sales agents, and inspectors. Complaints can be filed at www.trec.texas.gov.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <a 
                        href="https://www.trec.texas.gov/sites/default/files/pdf-forms/CN%201-5_0.pdf" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#C5A059] hover:underline font-bold block"
                      >
                        → Official TREC Consumer Protection Notice CN 1-5 (PDF) ↗
                      </a>
                      <a 
                        href="https://www.trec.texas.gov" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#F4F4F6] hover:underline font-bold block"
                      >
                        → Visit Official TREC Portal (www.trec.texas.gov) ↗
                      </a>
                    </div>
                  </div>
                )}

                {modalTab === 'terms' && (
                  <div className="space-y-4 font-sans text-xs text-[#8E909A]">
                    <p className="font-mono text-[10px] text-[#C5A059] font-bold">TERMS OF USE & SERVICE AGREEMENT (EFFECTIVE AUGUST 2026)</p>
                    <div className="space-y-2 border-t border-white/10 pt-2">
                      <strong className="text-[#F4F4F6] font-semibold block">1. Representation & Compliance:</strong>
                      <p>Property listings and advisory data are for informational purposes. Formal representation is established upon execution of a written TREC representation agreement.</p>
                    </div>
                    <div className="space-y-2 border-t border-white/10 pt-2">
                      <strong className="text-[#F4F4F6] font-semibold block">2. Fair Housing Opportunity:</strong>
                      <p>ULTD LLC complies with the Fair Housing Act and Equal Opportunity Act without discrimination.</p>
                    </div>
                    <div className="space-y-2 border-t border-white/10 pt-2">
                      <strong className="text-[#F4F4F6] font-semibold block">3. Brokerage Fee Negotiability:</strong>
                      <p>Real estate brokerage fees are not set by state law and are completely negotiable between principal and broker.</p>
                    </div>
                  </div>
                )}

                {modalTab === 'privacy' && (
                  <div className="space-y-4 font-sans text-xs text-[#8E909A]">
                    <p className="font-mono text-[10px] text-[#C5A059] font-bold">PRIVACY POLICY & CONFIDENTIALITY STATEMENT</p>
                    <div className="space-y-2 border-t border-white/10 pt-2">
                      <strong className="text-[#F4F4F6] font-semibold block">1. Data Protection:</strong>
                      <p>We collect voluntary contact details solely to facilitate real estate advisory services and transaction coordination.</p>
                    </div>
                    <div className="space-y-2 border-t border-white/10 pt-2">
                      <strong className="text-[#F4F4F6] font-semibold block">2. Non-Disclosure Guarantee:</strong>
                      <p>We do NOT sell, lease, or trade client information to third-party telemarketers or advertisers.</p>
                    </div>
                    <div className="space-y-2 border-t border-white/10 pt-2">
                      <strong className="text-[#F4F4F6] font-semibold block">3. Direct Contact:</strong>
                      <p>For privacy inquiries, contact Designated Broker Pat Patton directly at (512) 560-7284 or via email at ultd@swbell.net.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-[#8E909A]">
                <span>ULTD LLC · AUSTIN, TEXAS · TREC #0594267</span>
                <button
                  onClick={() => setShowDisclosuresModal(false)}
                  className="text-[#C5A059] hover:underline font-bold cursor-pointer uppercase"
                >
                  CLOSE [X]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Dynamic Client-Side Form Validation & Submission Dark Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-md w-full px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto p-4 border shadow-2xl backdrop-blur-xl flex items-start justify-between space-x-3 text-xs font-mono font-bold tracking-wide uppercase ${
                toast.type === 'error'
                  ? 'bg-[#121316]/95 border-[#E85A37] text-[#E85A37]'
                  : 'bg-[#121316]/95 border-[#C5A880] text-[#C5A880]'
              }`}
            >
              <div className="flex items-start space-x-3">
                {toast.type === 'error' ? (
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{toast.message}</span>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </section>
  );
}
