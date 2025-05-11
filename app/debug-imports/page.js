"use client"

import { useEffect, useState } from "react"

export default function DebugImportsPage() {
  const [modules, setModules] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      // Try to get all modules from window
      const allModules = []

      // Check for webpack modules
      if (window.__webpack_modules__) {
        Object.keys(window.__webpack_modules__).forEach((key) => {
          allModules.push({ type: "webpack", key })
        })
      }

      // Check for require.cache if available
      if (typeof require !== "undefined" && require.cache) {
        Object.keys(require.cache).forEach((key) => {
          allModules.push({ type: "require.cache", key })
        })
      }

      // Check for System.registry if available
      if (window.System && window.System.registry) {
        Array.from(window.System.registry.keys()).forEach((key) => {
          allModules.push({ type: "System.registry", key })
        })
      }

      // Look for any global variables that might contain lucide
      Object.keys(window).forEach((key) => {
        if (key.toLowerCase().includes("lucide")) {
          allModules.push({ type: "window", key })
        }
      })

      setModules(allModules)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Debug Imports</h1>
      <p style={{ marginBottom: "20px" }}>
        This page attempts to identify where the lucide-react import might be coming from.
      </p>

      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fee2e2",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "#b91c1c", fontWeight: "bold" }}>Error:</p>
          <p style={{ color: "#b91c1c" }}>{error}</p>
        </div>
      )}

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
          Detected Modules ({modules.length})
        </h2>

        {modules.length === 0 ? (
          <p>No modules detected.</p>
        ) : (
          <div
            style={{
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "8px",
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {modules.map((module, index) => (
                <li
                  key={index}
                  style={{
                    padding: "4px 8px",
                    borderBottom: index < modules.length - 1 ? "1px solid #e5e7eb" : "none",
                    backgroundColor: module.key.toLowerCase().includes("lucide") ? "#fef3c7" : "transparent",
                  }}
                >
                  <strong>{module.type}:</strong> {module.key}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <a
          href="/"
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
