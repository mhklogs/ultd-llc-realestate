import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ActivePage } from '../types';

interface NarrativeProps {
  onChangePage: (page: ActivePage) => void;
}

export default function Narrative({ onChangePage }: NarrativeProps) {
  return (
    <section 
      id="narrative-section"
      className="py-24 bg-[#070709] relative z-10 w-full overflow-hidden px-6 sm:px-12 md:pl-36 border-t border-white/10 text-[#F4F4F6]"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* 2-Column Grid with Generous Whitespace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Heading, Punchy Statement & Borderless Link */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-display font-semibold text-3xl sm:text-5xl tracking-wide text-[#F4F4F6] uppercase leading-none">
              THE <span className="text-[#C5A059]">ADVANTAGE</span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#F4F4F6]/90 leading-relaxed font-light max-w-xl">
              We don’t just broker properties—we engineer wealth preservation. Led by Pat Patton since 1975, our firm leverages multidisciplinary strategy across Texas high-yield real estate.
            </p>

            <div className="pt-2">
              <button 
                onClick={() => {
                  window.location.hash = 'leadership';
                  onChangePage('about');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#C5A059',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: 0,
                  cursor: 'pointer',
                }}
                className="font-mono font-bold hover:text-[#F4F4F6] transition-colors inline-flex items-center space-x-2 group"
                id="narrative-about-btn"
              >
                <span>READ LEADERSHIP STORY</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </div>



          </div>

          {/* Right Column: Architectural Constrained Image */}
          <div className="lg:col-span-5 relative">
            <div className="overflow-hidden w-full border border-white/10" style={{ maxHeight: '520px', borderRadius: 0 }}>
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" 
                alt="Elite Architecture Design" 
                style={{ maxHeight: '520px', width: '100%', objectFit: 'cover', borderRadius: 0 }}
                className="filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}


