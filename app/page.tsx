// app/page.tsx
import { notFound } from "next/navigation";
import { 
  getBranches, 
  getCategories, 
  getCompanyBanners, 
  getCompanyInfo, 
  getProducts, 
  getWhatsappInfo 
} from "@/lib/api";
import HomeComponent from "@/components/Home";
import { Suspense } from "react";
import Welcome from "@/components/Welcome";

export default async function Home() {
  const [
    company,
    categories,
    banners,
    whatsapp,
    branches,
    products
  ] = await Promise.all([
    getCompanyInfo(),
    getCategories(),
    getCompanyBanners(),
    getWhatsappInfo(),
    getBranches(),
    getProducts({
      currentPage: 0,
      totalPage: 6,
    }),
  ]);

  const branch = branches.find((branch) => branch.primary === true)!;

  const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;
  
  if (!branches || branches.length === 0) {
    notFound();
  }

  return (
    <Suspense fallback={<Welcome company={company} />}>
      <HomeComponent
        company={company}
        banners={banners}
        categories={categories}
        whatsapp={whatsapp}
        branch={branch}
        initialProducts={products}
        authEnabled={authEnabled}
      />
    </Suspense>
  );
}