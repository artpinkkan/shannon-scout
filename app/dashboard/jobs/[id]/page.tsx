import JobDetailClient from "./JobDetailClient";

export function generateStaticParams() {
  return ["j1", "j2", "j3", "j4", "j5", "j6", "j7", "j8"].map((id) => ({ id }));
}

export default function JobDetailPage() {
  return <JobDetailClient />;
}
