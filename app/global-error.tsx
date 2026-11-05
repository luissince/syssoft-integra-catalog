
"use client";

export default function GlobalError() {
  return (
    <html lang="es">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "linear-gradient(135deg,#fff7ed,#ffffff,#fef2f2)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "450px",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                marginBottom: "20px",
              }}
            >
              🚧
            </div>

            <h1
              style={{
                fontSize: "72px",
                fontWeight: 800,
                color: "#ef4444",
                margin: 0,
              }}
            >
              500
            </h1>

            <h2
              style={{
                fontSize: "28px",
                marginTop: "16px",
              }}
            >
              Sistema temporalmente no disponible
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
                marginTop: "16px",
              }}
            >
              No pudimos cargar la aplicación.
              Estamos trabajando para solucionarlo.
            </p>

            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "24px",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}