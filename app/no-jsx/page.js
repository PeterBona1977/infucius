import React from "react"

export default function NoJsxPage() {
  // Use React.createElement instead of JSX
  return React.createElement(
    "div",
    { style: { padding: "20px", fontFamily: "system-ui, sans-serif" } },
    React.createElement("h1", { style: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" } }, "No JSX Page"),
    React.createElement(
      "p",
      { style: { marginBottom: "20px" } },
      "This page uses React.createElement instead of JSX to avoid any transpilation issues.",
    ),
    React.createElement(
      "div",
      {
        style: {
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        },
      },
      React.createElement(
        "h2",
        { style: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px" } },
        "Navigation",
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: "10px", flexWrap: "wrap" } },
        React.createElement(
          "a",
          {
            href: "/",
            style: {
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
            },
          },
          "Back to Home",
        ),
        React.createElement(
          "a",
          {
            href: "/shop",
            style: {
              padding: "8px 16px",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              textDecoration: "none",
            },
          },
          "Shop",
        ),
        React.createElement(
          "a",
          {
            href: "/scan",
            style: {
              padding: "8px 16px",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              textDecoration: "none",
            },
          },
          "Scan QR",
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
        },
      },
      React.createElement(
        "h2",
        { style: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px" } },
        "Quick Stats",
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          },
        },
        React.createElement(
          "div",
          {
            style: {
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            },
          },
          React.createElement("h3", { style: { fontWeight: "500", marginBottom: "8px" } }, "Total Users"),
          React.createElement("p", { style: { fontSize: "24px", fontWeight: "bold" } }, "127"),
        ),
        React.createElement(
          "div",
          {
            style: {
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            },
          },
          React.createElement("h3", { style: { fontWeight: "500", marginBottom: "8px" } }, "QR Scans"),
          React.createElement("p", { style: { fontSize: "24px", fontWeight: "bold" } }, "543"),
        ),
        React.createElement(
          "div",
          {
            style: {
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            },
          },
          React.createElement("h3", { style: { fontWeight: "500", marginBottom: "8px" } }, "Revenue"),
          React.createElement("p", { style: { fontSize: "24px", fontWeight: "bold" } }, "$2,845"),
        ),
      ),
    ),
  )
}
