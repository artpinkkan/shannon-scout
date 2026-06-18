"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import {
  getJobById,
  getCandidatesByJobId,
  getCandidateById,
  formatCurrency,
} from "@/lib/mock-data";
import type { Candidate, PipelineStage, Job } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import MoveStageModal from "@/components/ui/MoveStageModal";
import AuditTrailDrawer from "@/components/ui/AuditTrailDrawer";
import ScheduleInterviewModal from "@/components/ui/ScheduleInterviewModal";
import EditJobModal from "@/components/ui/EditJobModal";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Star,
  Mail,
  Phone,
  ExternalLink,
  Tag,
  BarChart2,
  Shield,
  Video,
  Edit,
} from "lucide-react";

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
  const jobData = getJobById(jobId);
  const [job, setJob] = useState<Job | undefined>(jobData);
  const [candidates, setCandidates] = useState<Candidate[]>(() => getCandidatesByJobId(jobId));
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [moveStageOpen, setMoveStageOpen] = useState(false);
  const [auditDrawerOpen, setAuditDrawerOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editJobOpen, setEditJobOpen] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  if (!job || !jobData) {
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
                onClick={() => setAuditDrawerOpen(true)}
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Audit Trail
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/dashboard/jobs/${jobId}/ranking`)}
              >
                <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
                View Rankings
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditJobOpen(true)}
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit Job
              </Button>
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
              value: `${candidates.length} total`,
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
              const stageCandidates = candidates.filter(
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMoveStageOpen(true)}
              >
                Move Stage
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Video className="w-3.5 h-3.5" />}
                onClick={() => setScheduleModalOpen(true)}
              >
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

      {moveStageOpen && selectedCandidate && (
        <MoveStageModal
          candidateName={selectedCandidate.name}
          currentStage={selectedCandidate.stage}
          onConfirm={(newStage, reason) => {
            setCandidates((prev) =>
              prev.map((c) =>
                c.id === selectedCandidate.id ? { ...c, stage: newStage } : c
              )
            );
            setSelectedCandidate((prev) =>
              prev ? { ...prev, stage: newStage } : prev
            );
            setMoveStageOpen(false);
            showToast(
              `${selectedCandidate.name} moved to ${newStage.charAt(0).toUpperCase() + newStage.slice(1)}${reason ? ` — "${reason}"` : ""}`,
              "success"
            );
          }}
          onClose={() => setMoveStageOpen(false)}
        />
      )}

      <AuditTrailDrawer
        jobId={jobId}
        isOpen={auditDrawerOpen}
        onClose={() => setAuditDrawerOpen(false)}
      />

      {scheduleModalOpen && selectedCandidate && (
        <ScheduleInterviewModal
          prefilledCandidateId={selectedCandidate.id}
          prefilledCandidateName={selectedCandidate.name}
          prefilledJobId={jobId}
          prefilledJobTitle={job.title}
          onConfirm={(data) => {
            setScheduleModalOpen(false);
            setSelectedCandidate(null);
            showToast(
              `Interview scheduled for ${data.candidateName} on ${data.date} at ${data.time}`,
              "success"
            );
          }}
          onClose={() => setScheduleModalOpen(false)}
        />
      )}

      {editJobOpen && (
        <EditJobModal
          job={job}
          onConfirm={(updated) => {
            setJob((prev) => (prev ? { ...prev, ...updated } : prev));
            setEditJobOpen(false);
            showToast("Job updated successfully", "success");
          }}
          onClose={() => setEditJobOpen(false)}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
