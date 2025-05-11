const { createServer } = require("http") // Use HTTP instead of HTTPS for testing
const { parse } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

// Make sure NEXTAUTH_URL is set correctly for development
if (process.env.NODE_ENV === "development") {
  process.env.NEXTAUTH_URL = "http://localhost:3000" // Use HTTP for testing
  console.log(`Setting NEXTAUTH_URL to ${process.env.NEXTAUTH_URL}`)
}

// Ensure we have a NEXTAUTH_SECRET
if (!process.env.NEXTAUTH_SECRET) {
  // Generate a simple secret for development
  const crypto = require("crypto")
  process.env.NEXTAUTH_SECRET = crypto.randomBytes(32).toString("hex")
  console.log("Generated temporary NEXTAUTH_SECRET for development")
}

app.prepare().then(() => {
  createServer((req, res) => {
    // Parse the URL
    const parsedUrl = parse(req.url, true)

    // Special handling for auth API routes
    if (parsedUrl.pathname.startsWith("/api/auth")) {
      console.log(`Auth API request: ${parsedUrl.pathname}`)

      // Add CORS headers for API routes
      res.setHeader("Access-Control-Allow-Credentials", "true")
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT")
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      )

      // Handle preflight requests
      if (req.method === "OPTIONS") {
        res.writeHead(200)
        res.end()
        return
      }
    }

    // Handle the request
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on http://localhost:3000")
  })
})
