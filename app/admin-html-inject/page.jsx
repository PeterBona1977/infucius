export default function AdminHtmlInjectPage() {
  const htmlContent = `
    <div style="padding: 20px; font-family: system-ui, sans-serif;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">
        Admin Dashboard (HTML Injection)
      </h1>
      
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
          Navigation
        </h2>
        <div style="display: flex; gap: 10px;">
          <a 
            href="/"
            style="padding: 8px 16px; background-color: #3b82f6; color: white; border-radius: 4px; text-decoration: none;"
          >
            Back to Home
          </a>
          <a 
            href="#themes"
            style="padding: 8px 16px; background-color: #e5e7eb; border-radius: 4px; text-decoration: none;"
          >
            Themes
          </a>
          <a 
            href="#content"
            style="padding: 8px 16px; background-color: #e5e7eb; border-radius: 4px; text-decoration: none;"
          >
            Content
          </a>
          <a 
            href="#orders"
            style="padding: 8px 16px; background-color: #e5e7eb; border-radius: 4px; text-decoration: none;"
          >
            Orders
          </a>
        </div>
      </div>
      
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
          Quick Stats
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 4px; padding: 16px;">
            <h3 style="font-weight: 500; margin-bottom: 8px;">Total Users</h3>
            <p style="font-size: 24px; font-weight: bold;">127</p>
          </div>
          <div style="border: 1px solid #e5e7eb; border-radius: 4px; padding: 16px;">
            <h3 style="font-weight: 500; margin-bottom: 8px;">QR Scans</h3>
            <p style="font-size: 24px; font-weight: bold;">543</p>
          </div>
          <div style="border: 1px solid #e5e7eb; border-radius: 4px; padding: 16px;">
            <h3 style="font-weight: 500; margin-bottom: 8px;">Revenue</h3>
            <p style="font-size: 24px; font-weight: bold;">$2,845</p>
          </div>
        </div>
      </div>
    </div>
  `

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
}
