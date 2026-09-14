// pages/product/[id].tsx

import { notFound } from "next/navigation";
import ProductComponent from "@/components/Product";
import { fetchProductById, fetchProductsRelated } from "@/data/data-rest";

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

  // Cargar producto
  const product = await fetchProductById(id);

  // Si no existe el producto, mostrar 404
  if (!product.success || !product.data) {
    return notFound();
  }

  // Cargar productos relacionados después de confirmar que el producto existe
  const relatedProducts = await fetchProductsRelated(id, product.data.idCategory);

  // Procesar variable de entorno en el servidor
  const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

  return (
    <ProductComponent
      product={product.data}
      relatedProducts={relatedProducts.success ? relatedProducts.data! : []}
      authEnabled={authEnabled}
    />
  );
}