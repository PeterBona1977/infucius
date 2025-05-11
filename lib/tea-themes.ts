export interface TeaTheme {
  id: string
  name: string
  description: string
  image: string
  bgColor: string
  borderColor: string
  active: boolean
}

const teaThemes: TeaTheme[] = [
  {
    id: "inspiration",
    name: "Inspiration",
    description: "A blend designed to ignite your creative spark and fuel your imagination.",
    image: "/placeholder.svg?height=200&width=200",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500",
    active: true,
  },
  {
    id: "serenity",
    name: "Serenity",
    description: "Find your center with this calming blend that promotes peace and tranquility.",
    image: "/placeholder.svg?height=200&width=200",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    active: true,
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Embark on new journeys with this bold blend that awakens your spirit of exploration.",
    image: "/placeholder.svg?height=200&width=200",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    active: true,
  },
  {
    id: "joy",
    name: "Joy",
    description: "Celebrate life's moments with this uplifting blend that brings happiness with every sip.",
    image: "/placeholder.svg?height=200&width=200",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
    active: true,
  },
  {
    id: "well-being",
    name: "Well-being",
    description: "Nurture your body and mind with this wholesome blend crafted for overall wellness.",
    image: "/placeholder.svg?height=200&width=200",
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    active: true,
  },
  {
    id: "mysticism",
    name: "Mysticism",
    description: "Explore the unknown with this enigmatic blend that connects you to ancient wisdom.",
    image: "/placeholder.svg?height=200&width=200",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
    active: true,
  },
  {
    id: "introspection",
    name: "Introspection",
    description: "Journey within yourself with this contemplative blend that promotes self-discovery.",
    image: "/placeholder.svg?height=200&width=200",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-500",
    active: true,
  },
]

export function getTeaThemes(activeOnly = true): TeaTheme[] {
  return activeOnly ? teaThemes.filter((theme) => theme.active) : teaThemes
}

export function getTeaTheme(id: string): TeaTheme | undefined {
  return teaThemes.find((theme) => theme.id === id)
}
