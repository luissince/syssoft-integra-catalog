import { notFound } from "next/navigation";
import { getBranches, getCompanyInfo, getProductById, getProductsRelated } from "@/lib/api";
import PlateComponent from "@/components/Plate";

interface PlateDetalleProps {
  params: Promise<{ id: string }>;
}

export default async function PlateDetalle({ params }: PlateDetalleProps) {
  // Resolver params primero
  const { id } = await params;
  
  try {
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
    const authEnabled = process.env.APP_BACK_END === "true";

    return (
      <PlateComponent 
        company={company} 
        branch={branch} 
        product={product} 
        relatedProducts={relatedProducts}
        authEnabled={authEnabled} 
      />
    );
  } catch (error) {
    // Si hay cualquier error (producto no encontrado, error de API, etc.)
    console.error("Error loading product:", error);
    notFound();
  }
}