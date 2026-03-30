"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", background: "#0b1120", color: "#2dd4bf", fontFamily: "system-ui" }}>
        <div style={{ maxWidth: 480, margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Application error</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            A client error occurred. Use the button to retry, then check the browser console and Vercel env vars.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#2dd4bf",
              color: "#0b1120",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {process.env.NODE_ENV === "development" && (
            <pre style={{ marginTop: "1rem", textAlign: "left", fontSize: "0.75rem", color: "#818cf8" }}>
              {error.message}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
