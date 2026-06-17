"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import {
  getJobById,
  getCandidatesByJobId,
  formatCurrency,
} from "@/lib/mock-data";
import type { Candidate, PipelineStage } from "@/lib/types";
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
} from "lucide-react";

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: "screening", label: "Screening", color: "bg-slate-500" },
  { id: "interview", label: "Interview", color: "bg-indigo-500" },
  { id: "decision", label: "Decision", color: "bg-amber-500" },
  { id: "hired", label: "Hired", color: "bg-emerald-500" },
  { id: "rejected", label: "Rejected", color: "bg-red-500" },
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
      className="bg-[#0f1117] border border-[#252d40] rounded-lg p-3 cursor-pointer hover:border-indigo-600/40 hover:bg-[#161b27] transition-all group"
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: candidate.avatarColor }}
        >
          {candidate.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
            {candidate.name}
          </p>
          <p className="text-[10px] text-slate-500 truncate">
            {candidate.currentRole} @ {candidate.currentCompany}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-300">{candidate.score}</span>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {candidate.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 bg-[#252d40] text-slate-400 rounded"
            >
              {tag.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-slate-600 mt-1.5">
        Applied {new Date(candidate.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
      </p>
    </div>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const job = getJobById(jobId);
  const allCandidates = getCandidatesByJobId(jobId);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  if (!job) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Job Not Found" />
        <div className="flex-1 flex items-center justify-center text-slate-500">
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
              <Button variant="secondary" size="sm">Edit Job</Button>
            </div>
          }
        />

        {/* Job details bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Location",
              value: job.location,
              icon: <MapPin className="w-4 h-4 text-slate-400" />,
            },
            {
              label: "Type",
              value: job.type.replace("-", " "),
              icon: <Clock className="w-4 h-4 text-slate-400" />,
            },
            {
              label: "Salary Range",
              value: `${formatCurrency(job.salaryMin)} – ${formatCurrency(job.salaryMax)}`,
              icon: <DollarSign className="w-4 h-4 text-slate-400" />,
            },
            {
              label: "Applicants",
              value: `${allCandidates.length} total`,
              icon: <Users className="w-4 h-4 text-slate-400" />,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#161b27] border border-[#252d40] rounded-xl p-4 flex items-center gap-3"
            >
              {item.icon}
              <div>
                <p className="text-[10px] text-slate-500">{item.label}</p>
                <p className="text-sm font-medium text-slate-200 capitalize">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban pipeline */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">
            Candidate Pipeline
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {STAGES.map((stage) => {
              const stageCandidates = allCandidates.filter(
                (c) => c.stage === stage.id
              );
              return (
                <div key={stage.id} className="flex flex-col gap-2">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <p className="text-xs font-semibold text-slate-400">
                      {stage.label}
                    </p>
                    <span className="ml-auto text-xs text-slate-600 bg-[#161b27] px-1.5 py-0.5 rounded-full">
                      {stageCandidates.length}
                    </span>
                  </div>
                  {/* Drop zone */}
                  <div className="min-h-[120px] bg-[#0f1117] border border-dashed border-[#252d40] rounded-xl p-2 flex flex-col gap-2">
                    {stageCandidates.map((c) => (
                      <CandidateCard
                        key={c.id}
                        candidate={c}
                        onClick={() => setSelectedCandidate(c)}
                      />
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-[10px] text-slate-700">No candidates</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Candidate drawer / modal */}
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
            {/* Header */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: selectedCandidate.avatarColor }}
              >
                {selectedCandidate.avatarInitials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {selectedCandidate.name}
                </h3>
                <p className="text-sm text-slate-400">
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
                    <span className="text-sm font-bold text-slate-200">
                      {selectedCandidate.score}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                {selectedCandidate.email}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-slate-500" />
                {selectedCandidate.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500" />
                {selectedCandidate.location}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Briefcase className="w-4 h-4 text-slate-500" />
                {selectedCandidate.yearsExperience} years experience
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((s) => (
                  <Badge key={s} variant="primary" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Education</p>
              <p className="text-sm text-slate-200">
                {selectedCandidate.education} · {selectedCandidate.university}
              </p>
              <p className="text-xs text-slate-500">GPA: {selectedCandidate.gpa}</p>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 bg-[#1e2535] text-slate-400 rounded-full border border-[#252d40]"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {t.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedCandidate.notes.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">
                  Recruiter Notes
                </p>
                {selectedCandidate.notes.map((n) => (
                  <div
                    key={n.id}
                    className="bg-[#0f1117] border border-[#252d40] rounded-lg p-3"
                  >
                    <p className="text-xs text-slate-300">{n.content}</p>
                    <p className="text-[10px] text-slate-600 mt-1">
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
