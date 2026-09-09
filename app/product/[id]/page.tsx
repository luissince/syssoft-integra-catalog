// pages/product/[id].tsx

import { notFound } from "next/navigation";
import { getBranches, getCompanyInfo, getProductById, getProductsRelated, getWhatsappInfo } from "@/lib/api";
import ProductComponent from "@/components/Product";

interface ProductDetalleProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetalle({ params }: ProductDetalleProps) {
  // Resolver params primero
  const { id } = await params;

  // Si no existe el id, mostrar 404
  if (!id) {
    return notFound();
  }

  // Cargar datos en paralelo para mejor performance
  const [
    branches,
    whatsapp,
    product
  ] = await Promise.all([
    getBranches(),
    getWhatsappInfo(),
    getProductById(id)
  ]);

  // Si no existe el producto, mostrar 404
  if (!product) {
    return notFound();
  }

  // Cargar productos relacionados después de confirmar que el producto existe
  const relatedProducts = await getProductsRelated(id, product.idCategory);

  const branch = branches.find((branch) => branch.primary === true)!;

  // Procesar variable de entorno en el servidor
  const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

  return (
      <ProductComponent
        branch={branch}
        whatsapp={whatsapp}
        product={product}
        relatedProducts={relatedProducts}
        authEnabled={authEnabled}
      />
  );
}