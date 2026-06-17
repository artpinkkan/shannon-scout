"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import { NLP_SETTINGS } from "@/lib/mock-data";
import type { NLPSettings } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import {
  Settings,
  Activity,
  Mic,
  Languages,
  BookOpen,
  Users,
  Plus,
  Trash2,
  Info,
  Save,
} from "lucide-react";

export default function NLPSettingsPage() {
  const [settings, setSettings] = useState<NLPSettings>({ ...NLP_SETTINGS });
  const [newFiller, setNewFiller] = useState("");
  const [newParticle, setNewParticle] = useState("");
  const { toasts, showToast, removeToast } = useToast();

  const update = (key: keyof NLPSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const addFiller = () => {
    if (!newFiller.trim()) return;
    update("fillerWords", [...settings.fillerWords, newFiller.trim()]);
    setNewFiller("");
  };

  const removeFiller = (word: string) => {
    update("fillerWords", settings.fillerWords.filter((w) => w !== word));
  };

  const addParticle = () => {
    if (!newParticle.trim()) return;
    update("particlesTarget", [...settings.particlesTarget, newParticle.trim()]);
    setNewParticle("");
  };

  const removeParticle = (p: string) => {
    update("particlesTarget", settings.particlesTarget.filter((w) => w !== p));
  };

  const handleSave = () => {
    showToast("NLP settings saved successfully", "success");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="NLP Settings" subtitle="Indonesian language pipeline configuration" />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Indonesian NLP Pipeline"
          description="Configure ASR post-processing, code-switch detection, and language normalization"
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          }
        />

        <div className="grid grid-cols-2 gap-5">
          {/* ── Punctuation & Text Norm ── */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#0E5E6F]" />
              <h2 className="text-sm font-semibold text-neutral-700">
                Punctuation & Text Normalization
              </h2>
            </div>

            <div className="space-y-4">
              <Toggle
                checked={settings.enablePunctuation}
                onChange={(v) => update("enablePunctuation", v)}
                label="Automatic Punctuation"
                description="Insert commas, periods, and question marks from ASR output"
              />
              <Toggle
                checked={settings.enableInverseTextNorm}
                onChange={(v) => update("enableInverseTextNorm", v)}
                label="Inverse Text Normalization (ITN)"
                description="Convert 'dua puluh ribu' → '20.000', 'delapan persen' → '8%'"
              />
            </div>
          </div>

          {/* ── Filler Removal ── */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-neutral-700">
                Filler Word Removal
              </h2>
            </div>

            <Toggle
              checked={settings.enableFillerRemoval}
              onChange={(v) => update("enableFillerRemoval", v)}
              label="Remove Filler Words"
              description="Automatically strip filler words from transcript output"
            />

            {settings.enableFillerRemoval && (
              <div className="mt-4">
                <p className="text-xs text-neutral-400 mb-2">Filler word list:</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {settings.fillerWords.map((w) => (
                    <span
                      key={w}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full font-mono"
                    >
                      {w}
                      <button
                        onClick={() => removeFiller(w)}
                        className="text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFiller}
                    onChange={(e) => setNewFiller(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFiller()}
                    placeholder="Add filler word..."
                    className="flex-1 bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded text-xs px-2.5 py-1.5 focus:outline-none focus:border-[#0E5E6F]"
                  />
                  <Button variant="secondary" size="xs" onClick={addFiller}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── Code-Switch Labelling ── */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-neutral-700">
                Code-Switch Detection (ID ↔ EN)
              </h2>
            </div>

            <Toggle
              checked={settings.enableCodeSwitchLabelling}
              onChange={(v) => update("enableCodeSwitchLabelling", v)}
              label="Highlight Code-Switched Words"
              description="Flag English words embedded in Bahasa Indonesia sentences (and vice versa)"
            />

            {settings.enableCodeSwitchLabelling && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-neutral-400 mb-2">Highlight color:</p>
                  <div className="flex gap-2">
                    {(["yellow", "blue", "purple", "green"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => update("codeSwitchHighlightColor", c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          settings.codeSwitchHighlightColor === c
                            ? "border-white scale-110"
                            : "border-transparent opacity-60"
                        } ${
                          c === "yellow"
                            ? "bg-amber-400"
                            : c === "blue"
                            ? "bg-sky-400"
                            : c === "purple"
                            ? "bg-purple-400"
                            : "bg-emerald-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <p className="text-xs text-neutral-400">
                    Preview:{" "}
                    <span className="text-neutral-700">
                      Saya sangat{" "}
                    </span>
                    <mark
                      className={`px-0.5 rounded not-italic font-medium ${
                        settings.codeSwitchHighlightColor === "yellow"
                          ? "bg-amber-500/30 text-amber-300"
                          : settings.codeSwitchHighlightColor === "blue"
                          ? "bg-sky-500/30 text-sky-300"
                          : settings.codeSwitchHighlightColor === "purple"
                          ? "bg-purple-500/30 text-purple-300"
                          : "bg-emerald-500/30 text-emerald-300"
                      }`}
                    >
                      excited
                    </mark>
                    <span className="text-neutral-700"> untuk bergabung.</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Particle Normalization ── */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-neutral-700">
                Particle Normalization
              </h2>
            </div>

            <Toggle
              checked={settings.enableParticleNorm}
              onChange={(v) => update("enableParticleNorm", v)}
              label="Normalize Indonesian Particles"
              description="Remove or normalize lah, kan, nih, dong, sih from transcript"
            />

            {settings.enableParticleNorm && (
              <div className="mt-4">
                <p className="text-xs text-neutral-400 mb-2">Target particles:</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {settings.particlesTarget.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-600/10 text-purple-300 border border-purple-600/20 rounded-full font-mono"
                    >
                      {p}
                      <button
                        onClick={() => removeParticle(p)}
                        className="text-purple-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newParticle}
                    onChange={(e) => setNewParticle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addParticle()}
                    placeholder="Add particle..."
                    className="flex-1 bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded text-xs px-2.5 py-1.5 focus:outline-none focus:border-[#0E5E6F]"
                  />
                  <Button variant="secondary" size="xs" onClick={addParticle}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── Glossary Correction ── */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-neutral-700">
                Glossary-Based Correction
              </h2>
            </div>

            <Toggle
              checked={settings.enableGlossaryCorrection}
              onChange={(v) => update("enableGlossaryCorrection", v)}
              label="Apply Glossary Corrections"
              description="Override ASR output with tenant glossary when confidence is below threshold"
            />

            <div className="mt-4">
              <label className="block text-xs text-neutral-400 mb-2">
                Confidence threshold: <span className="text-neutral-700 font-semibold">{settings.confidenceThreshold.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={settings.confidenceThreshold}
                onChange={(e) => update("confidenceThreshold", parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                <span>0.50</span>
                <span>0.75</span>
                <span>0.99</span>
              </div>
            </div>
          </div>

          {/* ── Diarization ── */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#0E5E6F]" />
              <h2 className="text-sm font-semibold text-neutral-700">
                Speaker Diarization
              </h2>
            </div>

            <Toggle
              checked={settings.diarizationEnabled}
              onChange={(v) => update("diarizationEnabled", v)}
              label="Enable Speaker Diarization"
              description="Automatically separate speakers in the transcript (S1, S2, ...)"
            />

            {settings.diarizationEnabled && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">Min speakers</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={settings.minSpeakers}
                    onChange={(e) => update("minSpeakers", parseInt(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 rounded text-sm px-3 py-1.5 focus:outline-none focus:border-[#0E5E6F]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">Max speakers</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={settings.maxSpeakers}
                    onChange={(e) => update("maxSpeakers", parseInt(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 rounded text-sm px-3 py-1.5 focus:outline-none focus:border-[#0E5E6F]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── ASR Performance ── */}
          <div className="col-span-2 bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-neutral-700">
                ASR Performance Targets
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-neutral-400 mb-2">
                  ASR Latency Target:{" "}
                  <span className="text-neutral-700 font-semibold">{settings.asrLatencyTargetMs}ms</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={settings.asrLatencyTargetMs}
                  onChange={(e) => update("asrLatencyTargetMs", parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                  <span>100ms</span>
                  <span className="text-emerald-500">Realtime ≤400ms</span>
                  <span>1000ms</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-[10px] text-neutral-400 mb-0.5">Current WER</p>
                  <p className="text-xl font-bold text-neutral-900">8.2%</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-[10px] text-emerald-400">Below 10% target</p>
                  </div>
                </div>
                <div className="flex-1 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-[10px] text-neutral-400 mb-0.5">Current DER</p>
                  <p className="text-xl font-bold text-neutral-900">5.1%</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-[10px] text-emerald-400">Excellent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
