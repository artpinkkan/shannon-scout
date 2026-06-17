import InterviewRoomClient from "./InterviewRoomClient";

export function generateStaticParams() {
  return ["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9"].map((id) => ({ id }));
}

export default function InterviewRoomPage() {
  return <InterviewRoomClient />;
}
