import { getBranches, getCategories, getCompanyBanners, getCompanyInfo, getProductsAll, getWhatsappInfo } from "@/lib/api";
import HomeComponent from "@/components/Home";
import { Suspense } from "react";
import Welcome from "@/components/Welcome";

export default async function Home() {
  const company = await getCompanyInfo();
  const categories = await getCategories();
  const banners = await getCompanyBanners();
  const whatsapp = await getWhatsappInfo();
  const branches = await getBranches();
  const products = await getProductsAll();

  const branch = branches.find((branch) => branch.primary === true)!;

  const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

  return (
    <Suspense fallback={<Welcome company={company} branch={branch} />}>
      <HomeComponent
        company={company}
        banners={banners}
        categories={[
          { id: "", name: "Todos", description: "Todos los productos", image: "" },
          ...categories
        ]}
        whatsapp={whatsapp}
        branch={branch}
        initialProducts={products}
        authEnabled={authEnabled}
      />
    </Suspense>
  );
}
