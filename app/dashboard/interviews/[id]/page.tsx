"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInterviewById, formatTimestamp } from "@/lib/mock-data";
import { useMockTranscript } from "@/hooks/useMockTranscript";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Circle,
  StopCircle,
  Wifi,
  WifiOff,
  Clock,
  Users,
  Activity,
  ChevronRight,
  Volume2,
  MoreVertical,
  Settings,
} from "lucide-react";
import Link from "next/link";

function VADIndicator({ active }: { active: boolean }) {
  return (
    <div className={`flex items-end gap-0.5 h-4 ${active ? "" : "opacity-30"}`}>
      {[3, 5, 7, 5, 3].map((h, i) => (
        <div
          key={i}
          className={`w-1 bg-emerald-400 rounded-full ${active ? "vad-bar" : ""}`}
          style={{ height: `${h * 2}px` }}
        />
      ))}
    </div>
  );
}

function TranscriptLine({
  segment,
}: {
  segment: ReturnType<typeof useMockTranscript>["segments"][0];
}) {
  const isInterviewer = segment.speaker === "S1";

  const renderTextWithHighlights = (text: string, codeSwitchWords?: string[], keyTerms?: string[]) => {
    if (!codeSwitchWords?.length && !keyTerms?.length) {
      return <span>{text}</span>;
    }

    const words = text.split(" ");
    return (
      <>
        {words.map((word, i) => {
          const cleanWord = word.replace(/[.,?!;:]/g, "").toLowerCase();
          const isCodeSwitch = codeSwitchWords?.some(
            (cw) => cw.toLowerCase() === cleanWord || text.toLowerCase().includes(cw.toLowerCase())
          );
          const isKeyTerm = keyTerms?.some(
            (kt) => kt.toLowerCase() === cleanWord || kt.toLowerCase().includes(cleanWord)
          );

          const wordIsCodeSwitch = codeSwitchWords?.some(
            (cw) => word.toLowerCase().replace(/[.,?!;:]/g, "").includes(cw.toLowerCase())
          );
          const wordIsKeyTerm = keyTerms?.some(
            (kt) => word.toLowerCase().replace(/[.,?!;:]/g, "") === kt.toLowerCase()
          );

          return (
            <span key={i}>
              {wordIsCodeSwitch ? (
                <mark className="bg-amber-500/20 text-amber-300 rounded px-0.5 font-medium not-italic">
                  {word}
                </mark>
              ) : wordIsKeyTerm ? (
                <mark className="bg-indigo-500/20 text-indigo-300 rounded px-0.5 not-italic">
                  {word}
                </mark>
              ) : (
                word
              )}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={`flex gap-3 mb-3 ${isInterviewer ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 ${
          isInterviewer ? "bg-indigo-600" : "bg-amber-600"
        }`}
      >
        {segment.speaker}
      </div>

      <div className={`flex-1 max-w-[85%] ${isInterviewer ? "" : "items-end flex flex-col"}`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-1 ${isInterviewer ? "" : "flex-row-reverse"}`}>
          <span className="text-[10px] font-semibold text-slate-400">
            {segment.speakerLabel}
          </span>
          <span className="text-[10px] text-slate-600">
            {formatTimestamp(segment.startTime)}
          </span>
          {/* Confidence badge */}
          <span
            className={`text-[9px] px-1 py-0.5 rounded font-medium ${
              segment.confidence >= 0.93
                ? "bg-emerald-600/20 text-emerald-400"
                : segment.confidence >= 0.85
                ? "bg-amber-600/20 text-amber-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {Math.round(segment.confidence * 100)}%
          </span>
          {segment.hasCodeSwitch && (
            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-600/10 text-amber-600 font-medium">
              CS
            </span>
          )}
        </div>

        {/* Text bubble */}
        <div
          className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
            isInterviewer
              ? "bg-[#1e2535] text-slate-200 rounded-tl-none border border-[#252d40]"
              : "bg-indigo-600/20 text-slate-200 rounded-tr-none border border-indigo-600/20"
          }`}
        >
          {renderTextWithHighlights(
            segment.text,
            segment.codeSwitchWords,
            segment.keyTerms
          )}
        </div>

        {/* Key terms */}
        {segment.keyTerms && segment.keyTerms.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isInterviewer ? "" : "justify-end"}`}>
            {segment.keyTerms.map((kt) => (
              <span
                key={kt}
                className="text-[9px] px-1.5 py-0.5 bg-indigo-600/10 text-indigo-400 rounded border border-indigo-600/20"
              >
                {kt}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const interview = getInterviewById(params.id as string);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const {
    segments,
    isRecording,
    partialText,
    toggleRecording,
    clearTranscript,
    asrLatencyMs,
    connectionQuality,
    isVadActive,
  } = useMockTranscript({ intervalMs: 2500 });

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [segments, partialText]);

  if (!interview) {
    return (
      <div className="flex flex-col h-full bg-[#0a0d14] items-center justify-center text-slate-500">
        Interview not found.
      </div>
    );
  }

  const qualityColor = {
    excellent: "text-emerald-400",
    good: "text-amber-400",
    poor: "text-red-400",
  }[connectionQuality];

  const qualityIcon =
    connectionQuality === "poor" ? (
      <WifiOff className={`w-3.5 h-3.5 ${qualityColor}`} />
    ) : (
      <Wifi className={`w-3.5 h-3.5 ${qualityColor}`} />
    );

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1117] border-b border-[#1e2535] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/interviews" className="text-slate-500 hover:text-slate-300 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-slate-200">{interview.candidateName}</p>
            <p className="text-xs text-slate-500">{interview.jobTitle}</p>
          </div>
          {interview.status === "live" && (
            <Badge variant="danger" dot>Live</Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-1.5 text-sm font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {formatTimestamp(elapsed)}
          </div>

          {/* Connection quality */}
          <div className="flex items-center gap-1.5">
            {qualityIcon}
            <span className={`text-xs ${qualityColor} capitalize`}>
              {connectionQuality}
            </span>
          </div>

          {/* ASR latency */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Activity className="w-3 h-3" />
            <span className={asrLatencyMs > 400 ? "text-amber-400" : "text-slate-400"}>
              {asrLatencyMs}ms
            </span>
          </div>

          {/* VAD */}
          <div className="flex items-center gap-1.5">
            <VADIndicator active={isVadActive && isRecording} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col bg-[#0a0d14] p-4 gap-3">
          {/* Main video */}
          <div className="flex-1 bg-[#0f1117] rounded-2xl border border-[#1e2535] relative overflow-hidden flex items-center justify-center">
            {/* Mock interviewer video */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f1117] to-[#161b27]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-indigo-600/30 border-2 border-indigo-600/50 flex items-center justify-center text-2xl font-bold text-indigo-300">
                  {interview.interviewerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <p className="text-sm text-slate-400">{interview.interviewerName}</p>
                <p className="text-xs text-slate-600">{interview.interviewerRole}</p>
              </div>
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/20 border border-red-600/40 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-red-400">REC</span>
              </div>
            )}

            {/* Participant count */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#0f1117]/80 border border-[#1e2535] rounded-full px-2.5 py-1">
              <Users className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-400">2</span>
            </div>
          </div>

          {/* Self view + participant tiles */}
          <div className="flex gap-2 h-24">
            {/* Self (candidate) */}
            <div className="w-40 bg-[#161b27] rounded-xl border border-[#252d40] relative overflow-hidden flex items-center justify-center shrink-0">
              {cameraOn ? (
                <div className="w-full h-full bg-gradient-to-br from-[#1e2535] to-[#252d40] flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-sm font-bold text-white">
                    {interview.candidateName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <VideoOff className="w-5 h-5 text-slate-600" />
                  <p className="text-[10px] text-slate-600">Camera off</p>
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1">
                <span className="text-[9px] text-slate-400 bg-[#0f1117]/70 px-1 rounded">
                  {interview.candidateName.split(" ")[0]}
                </span>
                {!micOn && <MicOff className="w-2.5 h-2.5 text-red-400" />}
              </div>
            </div>

            {/* LiveKit placeholder tiles */}
            <div className="flex-1 bg-[#0f1117] rounded-xl border border-dashed border-[#1e2535] flex items-center justify-center">
              <p className="text-[10px] text-slate-700">
                LiveKit participant tiles
              </p>
            </div>
          </div>
        </div>

        {/* Transcript panel */}
        <div className="w-[380px] border-l border-[#1e2535] flex flex-col bg-[#0f1117]">
          {/* Transcript header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2535]">
            <div>
              <p className="text-xs font-semibold text-slate-300">Live Transcript</p>
              <p className="text-[10px] text-slate-600">{interview.asrProvider} · {interview.language === "mixed" ? "ID/EN" : interview.language.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearTranscript}
                className="p-1 text-slate-600 hover:text-slate-400 transition-colors"
                title="Clear transcript"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1e2535] bg-[#0a0d14]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-indigo-600" />
              <span className="text-[10px] text-slate-500">S1 {interview.interviewerName.split(" ")[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-600" />
              <span className="text-[10px] text-slate-500">S2 {interview.candidateName.split(" ")[0]}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-600/10 text-amber-600 rounded">EN in ID</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-600/10 text-indigo-400 rounded">keyterm</span>
            </div>
          </div>

          {/* Transcript body */}
          <div className="flex-1 overflow-y-auto p-4">
            {segments.length === 0 && !isRecording && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Mic className="w-8 h-8 text-slate-700 mb-3" />
                <p className="text-xs text-slate-600">
                  Press Record to start live transcription
                </p>
              </div>
            )}

            {segments.map((seg) => (
              <TranscriptLine key={seg.id} segment={seg} />
            ))}

            {/* Partial text */}
            {partialText && isRecording && (
              <div className="flex gap-3 mb-3 opacity-60">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] shrink-0" />
                <div className="flex-1 px-3 py-2 bg-[#252d40] rounded-xl text-xs text-slate-400 italic">
                  {partialText}
                  <span className="inline-block w-1 h-3 bg-slate-500 animate-pulse ml-0.5 align-middle" />
                </div>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          {/* Transcript footer stats */}
          <div className="px-4 py-2 border-t border-[#1e2535] bg-[#0a0d14]">
            <div className="flex items-center justify-between text-[10px] text-slate-600">
              <span>{segments.length} segments</span>
              <span className={asrLatencyMs > 400 ? "text-amber-500" : ""}>
                ASR: {asrLatencyMs}ms
              </span>
              <span>Lang: ID+EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0f1117] border-t border-[#1e2535] shrink-0">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMicOn((v) => !v)}
            className={[
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              micOn
                ? "bg-[#1e2535] text-slate-300 hover:bg-[#252d40]"
                : "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30",
            ].join(" ")}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setCameraOn((v) => !v)}
            className={[
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              cameraOn
                ? "bg-[#1e2535] text-slate-300 hover:bg-[#252d40]"
                : "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30",
            ].join(" ")}
            title={cameraOn ? "Stop video" : "Start video"}
          >
            {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          <button className="w-10 h-10 rounded-full bg-[#1e2535] text-slate-300 hover:bg-[#252d40] flex items-center justify-center transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>

          <button className="w-10 h-10 rounded-full bg-[#1e2535] text-slate-300 hover:bg-[#252d40] flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Record */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={toggleRecording}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all",
              isRecording
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30",
            ].join(" ")}
          >
            {isRecording ? (
              <>
                <StopCircle className="w-4 h-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 fill-current" />
                Start Recording
              </>
            )}
          </button>
          {isRecording && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-red-400">Recording & Transcribing</span>
            </div>
          )}
        </div>

        {/* Right: End call + review */}
        <div className="flex items-center gap-2">
          {interview.status === "completed" || segments.length > 0 ? (
            <Link href={`/dashboard/interviews/${interview.id}/review`}>
              <Button variant="secondary" size="sm">
                AI Review
              </Button>
            </Link>
          ) : null}

          <button
            onClick={() => router.push("/dashboard/interviews")}
            className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-red-600/30"
            title="End call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
