"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import {
  getJobById,
  getCandidatesByJobId,
  getCandidateById,
  getAuditEntriesByJobId,
  formatCurrency,
} from "@/lib/mock-data";
import type { Candidate, PipelineStage, AuditEntityType } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Star,
  MessageSquare,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Tag,
  BarChart2,
  Shield,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileSignature,
  Stethoscope,
  PenLine,
} from "lucide-react";

const AUDIT_ICON: Record<AuditEntityType, React.ReactNode> = {
  ranking_generated: <Sparkles className="w-3 h-3 text-[#0E5E6F]" />,
  stage_advanced: <ChevronRight className="w-3 h-3 text-[#1A7F4B]" />,
  document_sent: <FileSignature className="w-3 h-3 text-indigo-500" />,
  medical_requested: <Stethoscope className="w-3 h-3 text-amber-500" />,
  custom_action: <PenLine className="w-3 h-3 text-neutral-500" />,
};

const AUDIT_BG: Record<AuditEntityType, string> = {
  ranking_generated: "bg-[#E6F4F7]",
  stage_advanced: "bg-[#E8F5EE]",
  document_sent: "bg-indigo-50",
  medical_requested: "bg-amber-50",
  custom_action: "bg-neutral-100",
};

function formatAuditTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: "screening", label: "Screening", color: "bg-neutral-400" },
  { id: "interview", label: "Interview", color: "bg-[#0E5E6F]" },
  { id: "decision", label: "Decision", color: "bg-[#B45309]" },
  { id: "hired", label: "Hired", color: "bg-[#1A7F4B]" },
  { id: "rejected", label: "Rejected", color: "bg-[#C0392B]" },
];

const stageVariant: Record<PipelineStage, "neutral" | "info" | "warning" | "success" | "danger"> = {
  screening: "neutral",
  interview: "info",
  decision: "warning",
  hired: "success",
  rejected: "danger",
};

function CandidateCard({
  candidate,
  onClick,
}: {
  candidate: Candidate;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-neutral-200 rounded-lg p-3 cursor-pointer hover:border-[#0E5E6F]/40 hover:bg-neutral-50 transition-all group"
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: candidate.avatarColor }}
        >
          {candidate.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-neutral-700 truncate group-hover:text-[#0E5E6F] transition-colors">
            {candidate.name}
          </p>
          <p className="text-[10px] text-neutral-400 truncate">
            {candidate.currentRole} @ {candidate.currentCompany}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-neutral-700">{candidate.score}</span>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {candidate.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 bg-neutral-100 text-neutral-400 rounded"
            >
              {tag.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-neutral-400 mt-1.5">
        Applied {new Date(candidate.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
      </p>
    </div>
  );
}

export default function JobDetailClient() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const job = getJobById(jobId);
  const allCandidates = getCandidatesByJobId(jobId);
  const auditEntries = job ? getAuditEntriesByJobId(jobId) : [];
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);

  if (!job) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Job Not Found" />
        <div className="flex-1 flex items-center justify-center text-neutral-400">
          <p>Job posting not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={job.title}
        subtitle={`${job.department} · ${job.location}`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title={job.title}
          breadcrumbs={[
            { label: "Jobs", href: "/dashboard/jobs" },
            { label: job.title },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Badge variant={job.status === "active" ? "success" : "warning"}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/dashboard/jobs/${jobId}/ranking`)}
              >
                <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
                View Rankings
              </Button>
              <Button variant="secondary" size="sm">Edit Job</Button>
            </div>
          }
        />

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Location",
              value: job.location,
              icon: <MapPin className="w-4 h-4 text-neutral-400" />,
            },
            {
              label: "Type",
              value: job.type.replace("-", " "),
              icon: <Clock className="w-4 h-4 text-neutral-400" />,
            },
            {
              label: "Salary Range",
              value: `${formatCurrency(job.salaryMin)} – ${formatCurrency(job.salaryMax)}`,
              icon: <DollarSign className="w-4 h-4 text-neutral-400" />,
            },
            {
              label: "Applicants",
              value: `${allCandidates.length} total`,
              icon: <Users className="w-4 h-4 text-neutral-400" />,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3"
            >
              {item.icon}
              <div>
                <p className="text-[10px] text-neutral-400">{item.label}</p>
                <p className="text-sm font-medium text-neutral-700 capitalize">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">
            Candidate Pipeline
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {STAGES.map((stage) => {
              const stageCandidates = allCandidates.filter(
                (c) => c.stage === stage.id
              );
              return (
                <div key={stage.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <p className="text-xs font-semibold text-neutral-400">
                      {stage.label}
                    </p>
                    <span className="ml-auto text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                      {stageCandidates.length}
                    </span>
                  </div>
                  <div className="min-h-[120px] bg-neutral-50 border border-dashed border-neutral-200 rounded-xl p-2 flex flex-col gap-2">
                    {stageCandidates.map((c) => (
                      <CandidateCard
                        key={c.id}
                        candidate={c}
                        onClick={() => setSelectedCandidate(c)}
                      />
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-[10px] text-neutral-400">No candidates</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Audit Trail ── */}
        <div className="mb-4">
          <button
            onClick={() => setAuditOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neutral-500" />
              <span className="text-sm font-semibold text-neutral-700">Audit Trail</span>
              <span className="text-[11px] px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                {auditEntries.length} entries
              </span>
            </div>
            {auditOpen ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {auditOpen && (
            <div className="mt-2 bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              {auditEntries.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">No audit entries yet.</p>
              ) : (
                auditEntries.map((entry, i) => {
                  const candidate = getCandidateById(entry.candidateId);
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-3 px-4 py-3 ${
                        i < auditEntries.length - 1 ? "border-b border-neutral-100" : ""
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${AUDIT_BG[entry.entityType]}`}>
                        {AUDIT_ICON[entry.entityType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-neutral-700">
                          {entry.action}
                        </span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {candidate?.name ?? entry.candidateId} · {entry.details}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] text-neutral-400">{formatAuditTime(entry.timestamp)}</p>
                        <p className="text-[10px] text-neutral-400 font-medium">{entry.actor}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {selectedCandidate && (
        <Modal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title="Candidate Profile"
          size="lg"
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCandidate(null)}
              >
                Close
              </Button>
              <Button variant="secondary" size="sm">
                Move Stage
              </Button>
              <Button variant="primary" size="sm">
                Schedule Interview
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: selectedCandidate.avatarColor }}
              >
                {selectedCandidate.avatarInitials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {selectedCandidate.name}
                </h3>
                <p className="text-sm text-neutral-400">
                  {selectedCandidate.currentRole} · {selectedCandidate.currentCompany}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={stageVariant[selectedCandidate.stage]}
                    dot
                  >
                    {selectedCandidate.stage.charAt(0).toUpperCase() + selectedCandidate.stage.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-neutral-700">
                      {selectedCandidate.score}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-400">
                <Mail className="w-4 h-4 text-neutral-400" />
                {selectedCandidate.email}
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Phone className="w-4 h-4 text-neutral-400" />
                {selectedCandidate.phone}
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <MapPin className="w-4 h-4 text-neutral-400" />
                {selectedCandidate.location}
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Briefcase className="w-4 h-4 text-neutral-400" />
                {selectedCandidate.yearsExperience} years experience
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-neutral-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((s) => (
                  <Badge key={s} variant="primary" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-neutral-400 mb-1">Education</p>
              <p className="text-sm text-neutral-700">
                {selectedCandidate.education} · {selectedCandidate.university}
              </p>
              <p className="text-xs text-neutral-400">GPA: {selectedCandidate.gpa}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-neutral-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 bg-neutral-100 text-neutral-400 rounded-full border border-neutral-200"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {t.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {selectedCandidate.notes.length > 0 && (
              <div>
                <p className="text-xs font-medium text-neutral-400 mb-2">
                  Recruiter Notes
                </p>
                {selectedCandidate.notes.map((n) => (
                  <div
                    key={n.id}
                    className="bg-neutral-50 border border-neutral-200 rounded-lg p-3"
                  >
                    <p className="text-xs text-neutral-700">{n.content}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      {n.author} · {n.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
