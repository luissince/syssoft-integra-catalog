// app/page.tsx
import { notFound } from "next/navigation";
import {
  getBranches,
  getCategories,
  getCompanyBanners,
  getCompanyInfo,
} from "@/lib/api";
import HomeComponent from "@/components/Home";
import { fetchProducts } from "@/data/data-rest";

export default async function Home() {
  const [
    company,
    categories,
    banners,
    branches,
    products
  ] = await Promise.all([
    getCompanyInfo(),
    getCategories(),
    getCompanyBanners(),
    getBranches(),
    fetchProducts({
      currentPage: 0,
      totalPage: 6,
    }),
  ]);

  const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

  if (!branches || branches.length === 0) {
    notFound();
  }

  return (
    <HomeComponent
      company={company}
      banners={banners}
      categories={categories}
      initialProducts={products}
      authEnabled={authEnabled}
    />
  );
}