import { TeaThemeShowcase } from "@/components/tea-theme-showcase"
import { HeroSection } from "@/components/hero-section"
import { QrScanButton } from "@/components/qr-scan-button"
import { HomeClientWrapper } from "@/components/home-client-wrapper"
import { EditableContent } from "@/components/editable-content"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <div className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <EditableContent
              page="home"
              section="scan"
              keyName="description"
              defaultValue="Scan the QR code on your tea package to receive a personalized message that resonates with your current state and surroundings."
              as="p"
              className="text-center max-w-2xl mb-4"
            />
            <QrScanButton />
            <EditableContent
              page="home"
              section="scan"
              keyName="note"
              defaultValue="Each message is unique and crafted just for you."
              as="p"
              className="text-sm text-muted-foreground mt-2"
            />
          </div>
        </section>

        <HomeClientWrapper />

        <section className="mb-12">
          <EditableContent
            page="home"
            section="themes"
            keyName="title"
            defaultValue="Our Tea Themes"
            as="h2"
            className="text-3xl font-bold text-center mb-8"
          />
          <TeaThemeShowcase />
        </section>
      </div>
    </div>
  )
}
