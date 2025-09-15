import { notFound } from "next/navigation";
import { getBranches, getCompanyInfo, getProductById, getProductsRelated } from "@/lib/api";
import ProductComponent from "@/components/Product";
import { Suspense } from "react";
import Welcome from "@/components/Welcome";

interface ProductDetalleProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetalle({ params }: ProductDetalleProps) {
  // Resolver params primero
  const { id } = await params;

  // Si no existe el id, mostrar 404
  if (!id) {
    notFound();
  }

  // Cargar datos en paralelo para mejor performance
  const [company, branches, product] = await Promise.all([
    getCompanyInfo(),
    getBranches(),
    getProductById(id)
  ]);

  // Si no existe el producto, mostrar 404
  if (!product) {
    notFound();
  }

  // Cargar productos relacionados después de confirmar que el producto existe
  const relatedProducts = await getProductsRelated(product.id, product.idCategory);

  const branch = branches.find((branch) => branch.primary === true)!;

  // Procesar variable de entorno en el servidor
  const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

  return (
    <Suspense fallback={<Welcome company={company} branch={branch} />}>
      <ProductComponent
        company={company}
        branch={branch}
        product={product}
        relatedProducts={relatedProducts}
        authEnabled={authEnabled}
      />
    </Suspense>
  );
}