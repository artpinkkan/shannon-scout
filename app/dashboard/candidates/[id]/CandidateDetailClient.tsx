"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import { getCandidateById, INTERVIEWS, formatCurrency } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Star,
  Tag,
  MessageSquare,
  Plus,
  Video,
  ExternalLink,
  Clock,
} from "lucide-react";
import type { PipelineStage } from "@/lib/types";
import Link from "next/link";

const stageVariant: Record<PipelineStage, "neutral" | "info" | "warning" | "success" | "danger"> = {
  screening: "neutral",
  interview: "info",
  decision: "warning",
  hired: "success",
  rejected: "danger",
};

export default function CandidateDetailClient() {
  const params = useParams();
  const candidate = getCandidateById(params.id as string);
  const [newNote, setNewNote] = useState("");

  if (!candidate) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Candidate Not Found" />
        <div className="flex-1 flex items-center justify-center text-neutral-400">
          Candidate not found.
        </div>
      </div>
    );
  }

  const relatedInterviews = INTERVIEWS.filter(
    (i) => i.candidateId === candidate.id
  );

  const STAGES: PipelineStage[] = ["screening", "interview", "decision", "hired", "rejected"];
  const stageIdx = STAGES.indexOf(candidate.stage);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={candidate.name}
        subtitle={`${candidate.currentRole} · ${candidate.jobTitle}`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title={candidate.name}
          breadcrumbs={[
            { label: "Candidates", href: "/dashboard/candidates" },
            { label: candidate.name },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">Move Stage</Button>
              <Button variant="primary" size="sm" leftIcon={<Video className="w-4 h-4" />}>
                Schedule Interview
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-3 gap-5">
          <div className="space-y-4">
            <Card padding="lg">
              <div className="flex flex-col items-center text-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
                  style={{ backgroundColor: candidate.avatarColor }}
                >
                  {candidate.avatarInitials}
                </div>
                <h2 className="text-base font-bold text-neutral-900">
                  {candidate.name}
                </h2>
                <p className="text-sm text-neutral-400 mt-0.5">
                  {candidate.currentRole}
                </p>
                <p className="text-xs text-neutral-400">{candidate.currentCompany}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant={stageVariant[candidate.stage]} dot>
                    {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-neutral-700">
                      {candidate.score}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-neutral-400">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-400">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  {candidate.phone}
                </div>
                <div className="flex items-center gap-2.5 text-neutral-400">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                  {candidate.location}
                </div>
                <div className="flex items-center gap-2.5 text-neutral-400">
                  <Briefcase className="w-4 h-4 text-neutral-400 shrink-0" />
                  {candidate.yearsExperience} years experience
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <p>{candidate.education}</p>
                    <p className="text-xs text-slate-500">
                      {candidate.university} · GPA {candidate.gpa}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-neutral-400">
                  <Globe className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {candidate.languages.map((l) => (
                      <Badge key={l} variant="neutral" size="sm">
                        {l}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <a
                  href={`https://${candidate.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[#0E5E6F] hover:text-[#09414D] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  LinkedIn Profile
                </a>
              </div>
            </Card>

            <Card padding="md">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((s) => (
                  <Badge key={s} variant="primary" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card padding="md">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {candidate.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 bg-neutral-100 text-neutral-400 rounded-full"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {t.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <div className="col-span-2 space-y-4">
            <Card padding="md">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Pipeline Progress
              </h3>
              <div className="flex items-center gap-0">
                {STAGES.map((stage, i) => {
                  const isActive = i === stageIdx;
                  const isDone = i < stageIdx;
                  const isRejected = candidate.stage === "rejected";
                  return (
                    <React.Fragment key={stage}>
                      <div className="flex flex-col items-center">
                        <div
                          className={[
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                            isActive && !isRejected
                              ? "bg-[#0E5E6F] border-[#0E5E6F] text-white"
                              : isActive && isRejected
                              ? "bg-[#C0392B] border-[#C0392B] text-white"
                              : isDone
                              ? "bg-[#E8F5EE] border-[#1A7F4B] text-[#1A7F4B]"
                              : "bg-neutral-100 border-neutral-200 text-neutral-400",
                          ].join(" ")}
                        >
                          {i + 1}
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-1 capitalize">
                          {stage}
                        </p>
                      </div>
                      {i < STAGES.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 ${isDone ? "bg-[#1A7F4B]" : "bg-neutral-200"}`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </Card>

            <Card padding="md">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Applied Position
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-700">
                    {candidate.jobTitle}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Applied {new Date(candidate.appliedAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <Link href={`/dashboard/jobs/${candidate.jobId}`}>
                  <Button variant="ghost" size="xs">
                    View Job
                  </Button>
                </Link>
              </div>
            </Card>

            {relatedInterviews.length > 0 && (
              <Card padding="md">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Interview History
                </h3>
                <div className="space-y-2">
                  {relatedInterviews.map((iv) => (
                    <div
                      key={iv.id}
                      className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <Video className="w-4 h-4 text-neutral-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-neutral-700">
                          {iv.interviewerName} · {iv.interviewerRole}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {new Date(iv.scheduledAt).toLocaleDateString("id-ID")} · {iv.durationMinutes} min
                        </p>
                      </div>
                      <Badge
                        variant={
                          iv.status === "completed" ? "success" : iv.status === "live" ? "danger" : "info"
                        }
                        size="sm"
                      >
                        {iv.status}
                      </Badge>
                      <Link href={`/dashboard/interviews/${iv.id}`}>
                        <Button variant="ghost" size="xs">
                          {iv.status === "completed" ? "Review" : "Join"}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card padding="md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Recruiter Notes
                </h3>
                <Badge variant="neutral" size="sm">
                  {candidate.notes.length} notes
                </Badge>
              </div>

              {candidate.notes.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-4">
                  No notes yet. Add the first one below.
                </p>
              ) : (
                <div className="space-y-2 mb-4">
                  {candidate.notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                    >
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {n.content}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1.5">
                        {n.author} · {n.createdAt}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                  className="flex-1 bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-lg text-xs px-3 py-2 resize-none focus:outline-none focus:border-[#0E5E6F] transition-colors"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setNewNote("")}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
