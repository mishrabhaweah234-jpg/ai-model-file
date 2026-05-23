import { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Analyzing your photo…', emoji: '🔍' },
  { label: 'Mapping outfit to your pose…', emoji: '👗' },
  { label: 'Rendering fabric & lighting…', emoji: '🎨' },
  { label: 'Finalizing your look…', emoji: '✨' },
];

const GenerationProgress = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-peach to-coral flex items-center justify-center text-4xl animate-pulse">
        {STEPS[step].emoji}
      </div>
      <div className="text-center">
        <strong className="font-display text-lg block">{STEPS[step].label}</strong>
        <p className="text-xs text-muted-foreground mt-1">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-coral transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step pills */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {STEPS.map((s, i) => (
          <span
            key={s.label}
            className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border transition ${
              i <= step
                ? 'bg-primary/10 border-primary/30 text-foreground'
                : 'border-border text-muted-foreground/60'
            }`}
          >
            {i < step ? '✓' : i === step ? '●' : '○'} {s.label.replace('…', '')}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GenerationProgress;
