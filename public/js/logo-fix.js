// This script helps ensure the logo loads correctly
document.addEventListener("DOMContentLoaded", () => {
  // Force reload of logo images
  const logoImages = document.querySelectorAll('img[src*="logo.png"]')
  logoImages.forEach((img) => {
    const currentSrc = img.src
    img.src = currentSrc.includes("?") ? currentSrc : `${currentSrc}?v=${new Date().getTime()}`
  })
})
