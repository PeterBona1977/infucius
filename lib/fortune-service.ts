import { supabase } from "./supabase/client"
import { getMessageTemplates, createFortune } from "./db"
import { getTeaTheme } from "./tea-themes"
import { getUserLocation } from "./location"
import { getUserWeather } from "./weather"
import { generateAIFortune, buildFortuneContext } from "./ai-fortune-service"
import type { User } from "@supabase/supabase-js"

interface UserContext {
  location: string
  time: Date
  weather: string
  scanCount?: number
  // Additional context like device info, etc.
}

interface FortuneMessage {
  id: string
  themeId: string
  message: string
  timestamp: Date
  context: UserContext
}

export async function getFortuneMessage(
  themeId: string,
  userContext: UserContext,
  user?: User,
  req?: Request,
): Promise<FortuneMessage> {
  try {
    // Get theme
    const theme = getTeaTheme(themeId)

    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`)
    }

    // Build comprehensive context for AI fortune generation
    const fortuneContext = await buildFortuneContext(themeId, user, req)

    // Try to generate an AI fortune
    try {
      const aiMessage = await generateAIFortune(fortuneContext)

      return {
        id: `fortune-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        themeId,
        message: aiMessage,
        timestamp: new Date(),
        context: userContext,
      }
    } catch (aiError) {
      console.warn("AI fortune generation failed, falling back to templates:", aiError)

      // Get message templates for this theme from the database
      const templates = await getMessageTemplates(themeId)

      if (!templates || templates.length === 0) {
        // Fallback to hardcoded messages if no templates in database
        const fallbackMessages = [
          "The path to wisdom begins with a single sip of tea.",
          "In every cup of tea, there is a story waiting to be told.",
          "As the tea leaves unfurl, so too does your journey ahead.",
        ]

        const randomIndex = Math.floor(Math.random() * fallbackMessages.length)
        const message = fallbackMessages[randomIndex]

        return {
          id: `fortune-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          themeId,
          message,
          timestamp: new Date(),
          context: userContext,
        }
      }

      // Select a random message template
      const randomIndex = Math.floor(Math.random() * templates.length)
      const template = templates[randomIndex]

      // Return the fortune message
      return {
        id: `fortune-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        themeId,
        message: template.message,
        timestamp: new Date(),
        context: userContext,
      }
    }
  } catch (error) {
    console.error("Error getting fortune message:", error)
    throw error
  }
}

export async function getPersonalizedFortuneMessage(
  themeId: string,
  user?: User,
  req?: Request,
): Promise<FortuneMessage> {
  try {
    // Get user's location (in a real app)
    const location = await getUserLocation()

    // Get weather for that location (in a real app)
    const weather = await getUserWeather(location)

    // Get user's scan count if they're logged in
    let scanCount
    if (user) {
      const { count, error } = await supabase
        .from("fortunes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (!error) {
        scanCount = count
      }
    }

    // Create context object
    const userContext: UserContext = {
      location: location?.city || "Unknown",
      time: new Date(),
      weather: weather?.condition || "Unknown",
      scanCount,
    }

    // Get a fortune message
    const fortune = await getFortuneMessage(themeId, userContext, user, req)

    // Save to database if user is logged in
    if (user) {
      await createFortune({
        user_id: user.id,
        theme_id: themeId,
        message: fortune.message,
        location: userContext.location,
        weather: userContext.weather,
      })
    }

    return fortune
  } catch (error) {
    console.error("Error getting personalized fortune message:", error)
    throw error
  }
}

// Apply personalization rules to modify the message
export async function applyPersonalizationRules(fortune: FortuneMessage, user?: User): Promise<FortuneMessage> {
  try {
    // Get all active personalization rules from the database
    const { data: rules, error } = await supabase
      .from("personalization_rules")
      .select("*")
      .eq("active", true)
      .order("priority", { ascending: false })

    if (error) {
      console.error("Error fetching personalization rules:", error)
      return fortune
    }

    // No rules or no user, return original message
    if (!rules || rules.length === 0 || !user) {
      return fortune
    }

    let modifiedMessage = fortune.message

    // Apply each matching rule
    for (const rule of rules) {
      // Check if all conditions match
      let conditionsMatch = true

      for (const condition of rule.conditions) {
        // Check each condition against the user context
        if (!evaluateCondition(condition, fortune.context, user)) {
          conditionsMatch = false
          break
        }
      }

      // If all conditions match, apply the actions
      if (conditionsMatch) {
        modifiedMessage = applyActions(rule.actions, modifiedMessage, fortune.context, user)

        // Break after first matching rule unless it's a continuation rule
        if (!rule.conditions.some((c) => c.type === "continue")) {
          break
        }
      }
    }

    // Return the modified fortune
    return {
      ...fortune,
      message: modifiedMessage,
    }
  } catch (error) {
    console.error("Error applying personalization rules:", error)
    return fortune
  }
}

// Helper function to evaluate a condition
function evaluateCondition(condition: any, context: UserContext, user: User): boolean {
  switch (condition.type) {
    case "time":
      return evaluateTimeCondition(condition, context.time)
    case "weather":
      return evaluateWeatherCondition(condition, context.weather)
    case "location":
      return evaluateLocationCondition(condition, context.location)
    case "scanCount":
      return evaluateScanCountCondition(condition, context.scanCount || 0)
    default:
      return true
  }
}

// Helper function to evaluate a time condition
function evaluateTimeCondition(condition: any, time: Date): boolean {
  const hour = time.getHours()
  const minutes = time.getMinutes()
  const timeString = `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

  switch (condition.operator) {
    case "equals":
      return timeString === condition.value
    case "between":
      const [start, end] = condition.value
      return timeString >= start && timeString <= end
    default:
      return false
  }
}

// Helper function to evaluate a weather condition
function evaluateWeatherCondition(condition: any, weather: string): boolean {
  switch (condition.operator) {
    case "equals":
      return weather.toLowerCase() === condition.value.toLowerCase()
    case "contains":
      return weather.toLowerCase().includes(condition.value.toLowerCase())
    default:
      return false
  }
}

// Helper function to evaluate a location condition
function evaluateLocationCondition(condition: any, location: string): boolean {
  switch (condition.operator) {
    case "equals":
      return location.toLowerCase() === condition.value.toLowerCase()
    case "contains":
      return location.toLowerCase().includes(condition.value.toLowerCase())
    default:
      return false
  }
}

// Helper function to evaluate a scan count condition
function evaluateScanCountCondition(condition: any, scanCount: number): boolean {
  switch (condition.operator) {
    case "equals":
      return scanCount === Number(condition.value)
    case "greaterThan":
      return scanCount > Number(condition.value)
    case "lessThan":
      return scanCount < Number(condition.value)
    default:
      return false
  }
}

// Helper function to apply actions to a message
function applyActions(actions: any[], message: string, context: UserContext, user: User): string {
  let result = message

  for (const action of actions) {
    switch (action.type) {
      case "includeUserName":
        if (action.value && user.user_metadata?.full_name) {
          result = `${user.user_metadata.full_name}, ${result.charAt(0).toLowerCase()}${result.slice(1)}`
        }
        break
      case "includeLocation":
        if (action.value && context.location && context.location !== "Unknown") {
          // Add location context to the message
          result = `${result} In ${context.location}, this message resonates even more strongly.`
        }
        break
      // Additional actions can be added here
    }
  }

  return result
}
