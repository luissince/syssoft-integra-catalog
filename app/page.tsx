// app/page.tsx

import {
  getCategories,
  getCompanyBanners
} from "@/lib/api";
import HomeComponent from "@/components/Home";
import { fetchProducts } from "@/data/data-rest";

export default async function Home() {
  const [
    categories,
    banners,
    products
  ] = await Promise.all([
    getCategories(),
    getCompanyBanners(),
    fetchProducts({
      currentPage: 0,
      totalPage: 6,
    }),
  ]);

  const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

  return (
    <HomeComponent
      banners={banners}
      categories={categories}
      initialProducts={products}
      authEnabled={authEnabled}
    />
  );
}