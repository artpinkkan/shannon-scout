"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import { GLOSSARY_TERMS, TENANTS } from "@/lib/mock-data";
import type { GlossaryTerm, GlossaryCategory } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import {
  Search,
  Plus,
  BookOpen,
  TrendingUp,
  Trash2,
  Edit3,
  BarChart2,
  Tag,
} from "lucide-react";

const categoryConfig: Record<
  GlossaryCategory,
  { label: string; variant: "primary" | "success" | "info" | "warning" | "purple" | "neutral" }
> = {
  finance: { label: "Finance", variant: "success" },
  tech: { label: "Tech", variant: "primary" },
  hr: { label: "HR", variant: "info" },
  banking: { label: "Banking", variant: "warning" },
  acronym: { label: "Acronym", variant: "purple" },
  custom: { label: "Custom", variant: "neutral" },
};

const INDUSTRY_DICTS = [
  {
    id: "finance",
    name: "Finance & FinTech",
    description: "OJK, POJK, KYC, AML, BMPK terms",
    terms: 240,
    active: true,
  },
  {
    id: "tech",
    name: "Technology & Software",
    description: "Distributed systems, cloud, DevOps terms",
    terms: 380,
    active: true,
  },
  {
    id: "hr",
    name: "Human Resources",
    description: "HRIS, PKB, OKR, performance terms",
    terms: 165,
    active: false,
  },
  {
    id: "banking",
    name: "Banking & Perbankan",
    description: "Bank Indonesia, BI RTGS, SLIK, SIPAS",
    terms: 195,
    active: true,
  },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | GlossaryCategory>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [terms, setTerms] = useState(GLOSSARY_TERMS);
  const [newTerm, setNewTerm] = useState({
    term: "",
    expansion: "",
    category: "custom" as GlossaryCategory,
    pronunciation: "",
  });
  const { toasts, showToast, removeToast } = useToast();

  const filtered = terms.filter((t) => {
    const matchSearch =
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.expansion?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || t.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalHits = terms.reduce((a, t) => a + t.hitCount, 0);

  const handleAddTerm = () => {
    if (!newTerm.term) return;
    const t: GlossaryTerm = {
      id: `g${Date.now()}`,
      tenantId: "t1",
      term: newTerm.term,
      expansion: newTerm.expansion || undefined,
      pronunciation: newTerm.pronunciation || undefined,
      category: newTerm.category,
      hitCount: 0,
      addedBy: "Sari Dewi",
      addedAt: new Date().toISOString().split("T")[0],
    };
    setTerms((prev) => [t, ...prev]);
    setShowAddModal(false);
    setNewTerm({ term: "", expansion: "", category: "custom", pronunciation: "" });
    showToast(`Term "${t.term}" added to glossary`, "success");
  };

  const handleDelete = (id: string) => {
    const t = terms.find((t) => t.id === id);
    setTerms((prev) => prev.filter((t) => t.id !== id));
    showToast(`Term "${t?.term}" removed`, "info");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Domain Glossary" subtitle="Per-tenant key term management and analytics" />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Domain Glossary"
          description={`${terms.length}/100 custom terms · ${totalHits} total hits`}
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
              disabled={terms.length >= 100}
            >
              Add Term
            </Button>
          }
        />

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Custom Terms</p>
            <p className="text-2xl font-bold text-slate-100">{terms.length}</p>
            <div className="mt-2 h-1.5 bg-[#252d40] rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${(terms.length / 100) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-600 mt-1">{terms.length}/100 limit</p>
          </div>
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Total Hits</p>
            <p className="text-2xl font-bold text-slate-100">{totalHits}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <p className="text-xs text-emerald-400">+12% this week</p>
            </div>
          </div>
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Industry Dicts</p>
            <p className="text-2xl font-bold text-slate-100">
              {INDUSTRY_DICTS.filter((d) => d.active).length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {INDUSTRY_DICTS.reduce((a, d) => a + (d.active ? d.terms : 0), 0)} terms active
            </p>
          </div>
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Most Hit</p>
            <p className="text-sm font-bold text-slate-100">
              {[...terms].sort((a, b) => b.hitCount - a.hitCount)[0]?.term ?? "—"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {[...terms].sort((a, b) => b.hitCount - a.hitCount)[0]?.hitCount} hits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Left: Custom terms table */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Input
                placeholder="Search terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                fullWidth={false}
                className="w-56"
              />
              <div className="flex items-center gap-1 p-1 bg-[#161b27] border border-[#252d40] rounded-lg">
                {(["all", "finance", "tech", "hr", "banking", "acronym", "custom"] as const).map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setCatFilter(c)}
                      className={`px-2 py-1 text-xs rounded transition-colors capitalize ${
                        catFilter === c
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-[#161b27] border border-[#252d40] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#252d40]">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Term</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Expansion</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Category</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Hits</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Last Seen</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, idx) => (
                    <tr
                      key={t.id}
                      className={`hover:bg-[#1a2030] transition-colors ${
                        idx < filtered.length - 1 ? "border-b border-[#252d40]" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <span className="text-sm font-semibold text-slate-100 font-mono">
                          {t.term}
                        </span>
                        {t.pronunciation && (
                          <span className="ml-2 text-[10px] text-slate-600 italic">
                            /{t.pronunciation}/
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-400 max-w-[180px]">
                        <span className="truncate block">{t.expansion ?? "—"}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge
                          variant={categoryConfig[t.category].variant}
                          size="sm"
                        >
                          {categoryConfig[t.category].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-200">{t.hitCount}</span>
                          <div className="flex-1 max-w-[40px] h-1 bg-[#252d40] rounded-full">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{
                                width: `${Math.min((t.hitCount / 200) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">
                        {t.lastSeen ?? "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-slate-600 hover:text-slate-400 transition-colors">
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No terms match your search.
                </div>
              )}
            </div>
          </div>

          {/* Right: Industry dicts + analytics */}
          <div className="space-y-4">
            {/* Industry dictionaries */}
            <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Industry Dictionaries
              </h3>
              <div className="space-y-2.5">
                {INDUSTRY_DICTS.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-start gap-3 p-2.5 bg-[#0f1117] rounded-lg border border-[#252d40]"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        d.active ? "bg-emerald-400" : "bg-[#252d40]"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200">{d.name}</p>
                      <p className="text-[10px] text-slate-500">{d.description}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {d.terms} terms
                      </p>
                    </div>
                    <button
                      className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                        d.active
                          ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                          : "bg-[#252d40] text-slate-500 hover:bg-[#2e384d]"
                      }`}
                    >
                      {d.active ? "Active" : "Enable"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hit analytics chart */}
            <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Top Term Hits
              </h3>
              <div className="space-y-2">
                {[...terms]
                  .sort((a, b) => b.hitCount - a.hitCount)
                  .slice(0, 6)
                  .map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-300 w-12 text-right shrink-0">
                        {t.term}
                      </span>
                      <div className="flex-1 h-1.5 bg-[#252d40] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{
                            width: `${(t.hitCount / ([...terms].sort((a, b) => b.hitCount - a.hitCount)[0]?.hitCount || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 w-8 shrink-0">
                        {t.hitCount}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Term Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Glossary Term"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddTerm}>
              Add Term
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Term / Acronym"
            placeholder="e.g. BMPK"
            value={newTerm.term}
            onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
          />
          <Input
            label="Full Expansion (optional)"
            placeholder="e.g. Batas Maksimum Pemberian Kredit"
            value={newTerm.expansion}
            onChange={(e) => setNewTerm({ ...newTerm, expansion: e.target.value })}
          />
          <Input
            label="Pronunciation hint (optional)"
            placeholder="e.g. bee-em-pee-kaa"
            value={newTerm.pronunciation}
            onChange={(e) => setNewTerm({ ...newTerm, pronunciation: e.target.value })}
          />
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
            <select
              value={newTerm.category}
              onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value as GlossaryCategory })}
              className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 rounded-md text-sm px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="custom">Custom</option>
              <option value="finance">Finance</option>
              <option value="tech">Tech</option>
              <option value="hr">HR</option>
              <option value="banking">Banking</option>
              <option value="acronym">Acronym</option>
            </select>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
