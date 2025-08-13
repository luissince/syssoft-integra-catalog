// app/not-found.tsx
import { getCompanyInfo, getBranches } from "@/lib/api";
import NotFound from "@/components/NotFound";

export default async function GlobalNotFound() {
  const company = await getCompanyInfo();
  const branches = await getBranches();
  const branch = branches?.find((branch) => branch.primary === true)!;

  return <NotFound company={company} branch={branch} />;
}