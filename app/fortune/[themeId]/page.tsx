import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getFortuneMessage } from "@/lib/fortune"
import { getTeaTheme } from "@/lib/tea-themes"

export const metadata: Metadata = {
  title: "Your Tea Fortune | Infucius",
  description: "Your personalized tea-inspired message",
}

interface FortunePageProps {
  params: {
    themeId: string
  }
}

export default async function FortunePage({ params }: FortunePageProps) {
  const { themeId } = params
  const theme = getTeaTheme(themeId)

  if (!theme) {
    notFound()
  }

  // In a real app, we would use the user's location, time, etc.
  const userContext = {
    location: "Unknown",
    time: new Date(),
    weather: "Unknown",
    // This would be populated with real data from device/APIs
  }

  const fortune = getFortuneMessage(themeId, userContext)

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card className={`border-4 ${theme.borderColor}`}>
        <CardHeader className={`${theme.bgColor} text-center`}>
          <CardTitle className="text-2xl">{theme.name} Fortune</CardTitle>
          <CardDescription>A message crafted just for you</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          <div className="bg-muted/50 p-6 rounded-lg text-center italic">
            <p className="text-lg">{fortune.message}</p>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Generated for you on {fortune.timestamp.toLocaleString()}</p>
            <p>Based on your current context and the {theme.name.toLowerCase()} theme</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6">
          <Button asChild className="w-full">
            <Link href={`/shop/${themeId}`}>Shop {theme.name} Tea</Link>
          </Button>
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/scan">Scan Another</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
