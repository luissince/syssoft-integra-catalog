"use client";

import ErrorPage from "@/components/ErrorPage";

export default function Error({
  reset
}: {
  error: Error & { digest?: string },
  reset: () => void
}) {

  return (
    <ErrorPage
      code="500"
      title="Error del servidor"
      message="Ocurrió un problema inesperado"
      icon="⚠️"
    />
  );
}