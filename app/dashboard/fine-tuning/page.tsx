import React from "react";
import Header from "@/components/layout/Header";
import { Zap, AlertTriangle, Brain, Database, BarChart3, Code } from "lucide-react";

function Phase2Banner() {
  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-amber-600/10 border border-amber-600/30">
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
      <p className="text-sm text-amber-400 font-medium">
        Phase 2 — available after compliance trigger.{" "}
        <span className="text-amber-500/80 font-normal">
          Code-switching fine-tuning requires a minimum of 500 annotated utterances and Phase 2 activation.
        </span>
      </p>
      <span className="ml-auto text-xs bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded font-medium">
        Phase 2
      </span>
    </div>
  );
}

export default function FineTuningPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Code-Switching Fine-tuning" />

      <Phase2Banner />

      <div className="flex-1 overflow-y-auto p-6 opacity-50 pointer-events-none">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-neutral-900">
            Code-Switching ASR Fine-tuning
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Train custom language models on your organization's Indonesian-English code-switched data
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Annotated Utterances", value: "0", req: "500 min", icon: <Database className="w-5 h-5 text-neutral-400" /> },
            { label: "Training Jobs", value: "0", req: "Pending", icon: <Zap className="w-5 h-5 text-neutral-400" /> },
            { label: "Models Trained", value: "0", req: "—", icon: <Brain className="w-5 h-5 text-neutral-400" /> },
            { label: "WER Improvement", value: "—", req: "—", icon: <BarChart3 className="w-5 h-5 text-neutral-400" /> },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-neutral-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-neutral-400">{s.label}</p>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-xs text-amber-500 mt-1">{s.req}</p>
            </div>
          ))}
        </div>

        {/* Pipeline steps */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Fine-tuning Pipeline</h2>
          <div className="flex items-center gap-0">
            {[
              { step: "1", label: "Collect Data", desc: "500+ annotated utterances" },
              { step: "2", label: "Pre-process", desc: "Normalize & tokenize" },
              { step: "3", label: "Fine-tune", desc: "Custom model training" },
              { step: "4", label: "Evaluate", desc: "WER/CER benchmarks" },
              { step: "5", label: "Deploy", desc: "A/B rollout" },
            ].map((item, i, arr) => (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-400">
                    {item.step}
                  </div>
                  <p className="text-xs font-medium text-neutral-400 text-center">{item.label}</p>
                  <p className="text-[10px] text-slate-700 text-center">{item.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-8 h-0.5 bg-neutral-100 shrink-0 mb-6" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-700">Training Config</h2>
            </div>
            <pre className="text-[10px] text-neutral-400 font-mono bg-neutral-50 p-3 rounded-lg overflow-hidden">
{`{
  "base_model": "whisper-medium",
  "language": "id",
  "code_switch": true,
  "epochs": 3,
  "learning_rate": 1e-5,
  "batch_size": 16,
  "warmup_steps": 500
}`}
            </pre>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-neutral-700 mb-3">Requirements</h2>
            <ul className="space-y-2.5">
              {[
                { done: false, text: "Minimum 500 annotated utterances" },
                { done: false, text: "Phase 2 compliance trigger enabled" },
                { done: false, text: "GPU compute credits allocated" },
                { done: false, text: "Data residency confirmed (ID region)" },
                { done: false, text: "Admin approval for model deployment" },
              ].map((req) => (
                <li key={req.text} className="flex items-center gap-2.5 text-xs text-neutral-400">
                  <div className="w-4 h-4 rounded border-2 border-neutral-200 flex items-center justify-center shrink-0" />
                  {req.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
