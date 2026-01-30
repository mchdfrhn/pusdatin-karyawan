import { getEmployeeById } from "@/app/actions";
import { EmployeeDetailView } from "@/components/pages/employee-detail-view";
import { notFound } from "next/navigation";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await getEmployeeById(id);

  if (error || !data) {
    if (error) console.error(error);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <EmployeeDetailView employee={data} />
      </div>
    </main>
  );
}
