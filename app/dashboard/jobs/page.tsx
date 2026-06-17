"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import { JOBS, formatCurrency } from "@/lib/mock-data";
import type { Job } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  Plus,
  Search,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
} from "lucide-react";
import Link from "next/link";

const statusVariant: Record<string, "success" | "warning" | "neutral" | "info"> = {
  active: "success",
  paused: "warning",
  draft: "neutral",
  closed: "neutral",
};

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/dashboard/jobs/${job.id}`}>
      <Card hover padding="md" className="group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#252d40] rounded-lg flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {job.title}
              </h3>
              <p className="text-xs text-slate-500">{job.department}</p>
            </div>
          </div>
          <Badge variant={statusVariant[job.status]}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {job.type.replace("-", " ")}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            {job.applicantCount} applicants
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#252d40]">
          <div>
            <p className="text-xs text-slate-400">
              {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            Closes {new Date(job.closesAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = JOBS.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || j.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: JOBS.length,
    active: JOBS.filter((j) => j.status === "active").length,
    paused: JOBS.filter((j) => j.status === "paused").length,
    draft: JOBS.filter((j) => j.status === "draft").length,
    closed: JOBS.filter((j) => j.status === "closed").length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Jobs" subtitle="Manage job postings across all organizations" />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Job Postings"
          description={`${statusCounts.active} active openings across ${new Set(JOBS.map((j) => j.tenantId)).size} organizations`}
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowNewModal(true)}
            >
              Post Job
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            fullWidth={false}
            className="w-64"
          />
          <div className="flex items-center gap-1 p-1 bg-[#161b27] border border-[#252d40] rounded-lg">
            {(["all", "active", "paused", "draft"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={[
                  "px-3 py-1.5 text-xs font-medium rounded transition-colors",
                  filter === s
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200",
                ].join(" ")}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="ml-1.5 text-[10px] opacity-70">
                  {statusCounts[s]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No jobs found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* New Job Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Post New Job"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowNewModal(false)}>
              Create Job Posting
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Job Title" placeholder="e.g. Senior Backend Engineer" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Department" placeholder="e.g. Engineering" />
            <Input label="Location" placeholder="e.g. Jakarta Selatan" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
              <select className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 rounded-md text-sm px-3 py-2">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
              <select className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 rounded-md text-sm px-3 py-2">
                <option>Draft</option>
                <option>Active</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Salary Min (IDR)" placeholder="15000000" type="number" />
            <Input label="Salary Max (IDR)" placeholder="30000000" type="number" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Job Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the role, responsibilities..."
              className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 placeholder-slate-600 rounded-md text-sm px-3 py-2 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
