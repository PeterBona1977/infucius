import { redirect } from "next/navigation"

export default function AdminHtmlRedirect() {
  redirect("/admin-static.html")

  // This will never be rendered, but we need to return something
  return null
}
