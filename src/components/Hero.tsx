import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone } from 'lucide-react';

// 4 Seamless Milestone Quotes matching the section scroll progress
const HERO_MILESTONES = [
  {
    title: 'ARCHITECTURAL EXCELLENCE',
    subtitle: 'Bespoke fiduciary advocacy for Texas\' distinguished luxury estates.',
  },
  {
    title: 'DEFINING TEXAS LUXURY',
    subtitle: 'Unrivaled market strategy, private corridor sourcing, and principal representation.',
  },
  {
    title: 'OFF-MARKET ADVOCACY',
    subtitle: 'Confidential asset transactions executed with institutional discretion.',
  },
  {
    title: 'FIDUCIARY LEADERSHIP',
    subtitle: 'Five decades of continuous Texas brokerage leadership and capital stewardship.',
  },
];


import { ActivePage } from '../types';

const TOTAL_HERO_FRAMES = 150;

interface HeroProps {
  onChangePage: (page: ActivePage) => void;
}

export default function HeroSection(_props: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const callBtnRef = useRef<HTMLAnchorElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(0);
  const lastFrameRef = useRef<number>(-1);
  const milestoneRef = useRef<number>(0);

  // Preload converted clips 1, 2, 3 frame sequence for Hero section (frames 1-150 in /inbetween)
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_HERO_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      const frameNum = String(i).padStart(3, '0');
      img.src = `/inbetween/frame_${frameNum}.jpg?v=native1to1`;
      img.onload = () => {
        // Paint immediately when the frame matching the current scroll position arrives
        const progress = ScrollTrigger.getById('hero-trigger')?.progress || 0;
        const targetIdx = Math.min(TOTAL_HERO_FRAMES - 1, Math.floor(progress * TOTAL_HERO_FRAMES));
        if (i === 0 || i === targetIdx || lastFrameRef.current === -1) {
          lastFrameRef.current = targetIdx;
          renderCanvasFrame(targetIdx);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);


  // Draw current frame to canvas with cover scaling, fallback frame recovery & vignette scrim
  const renderCanvasFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find requested frame or fallback to closest loaded image
    let img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_HERO_FRAMES; offset++) {
        const prev = imagesRef.current[Math.max(0, frameIdx - offset)];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;


    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    const canvasRatio = width / height;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, width, height);

    // Draw frame image in 100% crisp original video quality
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Anchor the call button onto the frame watermark spot (bottom-right of the source video)
    const btn = callBtnRef.current;
    if (btn) {
      const bw = btn.offsetWidth || 180;
      const bh = btn.offsetHeight || 45;
      const margin = 16;
      let cx = offsetX + imgWidth * 0.903 * (drawWidth / imgWidth);
      const cy = offsetY + imgHeight * 0.8385 * (drawHeight / imgHeight);
      cx = Math.min(Math.max(cx, margin + bw / 2), width - margin - bw / 2);
      btn.style.left = `${cx}px`;
      btn.style.top = `${cy}px`;
    }
  };

  // GSAP ScrollTrigger freeze/pin engine scrubbing through converted hero clips (frames 1-150)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'hero-trigger',
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2000',
        pin: containerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        fastScrollEnd: true,
        preventOverlaps: 'hero-section',
        onUpdate: (self) => {
          const progress = self.progress;

          const frameIdx = Math.min(
            TOTAL_HERO_FRAMES - 1,
            Math.max(0, Math.floor(progress * TOTAL_HERO_FRAMES))
          );

          if (frameIdx !== lastFrameRef.current) {
            lastFrameRef.current = frameIdx;
            renderCanvasFrame(frameIdx);
          }

          const milestoneIdx = Math.min(
            HERO_MILESTONES.length - 1,
            Math.floor(progress * HERO_MILESTONES.length)
          );
          if (milestoneIdx !== milestoneRef.current) {
            milestoneRef.current = milestoneIdx;
            setActiveMilestoneIndex(milestoneIdx);
          }
        },
      });
    }, sectionRef);

    const handleResize = () => {
      const currentProgress = ScrollTrigger.getById('hero-trigger')?.progress || 0;
      const fIdx = Math.floor(currentProgress * TOTAL_HERO_FRAMES);
      lastFrameRef.current = -1;
      renderCanvasFrame(fIdx);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeMilestone = HERO_MILESTONES[activeMilestoneIndex] || HERO_MILESTONES[0];

  return (
    <section 
      id="overview" 
      ref={sectionRef} 
      className="relative z-20 w-full bg-[#070709] text-[#F4F4F6] select-none"
    >
      {/* Pinned Viewport Stage Container */}
      <div 
        ref={containerRef}
        className="w-full h-screen overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12 px-6 sm:px-12 md:px-20 relative bg-[#070709]"
      >
        {/* Converted Clips 1-4 Frame Sequence Canvas */}
        <canvas
          ref={canvasRef}
          className="frame-scrub-canvas absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-100"
        />

        {/* Dynamic Canvas Blending Scrim against Deep Obsidian Background (#070709) */}
        <div 
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(7,7,9,0.35) 0%, rgba(7,7,9,0.05) 50%, rgba(7,7,9,0.40) 100%)'
          }}
        />


        {/* Pure Luxury Real Estate Quote Overlay - Original Unboxed Style */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-milestone-${activeMilestoneIndex}`}
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hero-caption-text relative z-10 max-w-4xl mx-auto text-center space-y-4 px-4"
          >
            {/* Synchronized High-Contrast Headline */}
            <h1 
              className="font-display font-semibold text-[#F4F4F6] uppercase leading-[0.95] drop-shadow-2xl"
              style={{ 
                fontSize: 'clamp(1.05rem, 5.5vw, 4.5rem)',
                letterSpacing: '0.05em' 
              }}
            >
              {activeMilestone.title}
            </h1>

            {/* Synchronized Milestone Subtitle Quote */}
            <p 
              className="font-sans font-light text-[#8E909A] text-xs sm:text-sm md:text-base max-w-xl mx-auto drop-shadow-md leading-relaxed"
            >
              “{activeMilestone.subtitle}”
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Desktop Call Button — covers the frame watermark spot (bottom-right) */}
        <a
          href="tel:5125607284"
          ref={callBtnRef}
          style={{ left: '95%', top: '86%' }}
          className="hidden md:flex absolute -translate-x-1/2 -translate-y-1/2 z-30 items-center space-x-2 whitespace-nowrap bg-[#101114]/90 backdrop-blur-md border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#070709] font-mono text-[10px] font-bold tracking-widest uppercase px-5 py-3 transition-colors duration-300 shadow-2xl active:scale-95 rounded-[2px]"
          id="hero-call-btn"
        >
          <Phone size={13} />
          <span>(512) 560-7284</span>
        </a>

      </div>
    </section>

  );
}

