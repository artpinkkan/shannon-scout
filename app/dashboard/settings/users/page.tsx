"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Plus, Mail } from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const TEAM_MEMBERS = [
  { id: "1", name: "Sari Dewi Kusuma", email: "sari@mandiritech.co.id", role: "Admin", initials: "SD", color: "#0E5E6F" },
  { id: "2", name: "Budi Santoso", email: "budi@mandiritech.co.id", role: "Recruiter", initials: "BS", color: "#4338CA" },
  { id: "3", name: "Anita Rahayu", email: "anita@mandiritech.co.id", role: "Interviewer", initials: "AR", color: "#1A7F4B" },
  { id: "4", name: "Dian Pratiwi", email: "dian@mandiritech.co.id", role: "Recruiter", initials: "DP", color: "#B45309" },
];

const roleVariant: Record<string, "primary" | "info" | "success" | "warning" | "neutral"> = {
  Admin: "primary",
  Recruiter: "info",
  Interviewer: "success",
  Viewer: "neutral",
};

export default function UsersSettingsPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Recruiter");
  const { toasts, showToast, removeToast } = useToast();

  const handleInvite = () => {
    if (!inviteEmail) return;
    showToast(`Invitation sent to ${inviteEmail}`, "success");
    setInviteEmail("");
    setShowInviteModal(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Team Members" subtitle="Manage access and roles" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-neutral-900">Team Members</h1>
            <p className="text-sm text-neutral-400 mt-0.5">{TEAM_MEMBERS.length} members</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowInviteModal(true)}
          >
            Invite User
          </Button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Member</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Role</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {TEAM_MEMBERS.map((member, idx) => (
                <tr
                  key={member.id}
                  className={`hover:bg-neutral-50 transition-colors ${idx < TEAM_MEMBERS.length - 1 ? "border-b border-neutral-100" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.initials}
                      </div>
                      <p className="text-sm font-medium text-neutral-700">{member.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">{member.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={roleVariant[member.role] ?? "neutral"} size="sm">
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="xs">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleInvite} leftIcon={<Mail className="w-4 h-4" />}>
              Send Invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm h-9 px-3 focus:outline-none focus:border-[#0E5E6F]"
            >
              <option>Admin</option>
              <option>Recruiter</option>
              <option>Interviewer</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
