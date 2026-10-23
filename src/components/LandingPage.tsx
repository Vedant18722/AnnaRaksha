/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Leaf,
  Clock,
  CheckCircle2,
  Utensils,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo.tsx';
import { useI18n } from '../context/I18nContext.tsx';
import { CATEGORY_VISUALS } from '../data/categoryImages.ts';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
  onOpenLogin: () => void;
  onOpenCategoryGuide?: (categoryId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreFeatures,
  onOpenLogin,
  onOpenCategoryGuide,
}) => {
  const { t, language } = useI18n();

  return (
    <div className="space-y-16 py-6 pb-20 max-w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-emerald-800/40">
        {/* Subtle decorative glowing background shapes */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none overflow-hidden" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none overflow-hidden" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Powered Food Security & Sustainability for Institutional Kitchens</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              AnnaRaksha{' '}
              <span className="text-amber-400 font-serif font-bold text-2xl sm:text-4xl block sm:inline">
                (अन्नरक्षा)
              </span>
            </h1>
            <p className="text-lg sm:text-2xl font-medium text-emerald-100/90 tracking-wide">
              {t('tagline')}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Empowering university canteens, hostel messes, and community dining halls to predict meal attendance, calculate deterministic shelf-life risk, and coordinate verified surplus redistribution with an agentic AI workflow.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg hover:shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-700/60 rounded-xl transition-all"
            >
              <span>{t('exploreFeatures')}</span>
              <ChevronRight className="w-4 h-4 text-emerald-300" />
            </button>
          </div>

          {/* Real Operational Proof Metrics */}
          <div className="pt-8 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-2xl font-bold font-mono text-white block">100%</span>
              <span className="text-emerald-200/70 mt-0.5 block">Zero Expired Donated</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white block">52%</span>
              <span className="text-emerald-200/70 mt-0.5 block">Weekend Drop Modeled</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white block">4-Step</span>
              <span className="text-emerald-200/70 mt-0.5 block">Human-in-the-Loop Gate</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white block">7</span>
              <span className="text-emerald-200/70 mt-0.5 block">Indian Languages</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Mechanism: How AnnaRaksha Works */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            How AnnaRaksha Protects Food & Budget
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A reliable 3-step loop combining strict mathematical safety checks with Google Gemini agentic reasoning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-bold flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Track Inventory & Batches</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Log dairy, produce, grains, bakery, and prepared batches with storage zones. Deterministic shelf-life clocks monitor hours remaining without false safety inferences.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-bold flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Generate Agent Solutions</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Gemini 2.5 Flash analyzes stock velocity vs campus attendance drops to formulate dual-channel plans: verified NGO donation or bulk kitchen recipe repurposing.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 font-bold flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Review, Approve & Act</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Consequential state changes pause at the Human Approval Gate. Managers inspect and adjust quantities. Approved transfers generate official printable dispatch slips.
            </p>
          </div>
        </div>
      </section>

      {/* Indian Food Category Visual Showcase (Phase 7 Requirement) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Indian Food-Tech Taxonomy
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Food Categories & Specialized Handling
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any category below to view temperature requirements, spoilage triggers, and kitchen handling protocols.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenCategoryGuide?.('dairy')}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Specialized Handling Guide &rarr;</span>
            </button>
            <button
              onClick={onGetStarted}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              All Inventory &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_VISUALS).slice(0, 8).map(([key, item]) => (
            <div
              key={key}
              onClick={() => (onOpenCategoryGuide ? onOpenCategoryGuide(key) : onGetStarted())}
              role="button"
              tabIndex={0}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                <img
                  src={item.photoUrl}
                  alt={item.photoAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white bg-slate-900/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {item.handling.storageZone.toUpperCase()}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.defaultTitle}
                  </span>
                  <span className="text-[11px] font-sans text-amber-600 dark:text-amber-400 font-semibold">
                    {item.hindiTitle}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.tagline}
                </p>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-400 pt-1 font-medium flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span>{item.handling.recommendedTemp.split('(')[0].trim()}</span>
                  <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability & ESG Commitment */}
      <section className="bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl p-8 sm:p-12 border border-emerald-200 dark:border-emerald-800/50 space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Leaf className="w-4 h-4" />
            <span>UN Sustainable Development Goal 12.3</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Halving Institutional Food Waste Before It Reaches Landfills
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            According to the UN Food and Agriculture Organization (FAO), every kilogram of food wasted releases approximately 2.5 kg of greenhouse gases (CO₂e). AnnaRaksha transforms perishable surplus into nutritious meals for local children’s homes and community food banks, logging every kilogram saved into a cryptographically signed audit ledger.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 block">2.5 kg</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">CO₂e Offset per kg Saved</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 block">45 min</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">Cold-Chain Handover Window</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 block">100%</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">Tamper-Evident Signed Hash</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 block">Zero</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">Unsupervised AI Commands</span>
          </div>
        </div>
      </section>

      {/* Footer Navigation & Disclaimer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline={true} />
          <div className="flex items-center gap-6">
            <button onClick={onGetStarted} className="hover:text-slate-900 dark:hover:text-white">
              Inventory
            </button>
            <button onClick={onExploreFeatures} className="hover:text-slate-900 dark:hover:text-white">
              Features
            </button>
            <button onClick={onOpenLogin} className="hover:text-slate-900 dark:hover:text-white">
              Login
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <strong>Institutional Safety Disclaimer:</strong> AnnaRaksha predictions are decision-support heuristics and should not replace certified on-site organoleptic or laboratory food safety testing. Expired food items are quarantined with zero consumption tolerance.
        </p>
      </footer>
    </div>
  );
};
