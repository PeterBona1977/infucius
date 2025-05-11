"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageWrapper } from "@/components/language-wrapper"

function FooterContent() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/20 py-6 md:py-8 bg-[#191919] text-white">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="flex items-center justify-center">
            <img src="/images/infucius-logo.png" alt="INFUCIUS" className="object-contain" width={75} height={75} />
          </Link>
          <p className="text-center text-sm text-white/70 md:text-left">
            {t("footer.tagline") || "Discover personalized tea-inspired messages with every scan."}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:items-end">
          <nav className="flex gap-4">
            <Link href="/terms" className="text-sm text-white/70 hover:text-white">
              {t("footer.terms") || "Terms"}
            </Link>
            <Link href="/privacy" className="text-sm text-white/70 hover:text-white">
              {t("footer.privacy") || "Privacy"}
            </Link>
            <Link href="/contact" className="text-sm text-white/70 hover:text-white">
              {t("footer.contact") || "Contact"}
            </Link>
          </nav>
          <p className="text-center text-sm text-white/70 md:text-right">
            &copy; {currentYear} Infucius. {t("footer.allRightsReserved") || "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}

export function Footer() {
  return (
    <LanguageWrapper>
      <FooterContent />
    </LanguageWrapper>
  )
}
