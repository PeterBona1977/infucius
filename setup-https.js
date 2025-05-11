const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Create certificates directory if it doesn't exist
const certPath = path.join(process.cwd(), "certificates")
if (!fs.existsSync(certPath)) {
  fs.mkdirSync(certPath, { recursive: true })
}

console.log("Installing mkcert...")
try {
  // Check if mkcert is installed
  execSync("mkcert -version", { stdio: "inherit" })
} catch (error) {
  console.log("mkcert not found, installing...")

  // Detect OS and install mkcert
  const platform = process.platform
  if (platform === "darwin") {
    // macOS
    console.log("Installing mkcert on macOS...")
    execSync("brew install mkcert", { stdio: "inherit" })
    execSync("brew install nss", { stdio: "inherit" }) // For Firefox support
  } else if (platform === "linux") {
    // Linux
    console.log("Installing mkcert on Linux...")
    execSync("sudo apt update && sudo apt install -y libnss3-tools", { stdio: "inherit" })
    execSync(
      "wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64",
      { stdio: "inherit" },
    )
    execSync("chmod +x mkcert", { stdio: "inherit" })
    execSync("sudo mv mkcert /usr/local/bin/", { stdio: "inherit" })
  } else if (platform === "win32") {
    // Windows
    console.log("Installing mkcert on Windows...")
    console.log("Please install mkcert manually from: https://github.com/FiloSottile/mkcert/releases")
    process.exit(1)
  } else {
    console.error("Unsupported platform:", platform)
    process.exit(1)
  }
}

console.log("Setting up mkcert...")
execSync("mkcert -install", { stdio: "inherit" })

console.log("Generating certificates for localhost...")
execSync(
  `mkcert -key-file ${path.join(certPath, "localhost-key.pem")} -cert-file ${path.join(certPath, "localhost.pem")} localhost 127.0.0.1`,
  { stdio: "inherit" },
)

console.log("HTTPS setup complete! You can now run your app with:")
console.log("npm run dev")
