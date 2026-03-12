'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { analyzeClaim, type CatchResponse } from '@/lib/api'
import { cn } from '@/lib/utils'

const MAX_CHARS = 500

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function CatchApp() {
  const [claim, setClaim] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CatchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = claim.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeClaim(trimmed)
      setResult(data)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const charCount = claim.length
  const nearLimit = charCount > MAX_CHARS * 0.85

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 overflow-x-hidden">

      {/* ── Atmospheric background glows ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[180px]" />
        <div className="absolute top-1/2 -left-64 w-[520px] h-[520px] rounded-full bg-orange-600/[0.03] blur-[130px]" />
        <div className="absolute top-1/3 -right-64 w-[520px] h-[520px] rounded-full bg-yellow-500/[0.03] blur-[130px]" />
      </div>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#050508]/75 backdrop-blur-xl">
        <div className="mx-auto max-w-[1350px] px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/30">
              <span className="text-[13px] font-bold text-white leading-none">?</span>
            </div>
            <span className="font-semibold text-[13px] tracking-tight text-slate-100 font-display">
              What&apos;s the Catch
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full border border-amber-500/25 text-amber-400/75 bg-amber-500/[0.07] font-medium tracking-wide">
            Beta
          </span>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-[1350px] px-5 sm:px-8">

        {/* ── Hero + Form ── */}
        <section className="flex flex-col items-center text-center pt-20 pb-16">

          {/* Label chip */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="mb-7 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.06] text-amber-400/90 text-[11px] font-medium tracking-wide"
          >
            <Sparkles className="w-3 h-3" />
            AI-powered critical thinking
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={0.08}
            initial="hidden"
            animate="visible"
            className="font-display font-extrabold tracking-tight leading-[1.06] text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] mb-6"
          >
            What&apos;s the{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              catch?
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-slate-400 max-w-lg mb-10 leading-relaxed"
          >
            Enter any popular belief, trend, or product and instantly surface the
            caveats, downsides, and counterpoints people often miss.
          </motion.p>

          {/* ── Form ── */}
          <motion.form
            variants={fadeUp}
            custom={0.24}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="w-full max-w-2xl"
          >
            <div
              className={cn(
                'rounded-2xl border bg-[#0d0d16] transition-all duration-300',
                claim.length > 0
                  ? 'border-amber-500/35 shadow-[0_0_0_1px_rgba(245,158,11,0.12),0_0_50px_-8px_rgba(245,158,11,0.1)]'
                  : 'border-white/[0.07] shadow-none',
              )}
            >
              <textarea
                value={claim}
                onChange={(e) => setClaim(e.target.value.slice(0, MAX_CHARS))}
                placeholder="e.g. remote work, AI will replace writers, crypto, intermittent fasting…"
                rows={4}
                className="w-full bg-transparent resize-none outline-none px-5 pt-4 pb-2 text-[13.5px] text-slate-200 placeholder:text-slate-600 leading-relaxed rounded-t-2xl"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.05]">
                <span
                  className={cn(
                    'text-[11px] tabular-nums transition-colors duration-200',
                    nearLimit ? 'text-amber-400' : 'text-slate-600',
                  )}
                >
                  {charCount}/{MAX_CHARS}
                </span>
                <button
                  type="submit"
                  disabled={loading || !claim.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      Analyze
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 flex items-center gap-2 text-red-400 text-[12px] px-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </section>

        {/* ── Loading skeleton ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-24"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-white/[0.05]" />
                <div className="w-28 h-2.5 rounded-full bg-white/[0.05] animate-pulse" />
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl border border-white/[0.06] bg-[#0d0d16] animate-pulse"
                  />
                ))}
              </div>
              <div className="h-36 rounded-2xl border border-white/[0.06] bg-[#0d0d16] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.section
              ref={resultsRef}
              key={result.claim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pb-28"
            >
              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/[0.05]" />
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
                  results
                </span>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>

              {/* Claim echo */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center text-[13px] text-slate-500 italic mb-12 px-4"
              >
                &ldquo;
                {result.claim.length > 80
                  ? result.claim.slice(0, 80) + '…'
                  : result.claim}
                &rdquo;
              </motion.p>

              {/* Section header — Catches */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="flex items-center gap-2.5 mb-5"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <TriangleAlert className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <h2 className="font-display font-semibold text-lg text-slate-100">
                  The Catches
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/[0.08] text-amber-400 font-medium">
                  {result.catches.length} found
                </span>
              </motion.div>

              {/* Catches grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              >
                {result.catches.map((text, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="group relative rounded-2xl border border-white/[0.06] bg-[#0d0d16] p-5 cursor-default hover:-translate-y-1 hover:border-amber-500/20 hover:bg-[#10101c] hover:shadow-2xl hover:shadow-amber-500/[0.04] transition-all duration-300"
                  >
                    {/* subtle top glow on hover */}
                    <div className="absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/25 transition-all duration-500" />
                    <div className="flex items-start gap-3.5">
                      <span className="flex-shrink-0 w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-slate-300 text-[13.5px] leading-relaxed">{text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Nuanced take */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: result.catches.length * 0.09 + 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 overflow-hidden"
              >
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                {/* Subtle glow */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 rounded-full bg-emerald-500/[0.07] blur-2xl pointer-events-none" />

                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-semibold text-emerald-400 text-[13.5px] tracking-wide">
                    The Nuanced Take
                  </h3>
                </div>
                <p className="text-slate-300 text-[13.5px] leading-[1.8] relative z-10">
                  {result.nuanced_take}
                </p>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="mx-auto max-w-[1350px] px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center ring-1 ring-amber-400/20">
              <span className="text-[9px] font-bold text-white leading-none">?</span>
            </div>
            <span className="text-[11px] text-slate-600 font-display">
              What&apos;s the Catch
            </span>
          </div>
          <span className="text-[11px] text-slate-700">
            © {new Date().getFullYear()} · MVP · Upgrades coming soon
          </span>
        </div>
      </footer>
    </div>
  )
}
