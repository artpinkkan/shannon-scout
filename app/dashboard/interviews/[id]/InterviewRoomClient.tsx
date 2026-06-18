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
          className={`w-1 bg-[#1A7F4B] rounded-full ${active ? "vad-bar" : ""}`}
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
          const wordIsCodeSwitch = codeSwitchWords?.some(
            (cw) => word.toLowerCase().replace(/[.,?!;:]/g, "").includes(cw.toLowerCase())
          );
          const wordIsKeyTerm = keyTerms?.some(
            (kt) => word.toLowerCase().replace(/[.,?!;:]/g, "") === kt.toLowerCase()
          );

          return (
            <span key={i}>
              {wordIsCodeSwitch ? (
                <mark className="bg-transparent text-[#5B4FF5] underline rounded px-0.5 font-medium not-italic">
                  {word}
                </mark>
              ) : wordIsKeyTerm ? (
                <mark className="bg-transparent text-[#0E5E6F] underline decoration-dashed rounded px-0.5 not-italic">
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
      className={`flex gap-3 mb-4 ${isInterviewer ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`px-2 py-0.5 rounded-full flex items-center text-[10px] font-semibold shrink-0 mt-0.5 h-fit ${
          isInterviewer
            ? "bg-[#E6F4F7] text-[#0E5E6F]"
            : "bg-[#EEF2FF] text-[#4338CA]"
        }`}
      >
        {segment.speaker}
      </div>

      <div className={`flex-1 max-w-[85%] ${isInterviewer ? "" : "items-end flex flex-col"}`}>
        <div className={`flex items-center gap-2 mb-1 ${isInterviewer ? "" : "flex-row-reverse"}`}>
          <span className="text-[10px] font-semibold text-neutral-400 font-sans">
            {segment.speakerLabel}
          </span>
          <span className="text-[10px] text-neutral-400 font-sans">
            {formatTimestamp(segment.startTime)}
          </span>
          <span
            className={`text-[9px] px-1 py-0.5 rounded font-medium font-sans ${
              segment.confidence >= 0.93
                ? "bg-[#E8F5EE] text-[#1A7F4B]"
                : segment.confidence >= 0.85
                ? "bg-[#FEF3E2] text-[#B45309]"
                : "bg-[#FDECEA] text-[#C0392B]"
            }`}
          >
            {Math.round(segment.confidence * 100)}%
          </span>
          {segment.hasCodeSwitch && (
            <span className="text-[9px] px-1 py-0.5 rounded bg-[#FEF3E2] text-[#B45309] font-medium font-sans">
              CS
            </span>
          )}
        </div>

        <div
          className={`px-3 py-2 rounded-xl text-xs leading-relaxed font-serif ${
            isInterviewer
              ? "bg-neutral-50 text-neutral-700 rounded-tl-none border border-neutral-200"
              : "bg-[#E6F4F7] text-neutral-700 rounded-tr-none border border-[#E6F4F7]"
          }`}
        >
          {renderTextWithHighlights(
            segment.text,
            segment.codeSwitchWords,
            segment.keyTerms
          )}
        </div>

        {segment.keyTerms && segment.keyTerms.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isInterviewer ? "" : "justify-end"}`}>
            {segment.keyTerms.map((kt) => (
              <span
                key={kt}
                className="text-[9px] px-1.5 py-0.5 bg-[#E6F4F7] text-[#0E5E6F] rounded border border-[#E6F4F7] font-sans"
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

export default function InterviewRoomClient() {
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

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [segments, partialText]);

  if (!interview) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-neutral-400">
        Interview not found.
      </div>
    );
  }

  const qualityColor = {
    excellent: "text-[#1A7F4B]",
    good: "text-[#B45309]",
    poor: "text-[#C0392B]",
  }[connectionQuality];

  const qualityIcon =
    connectionQuality === "poor" ? (
      <WifiOff className={`w-3.5 h-3.5 ${qualityColor}`} />
    ) : (
      <Wifi className={`w-3.5 h-3.5 ${qualityColor}`} />
    );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 bg-white border-b border-neutral-200 shrink-0" style={{ height: "48px" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#0E5E6F] rounded-md flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">S</span>
          </div>
          <Link href="/dashboard/interviews" className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Interview: {interview.candidateName} · {interview.jobTitle}
            </p>
          </div>
          {interview.status === "live" && (
            <Badge variant="danger" dot>Live</Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-mono text-neutral-700">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            {formatTimestamp(elapsed)}
          </div>

          <div className="flex items-center gap-1.5">
            {qualityIcon}
            <span className={`text-xs ${qualityColor} capitalize`}>
              {connectionQuality}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Activity className="w-3 h-3" />
            <span className={asrLatencyMs > 400 ? "text-[#B45309]" : "text-neutral-400"}>
              {asrLatencyMs}ms
            </span>
          </div>

          <VADIndicator active={isVadActive && isRecording} />

          <button
            onClick={() => router.push(`/dashboard/jobs/${interview.jobId}/ranking`)}
            className="flex items-center gap-2 px-3 h-8 bg-[#C0392B] hover:bg-[#a93226] text-white text-xs font-medium rounded-lg transition-colors"
          >
            End interview →
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-col bg-neutral-900 p-4 gap-3" style={{ width: "56%" }}>
          <div className="flex-1 rounded-2xl border border-neutral-700 relative overflow-hidden flex items-center justify-center bg-neutral-800">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-[#E6F4F7] border-2 border-[#0E5E6F] flex items-center justify-center text-2xl font-bold text-[#0E5E6F]">
                  {interview.interviewerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <p className="text-sm text-neutral-300">{interview.interviewerName}</p>
                <p className="text-xs text-neutral-500">{interview.interviewerRole}</p>
              </div>
            </div>

            {isRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#FDECEA] border border-[#C0392B]/40 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B] animate-pulse" />
                <span className="text-xs font-medium text-[#C0392B]">REC</span>
              </div>
            )}

            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-neutral-900/80 border border-neutral-700 rounded-full px-2.5 py-1">
              <Users className="w-3 h-3 text-neutral-400" />
              <span className="text-xs text-neutral-300">2</span>
            </div>
          </div>

          <div className="flex gap-2 h-24">
            <div className="w-40 bg-neutral-800 rounded-xl border border-neutral-700 relative overflow-hidden flex items-center justify-center shrink-0">
              {cameraOn ? (
                <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#B45309] flex items-center justify-center text-sm font-bold text-white">
                    {interview.candidateName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <VideoOff className="w-5 h-5 text-neutral-500" />
                  <p className="text-[10px] text-neutral-500">Camera off</p>
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1">
                <span className="text-[9px] text-neutral-300 bg-neutral-900/70 px-1 rounded">
                  {interview.candidateName.split(" ")[0]}
                </span>
                {!micOn && <MicOff className="w-2.5 h-2.5 text-[#C0392B]" />}
              </div>
            </div>

            <div className="flex-1 bg-neutral-900 rounded-xl border border-dashed border-neutral-700 flex items-center justify-center">
              <p className="text-[10px] text-neutral-600">
                LiveKit participant tiles
              </p>
            </div>
          </div>
        </div>

        <div className="border-l border-neutral-200 flex flex-col bg-white" style={{ width: "44%" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
            <div>
              <p className="text-xs font-semibold text-neutral-900">Live Transcript</p>
              <p className="text-[10px] text-neutral-400">{interview.asrProvider} · {interview.language === "mixed" ? "ID/EN" : interview.language.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearTranscript}
                className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                title="Clear transcript"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 border-b border-neutral-100 bg-neutral-50">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#0E5E6F]" />
              <span className="text-[10px] text-neutral-400">S1 {interview.interviewerName.split(" ")[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#4338CA]" />
              <span className="text-[10px] text-neutral-400">S2 {interview.candidateName.split(" ")[0]}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 bg-[#FEF3E2] text-[#B45309] rounded">EN in ID</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#E6F4F7] text-[#0E5E6F] rounded">keyterm</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {segments.length === 0 && !isRecording && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Mic className="w-8 h-8 text-neutral-200 mb-3" />
                <p className="text-xs text-neutral-400">
                  Press Record to start live transcription
                </p>
              </div>
            )}

            {segments.map((seg) => (
              <TranscriptLine key={seg.id} segment={seg} />
            ))}

            {partialText && isRecording && (
              <div className="flex gap-3 mb-3 opacity-60">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] shrink-0" />
                <div className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-400 italic font-serif">
                  {partialText}
                  <span className="inline-block w-1 h-3 bg-neutral-400 animate-pulse ml-0.5 align-middle" />
                </div>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50">
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>{segments.length} segments</span>
              <span className={asrLatencyMs > 400 ? "text-[#B45309]" : ""}>
                ASR: {asrLatencyMs}ms
              </span>
              <span>Lang: ID+EN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 bg-white border-t border-neutral-200 shrink-0" style={{ height: "56px" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMicOn((v) => !v)}
            className={[
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              micOn
                ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                : "bg-[#FDECEA] text-[#C0392B] hover:bg-[#fbd5d2] border border-[#C0392B]/30",
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
                ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                : "bg-[#FDECEA] text-[#C0392B] hover:bg-[#fbd5d2] border border-[#C0392B]/30",
            ].join(" ")}
            title={cameraOn ? "Stop video" : "Start video"}
          >
            {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          <button className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 flex items-center justify-center transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>

          <button className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={toggleRecording}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all",
              isRecording
                ? "bg-[#C0392B] hover:bg-[#a93226] text-white"
                : "bg-[#0E5E6F] hover:bg-[#09414D] text-white",
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B] animate-pulse" />
              <span className="text-[10px] text-[#C0392B]">Recording & Transcribing</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {interview.status === "completed" || segments.length > 0 ? (
            <Link href={`/dashboard/interviews/${interview.id}/review`}>
              <Button variant="secondary" size="sm">
                AI Review
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
