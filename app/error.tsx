"use client";

import ErrorPage from "@/components/ErrorPage";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string },
  reset: () => void
}) {

  return (
    <ErrorPage
      code="500"
      title="Error del servidor"
      message={error.message || "Se ha producido un error inesperado"}
      icon="⚠️"
    />
  );
}