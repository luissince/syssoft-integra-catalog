"use client";

import ErrorPage from "@/components/ErrorPage";

export default function GlobalError() {

  return (
    <html>
      <body>
        <ErrorPage
          code="500"
          title="Sistema temporalmente no disponible"
          message="No pudimos cargar la aplicación"
          icon="🚧"
        />
      </body>
    </html>
  );
}