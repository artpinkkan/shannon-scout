"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TranscriptSegment } from "@/lib/types";
import { LIVE_TRANSCRIPT_LINES } from "@/lib/mock-data";

interface UseMockTranscriptOptions {
  intervalMs?: number;
  interviewId?: string;
}

interface UseMockTranscriptReturn {
  segments: TranscriptSegment[];
  isRecording: boolean;
  partialText: string;
  startRecording: () => void;
  stopRecording: () => void;
  toggleRecording: () => void;
  clearTranscript: () => void;
  asrLatencyMs: number;
  connectionQuality: "excellent" | "good" | "poor";
  isVadActive: boolean;
}

export function useMockTranscript(
  options: UseMockTranscriptOptions = {}
): UseMockTranscriptReturn {
  const { intervalMs = 2500 } = options;

  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [partialText, setPartialText] = useState("");
  const [asrLatencyMs, setAsrLatencyMs] = useState(280);
  const [connectionQuality, setConnectionQuality] = useState<
    "excellent" | "good" | "poor"
  >("excellent");
  const [isVadActive, setIsVadActive] = useState(false);

  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const partialIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearIntervals = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (partialIntervalRef.current) {
      clearInterval(partialIntervalRef.current);
      partialIntervalRef.current = null;
    }
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
  }, []);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setPartialText("");
    setIsVadActive(false);
    clearIntervals();
  }, [clearIntervals]);

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, []);

  const clearTranscript = useCallback(() => {
    setSegments([]);
    indexRef.current = 0;
    setPartialText("");
  }, []);

  // Simulate partial transcript text before a final segment arrives
  useEffect(() => {
    if (!isRecording) {
      if (partialIntervalRef.current) {
        clearInterval(partialIntervalRef.current);
        partialIntervalRef.current = null;
      }
      setPartialText("");
      return;
    }

    const nextLine = LIVE_TRANSCRIPT_LINES[indexRef.current % LIVE_TRANSCRIPT_LINES.length];
    const words = nextLine.text.split(" ");
    let wordIdx = 0;

    partialIntervalRef.current = setInterval(() => {
      if (wordIdx < words.length) {
        setPartialText((prev) =>
          wordIdx === 0 ? words[0] : prev + " " + words[wordIdx]
        );
        wordIdx++;
      } else {
        if (partialIntervalRef.current) {
          clearInterval(partialIntervalRef.current);
          partialIntervalRef.current = null;
        }
        setPartialText("");
      }
    }, intervalMs / (words.length + 2));

    return () => {
      if (partialIntervalRef.current) {
        clearInterval(partialIntervalRef.current);
        partialIntervalRef.current = null;
      }
    };
  }, [isRecording, segments.length, intervalMs]);

  // Main interval: append finalized segment
  useEffect(() => {
    if (!isRecording) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const currentIndex = indexRef.current;
      const nextSegment = LIVE_TRANSCRIPT_LINES[currentIndex % LIVE_TRANSCRIPT_LINES.length];

      const newSegment: TranscriptSegment = {
        ...nextSegment,
        id: `live-${Date.now()}-${currentIndex}`,
        startTime: currentIndex * 15,
        endTime: currentIndex * 15 + 12,
        isFinal: true,
      };

      setSegments((prev) => [...prev, newSegment]);
      setPartialText("");
      indexRef.current = currentIndex + 1;

      // Simulate fluctuating ASR latency
      setAsrLatencyMs(Math.floor(200 + Math.random() * 350));

      // Simulate occasional quality dips
      const r = Math.random();
      if (r < 0.7) setConnectionQuality("excellent");
      else if (r < 0.9) setConnectionQuality("good");
      else setConnectionQuality("poor");
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording, intervalMs]);

  // VAD simulation
  useEffect(() => {
    if (!isRecording) {
      setIsVadActive(false);
      return;
    }

    vadIntervalRef.current = setInterval(() => {
      setIsVadActive((prev) => !prev || Math.random() > 0.3);
    }, 800);

    return () => {
      if (vadIntervalRef.current) {
        clearInterval(vadIntervalRef.current);
        vadIntervalRef.current = null;
      }
    };
  }, [isRecording]);

  return {
    segments,
    isRecording,
    partialText,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
    asrLatencyMs,
    connectionQuality,
    isVadActive,
  };
}
