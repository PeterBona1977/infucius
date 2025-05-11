import { getTeaTheme } from "./tea-themes"
import { getAstrologySign } from "./astrology"
import type { User } from "@supabase/supabase-js"

interface FortuneContext {
  // User information
  userId?: string
  userName?: string
  birthDate?: string
  astrologySign?: string
  age?: number

  // Location and environment
  location?: string
  country?: string
  weather?: string
  temperature?: number
  season?: string
  timeOfDay?: string

  // Tea information
  themeId: string
  themeName: string
  teaType?: string
  teaOrigin?: string
  teaProperties?: string[]

  // User behavior
  scanCount?: number
  previousFortunes?: string[]
  teaPreferences?: string[]

  // Device information
  deviceType?: string
  browser?: string

  // Time information
  currentTime: Date
  dayOfWeek: string
  moonPhase?: string
}

export async function generateAIFortune(context: FortuneContext): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using fallback fortune generation")
      return generateFallbackFortune(context)
    }

    // Build a comprehensive system prompt
    const systemPrompt = `You are a mystical tea fortune teller with deep wisdom about tea traditions from around the world.
Your task is to create personalized, insightful fortune messages based on tea leaf readings.
Your fortunes should feel unique, profound, and personally tailored to the individual.

Guidelines for your fortunes:
- Write in a warm, mystical, yet grounded tone
- Include 4-6 sentences (about 100-150 words)
- Begin with an observation about their tea or current situation
- Include at least one metaphor related to tea or nature
- Connect the fortune to their personal circumstances
- Provide wisdom that feels specific to them, not generic
- End with a subtle suggestion or insight they can reflect on
- NEVER mention "tea leaves say" or similar fortune-telling clichés
- NEVER use phrases like "your fortune reveals" or "I see in your future"
- NEVER include generic horoscope language

Your fortune should feel like a personal message from a wise tea master who knows them well.`

    // Build a detailed user prompt with all available context
    let userPrompt = `Create a personalized tea fortune for a person with the following characteristics:\n\n`

    // Add personal information
    if (context.userName) userPrompt += `Name: ${context.userName}\n`
    if (context.age) userPrompt += `Age: ${context.age}\n`
    if (context.astrologySign) userPrompt += `Astrological Sign: ${context.astrologySign}\n`

    // Add location and environmental context
    if (context.location) userPrompt += `Current Location: ${context.location}\n`
    if (context.country) userPrompt += `Country: ${context.country}\n`
    if (context.weather) userPrompt += `Current Weather: ${context.weather}\n`
    if (context.temperature) userPrompt += `Temperature: ${context.temperature}°C\n`
    if (context.season) userPrompt += `Current Season: ${context.season}\n`
    userPrompt += `Time of Day: ${context.timeOfDay}\n`
    userPrompt += `Day of Week: ${context.dayOfWeek}\n`
    if (context.moonPhase) userPrompt += `Moon Phase: ${context.moonPhase}\n`

    // Add tea context
    userPrompt += `\nTea Theme: ${context.themeName}\n`
    if (context.teaType) userPrompt += `Tea Type: ${context.teaType}\n`
    if (context.teaOrigin) userPrompt += `Tea Origin: ${context.teaOrigin}\n`
    if (context.teaProperties && context.teaProperties.length > 0) {
      userPrompt += `Tea Properties: ${context.teaProperties.join(", ")}\n`
    }

    // Add user behavior
    if (context.scanCount !== undefined) userPrompt += `\nNumber of Previous Tea Fortunes: ${context.scanCount}\n`
    if (context.teaPreferences && context.teaPreferences.length > 0) {
      userPrompt += `Tea Preferences: ${context.teaPreferences.join(", ")}\n`
    }

    // Add previous fortunes for continuity
    if (context.previousFortunes && context.previousFortunes.length > 0) {
      userPrompt += `\nMost Recent Fortune: "${context.previousFortunes[0]}"\n`
      if (context.previousFortunes.length > 1) {
        userPrompt += `Another Previous Fortune: "${context.previousFortunes[1]}"\n`
      }
    }

    // Add device context
    if (context.deviceType) userPrompt += `\nDevice Type: ${context.deviceType}\n`
    if (context.browser) userPrompt += `Browser: ${context.browser}\n`

    // Add theme-specific guidance
    userPrompt += `\n${getThemeGuidance(context.themeId)}\n`

    // Add final instructions
    userPrompt += `\nCreate a personalized tea fortune that feels unique to this person and their current situation. 
The fortune should be insightful, thoughtful, and specific to them.
Do not explicitly mention any of the data points above, but weave them naturally into the fortune.
The fortune should be 4-6 sentences long (about 100-150 words).`

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API error:", errorData)
      return generateFallbackFortune(context)
    }

    const data = await response.json()
    const fortune = data.choices[0].message.content.trim()

    return fortune
  } catch (error) {
    console.error("Error generating AI fortune:", error)
    return generateFallbackFortune(context)
  }
}

// Fallback function for when the API is unavailable
function generateFallbackFortune(context: FortuneContext): string {
  const { themeId, themeName, userName } = context

  // Theme-specific fallback messages
  const themeMessages: Record<string, string[]> = {
    green: [
      "The gentle unfurling of green tea leaves mirrors your own gradual awakening to new possibilities. As this tea releases its essence, so too are your ideas beginning to take form. The clarity you seek is already emerging, like the delicate notes in a perfectly brewed cup. Trust the natural timing of your journey—some insights, like fine tea, cannot be rushed.",
      "Like the misty mountains where this green tea was harvested, your path forward contains both clarity and mystery. The balance you've been cultivating is beginning to show results, though perhaps in subtler ways than expected. Notice how your energy shifts with the changing seasons, and allow yourself to adapt accordingly. Your strength lies in this flexibility, like bamboo bending in the wind.",
      "This green tea carries the vitality of spring, regardless of the season outside. Its refreshing character reminds you that renewal is always possible, even in the midst of challenges. The project that's been occupying your thoughts will benefit from the same patient attention you give to brewing this cup. Small, consistent efforts create the most lasting transformations.",
    ],
    black: [
      "The bold character of black tea reflects your own inner strength—a quality others recognize in you even when you doubt yourself. Like tea leaves that have been fully oxidized, your recent experiences have transformed you in ways that bring out your deepest qualities. The path ahead may require the same boldness that defines this brew. Trust that you've developed the resilience needed for the journey.",
      "This black tea has journeyed far from its origins to reach your cup, crossing oceans and continents much like the ideas now converging in your life. The robust flavor speaks to the rich potential of your current situation. Though the full picture may not yet be visible, the elements are aligning in ways that will soon become clear. Your patience through this process will be rewarded.",
      "The amber depths of your black tea hold both tradition and possibility, much like the crossroads you now face. The strength that has carried you through recent challenges continues to develop, like the complex notes in a perfectly aged tea. Consider how you might honor your foundations while still embracing new directions. Your unique perspective is what will ultimately guide your choice.",
    ],
    oolong: [
      "Like oolong tea that balances between green and black, you stand at a point of perfect equilibrium between what was and what could be. The partial oxidation that gives this tea its character mirrors your own journey of transformation—neither rushed nor stagnant, but unfolding at exactly the right pace. Notice how different aspects of your life are finding their natural harmony, like the multiple infusions this tea offers.",
      "The dancing leaves of oolong tea reveal their secrets gradually, just as your current situation will unveil its purpose in layers. The complexity you taste reflects the multifaceted nature of the path before you. No single perspective will capture the whole truth. Allow yourself to experience each dimension fully before making your decision, knowing that, like this tea, your story contains many nuances.",
      "This oolong tea embodies the principle of beautiful contradiction—simultaneously delicate and strong, traditional and innovative. Your ability to hold opposing ideas with equal respect is becoming one of your greatest strengths. The challenge that recently appeared contains both obstacle and opportunity, like the twisted leaves that create this remarkable brew. Trust your capacity to navigate this complexity.",
    ],
    herbal: [
      "The blend of herbs in your cup speaks to the diverse elements now converging in your life. Each component brings its unique quality to the whole, creating something greater than the sum of its parts. Similarly, the seemingly unrelated experiences you've gathered are forming a pattern more meaningful than you yet realize. Allow these connections to steep in your awareness, like the herbs releasing their essence into water.",
      "Unlike teas from the camellia sinensis plant, this herbal blend follows different rules and traditions—a reminder that your path need not conform to conventional expectations. The vibrant flavor affirms your recent choice to follow your intuition rather than external guidance. The healing you seek is already unfolding, subtle but persistent, like the gentle influence of these herbs on your senses.",
      "This herbal infusion carries the wisdom of ancient plant knowledge, gathered across generations and geographies. Its soothing presence reminds you that support often comes from unexpected sources. The challenge you've been facing has prepared you for an opportunity now approaching. Trust the natural intelligence within you, as these herbs trust their innate properties to emerge when met with warmth.",
    ],
    default: [
      "The tea before you contains a universe of possibility, each sip a doorway to deeper understanding. As the warmth spreads through your body, notice how it illuminates areas of your life that have remained in shadow. The questions you've been holding might not need answers so much as patient attention. Like tea leaves opening in hot water, your situation is revealing its nature in its own time.",
      "Your tea has journeyed from distant fields to this moment of connection between you and the earth's offerings. This same thread of interconnection runs through the decision you're currently facing. The choice that aligns with your deepest values will become clear when you approach it with the same mindfulness you bring to this cup. Trust the wisdom that arises in moments of quiet reflection.",
      "The character of this tea—its aroma, color, and taste—tells the story of its origins and processing. Similarly, your current circumstances carry the imprint of both your choices and factors beyond your control. The balance you seek exists not in perfection but in harmonizing these elements. As you sip, consider which aspects of your situation you can influence and which require acceptance.",
    ],
  }

  // Select appropriate message set or use default
  const messages = themeMessages[themeId] || themeMessages.default

  // Select random message
  const randomIndex = Math.floor(Math.random() * messages.length)
  let message = messages[randomIndex]

  // Add name personalization if available
  if (userName) {
    message = `${userName}, ${message.charAt(0).toLowerCase()}${message.slice(1)}`
  }

  return message
}

// Helper function to get theme-specific guidance
function getThemeGuidance(themeId: string): string {
  const themeGuidance: Record<string, string> = {
    green:
      "This is a green tea theme focused on renewal, freshness, and new beginnings. Green tea is associated with clarity, health, and gentle energy. The fortune should incorporate elements of growth, vitality, and natural wisdom.",
    black:
      "This is a black tea theme focused on strength, boldness, and tradition. Black tea is associated with grounding, confidence, and robust energy. The fortune should incorporate elements of resilience, transformation, and inner strength.",
    oolong:
      "This is an oolong tea theme focused on balance, complexity, and transformation. Oolong tea is associated with harmony, nuance, and mindfulness. The fortune should incorporate elements of balance, perspective, and the beauty of change.",
    herbal:
      "This is an herbal tea theme focused on healing, intuition, and natural wisdom. Herbal teas are associated with specific properties and ancient knowledge. The fortune should incorporate elements of self-care, intuitive understanding, and connection to nature.",
    white:
      "This is a white tea theme focused on subtlety, potential, and purity. White tea is associated with delicacy, mindfulness, and new possibilities. The fortune should incorporate elements of potential, gentle awareness, and the power of simplicity.",
    chai: "This is a chai tea theme focused on warmth, spice, and vitality. Chai is associated with comfort, stimulation, and complex flavors. The fortune should incorporate elements of warmth, sensory awareness, and the blending of different life elements.",
    default:
      "This tea theme should focus on general wisdom, mindfulness, and the connection between tea and life's journey. The fortune should incorporate elements of reflection, presence, and the insights that come from slowing down to enjoy a cup of tea.",
  }

  return themeGuidance[themeId] || themeGuidance.default
}

// Function to gather all available context for fortune generation
export async function buildFortuneContext(themeId: string, user?: User, req?: Request): Promise<FortuneContext> {
  // Get basic theme information
  const theme = getTeaTheme(themeId)
  const themeName = theme?.name || "Mystery Tea"

  // Get current time information
  const now = new Date()
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()]

  // Determine time of day
  const hour = now.getHours()
  let timeOfDay = "morning"
  if (hour >= 12 && hour < 17) timeOfDay = "afternoon"
  else if (hour >= 17 && hour < 22) timeOfDay = "evening"
  else if (hour >= 22 || hour < 5) timeOfDay = "night"

  // Create base context
  const context: FortuneContext = {
    themeId,
    themeName,
    currentTime: now,
    dayOfWeek,
    timeOfDay,
  }

  // Add user information if available
  if (user) {
    context.userId = user.id
    context.userName = user.user_metadata?.full_name

    // Extract birth date and calculate age and sign if available
    if (user.user_metadata?.birth_date) {
      context.birthDate = user.user_metadata.birth_date

      // Calculate age
      const birthDate = new Date(user.user_metadata.birth_date)
      const ageDiff = now.getTime() - birthDate.getTime()
      const ageDate = new Date(ageDiff)
      context.age = Math.abs(ageDate.getUTCFullYear() - 1970)

      // Get astrological sign
      const month = birthDate.getMonth() + 1
      const day = birthDate.getDate()
      context.astrologySign = getAstrologySign(month, day)
    }

    // Add other user metadata
    context.country = user.user_metadata?.country
    context.teaPreferences = user.user_metadata?.tea_preferences

    // Get scan count (in a real implementation, this would come from the database)
    // For now, we'll use a placeholder
    context.scanCount = 3

    // Get previous fortunes (in a real implementation, this would come from the database)
    // For now, we'll use placeholders
    context.previousFortunes = [
      "The path ahead has many branches, but your intuition knows which one leads to growth.",
      "Like tea leaves that unfurl slowly, your potential reveals itself in its own time.",
    ]
  }

  // Add location and weather information
  // In a real implementation, these would come from actual services
  context.location = "New York City"
  context.weather = "Partly Cloudy"
  context.temperature = 22

  // Determine season based on month in Northern Hemisphere
  const month = now.getMonth()
  if (month >= 2 && month <= 4) context.season = "Spring"
  else if (month >= 5 && month <= 7) context.season = "Summer"
  else if (month >= 8 && month <= 10) context.season = "Autumn"
  else context.season = "Winter"

  // Add moon phase (placeholder - would come from an actual service)
  context.moonPhase = "Waxing Crescent"

  // Add device information if request is available
  if (req) {
    const userAgent = req.headers.get("user-agent") || ""
    if (userAgent.includes("Mobile")) context.deviceType = "Mobile"
    else context.deviceType = "Desktop"

    if (userAgent.includes("Chrome")) context.browser = "Chrome"
    else if (userAgent.includes("Firefox")) context.browser = "Firefox"
    else if (userAgent.includes("Safari")) context.browser = "Safari"
    else context.browser = "Other"
  }

  // Add tea-specific information based on theme
  if (theme) {
    context.teaType = theme.type || "Specialty Tea"
    context.teaOrigin = theme.origin || "Unknown"
    context.teaProperties = theme.properties || ["Aromatic", "Soothing"]
  }

  return context
}
