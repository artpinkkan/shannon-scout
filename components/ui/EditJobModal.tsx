"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";
import Button from "./Button";
import type { Job } from "@/lib/types";

interface Props {
  job: Job;
  onConfirm: (updated: Partial<Job>) => void;
  onClose: () => void;
}

const JOB_TYPES = ["full-time", "part-time", "contract", "internship"] as const;
const JOB_STATUSES = ["draft", "active", "paused", "closed"] as const;

export default function EditJobModal({ job, onConfirm, onClose }: Props) {
  const [title, setTitle] = useState(job.title);
  const [department, setDepartment] = useState(job.department);
  const [location, setLocation] = useState(job.location);
  const [type, setType] = useState(job.type);
  const [status, setStatus] = useState(job.status);
  const [salaryMin, setSalaryMin] = useState(String(job.salaryMin));
  const [salaryMax, setSalaryMax] = useState(String(job.salaryMax));
  const [description, setDescription] = useState(job.description);

  const labelClass = "block text-xs font-medium text-neutral-700 mb-1.5";
  const inputClass =
    "w-full text-sm text-neutral-900 bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0E5E6F] transition-colors";

  const canSave = title.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-neutral-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Edit Job</h2>
            <p className="text-sm text-neutral-400 mt-0.5">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 mt-0.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className={labelClass}>Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Senior Product Manager"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Job["type"])}
                className={inputClass}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Job["status"])}
                className={inputClass}
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Min Salary (IDR)</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className={inputClass}
                min={0}
                step={1000000}
              />
            </div>
            <div>
              <label className={labelClass}>Max Salary (IDR)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className={inputClass}
                min={0}
                step={1000000}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full text-sm text-neutral-900 bg-white border border-neutral-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0E5E6F] transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!canSave}
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={() =>
              canSave &&
              onConfirm({
                title,
                department,
                location,
                type,
                status,
                salaryMin: Number(salaryMin),
                salaryMax: Number(salaryMax),
                description,
              })
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
