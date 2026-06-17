import CandidateDetailClient from "./CandidateDetailClient";

export function generateStaticParams() {
  return ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"].map((id) => ({ id }));
}

export default function CandidateDetailPage() {
  return <CandidateDetailClient />;
}
