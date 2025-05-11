"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

// This is a simplified list of countries with their codes
// In a real app, you would use a more complete list
const countries = [
  { value: "us", label: "United States", code: "+1", flag: "🇺🇸" },
  { value: "ca", label: "Canada", code: "+1", flag: "🇨🇦" },
  { value: "gb", label: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { value: "au", label: "Australia", code: "+61", flag: "🇦🇺" },
  { value: "de", label: "Germany", code: "+49", flag: "🇩🇪" },
  { value: "fr", label: "France", code: "+33", flag: "🇫🇷" },
  { value: "jp", label: "Japan", code: "+81", flag: "🇯🇵" },
  { value: "cn", label: "China", code: "+86", flag: "🇨🇳" },
  { value: "in", label: "India", code: "+91", flag: "🇮🇳" },
  { value: "br", label: "Brazil", code: "+55", flag: "🇧🇷" },
  { value: "mx", label: "Mexico", code: "+52", flag: "🇲🇽" },
  { value: "es", label: "Spain", code: "+34", flag: "🇪🇸" },
  { value: "it", label: "Italy", code: "+39", flag: "🇮🇹" },
  { value: "ru", label: "Russia", code: "+7", flag: "🇷🇺" },
  { value: "kr", label: "South Korea", code: "+82", flag: "🇰🇷" },
  { value: "za", label: "South Africa", code: "+27", flag: "🇿🇦" },
  { value: "ng", label: "Nigeria", code: "+234", flag: "🇳🇬" },
  { value: "eg", label: "Egypt", code: "+20", flag: "🇪🇬" },
  { value: "sa", label: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { value: "ae", label: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { value: "sg", label: "Singapore", code: "+65", flag: "🇸🇬" },
  { value: "my", label: "Malaysia", code: "+60", flag: "🇲🇾" },
  { value: "th", label: "Thailand", code: "+66", flag: "🇹🇭" },
  { value: "id", label: "Indonesia", code: "+62", flag: "🇮🇩" },
  { value: "ph", label: "Philippines", code: "+63", flag: "🇵🇭" },
  { value: "pk", label: "Pakistan", code: "+92", flag: "🇵🇰" },
  { value: "bd", label: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { value: "vn", label: "Vietnam", code: "+84", flag: "🇻🇳" },
  { value: "tr", label: "Turkey", code: "+90", flag: "🇹🇷" },
  { value: "pl", label: "Poland", code: "+48", flag: "🇵🇱" },
  { value: "ua", label: "Ukraine", code: "+380", flag: "🇺🇦" },
  { value: "nl", label: "Netherlands", code: "+31", flag: "🇳🇱" },
  { value: "se", label: "Sweden", code: "+46", flag: "🇸🇪" },
  { value: "no", label: "Norway", code: "+47", flag: "🇳🇴" },
  { value: "fi", label: "Finland", code: "+358", flag: "🇫🇮" },
  { value: "dk", label: "Denmark", code: "+45", flag: "🇩🇰" },
  { value: "ch", label: "Switzerland", code: "+41", flag: "🇨🇭" },
  { value: "at", label: "Austria", code: "+43", flag: "🇦🇹" },
  { value: "pt", label: "Portugal", code: "+351", flag: "🇵🇹" },
  { value: "gr", label: "Greece", code: "+30", flag: "🇬🇷" },
  { value: "ie", label: "Ireland", code: "+353", flag: "🇮🇪" },
  { value: "nz", label: "New Zealand", code: "+64", flag: "🇳🇿" },
  { value: "il", label: "Israel", code: "+972", flag: "🇮🇱" },
  { value: "ar", label: "Argentina", code: "+54", flag: "🇦🇷" },
  { value: "cl", label: "Chile", code: "+56", flag: "🇨🇱" },
  { value: "co", label: "Colombia", code: "+57", flag: "🇨🇴" },
  { value: "pe", label: "Peru", code: "+51", flag: "🇵🇪" },
  { value: "ve", label: "Venezuela", code: "+58", flag: "🇻🇪" },
]

export type CountryCode = {
  value: string
  label: string
  code: string
  flag: string
}

interface CountrySelectorProps {
  value: string
  onChange: (value: CountryCode) => void
  className?: string
}

export function CountrySelector({ value, onChange, className }: CountrySelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find((country) => country.value === e.target.value)
    if (selectedCountry) {
      onChange(selectedCountry)
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {countries.map((country) => (
        <option key={country.value} value={country.value}>
          {country.flag} {country.label} ({country.code})
        </option>
      ))}
    </select>
  )
}
