import { supabase } from "../lib/supabase/client"

// Mock data for products
const products = [
  {
    name: "Inspiration Tea - 50g Tin",
    theme_id: "inspiration",
    price: 14.99,
    sale_price: null,
    sku: "INS-50G-TIN",
    stock: 42,
    weight: "50",
    dimensions: "8 x 8 x 10",
    description:
      "Our Inspiration tea is carefully crafted to ignite your creative spark. This blend combines premium black tea with subtle notes of citrus and spice, designed to awaken your senses and fuel your imagination.",
    short_description: "A blend designed to ignite your creative spark and fuel your imagination.",
    status: "active",
    active: true,
    featured: true,
  },
  {
    name: "Serenity Tea - 50g Tin",
    theme_id: "serenity",
    price: 14.99,
    sale_price: null,
    sku: "SER-50G-TIN",
    stock: 38,
    weight: "50",
    dimensions: "8 x 8 x 10",
    description:
      "Find your center with our Serenity blend. This calming herbal infusion combines chamomile, lavender, and lemon balm to promote peace and tranquility, perfect for unwinding after a long day.",
    short_description: "Find your center with this calming blend that promotes peace and tranquility.",
    status: "active",
    active: true,
    featured: true,
  },
  {
    name: "Adventure Tea - 50g Tin",
    theme_id: "adventure",
    price: 14.99,
    sale_price: null,
    sku: "ADV-50G-TIN",
    stock: 27,
    weight: "50",
    dimensions: "8 x 8 x 10",
    description:
      "Embark on new journeys with our Adventure blend. This bold black tea with hints of cinnamon and ginger will awaken your spirit of exploration and fuel your sense of discovery.",
    short_description: "Embark on new journeys with this bold blend that awakens your spirit of exploration.",
    status: "active",
    active: true,
    featured: false,
  },
  {
    name: "Tea Sampler Pack",
    theme_id: "multiple",
    price: 29.99,
    sale_price: 24.99,
    sku: "SAMPLER-7",
    stock: 25,
    weight: "175",
    dimensions: "20 x 15 x 5",
    description:
      "Experience all seven of our unique tea blends with this sampler pack. Each tin contains 25g of tea, perfect for discovering your favorite Infucius blend.",
    short_description: "A collection of all seven tea blends in convenient sample sizes.",
    status: "active",
    active: true,
    featured: true,
  },
  {
    name: "Ceramic Tea Infuser",
    theme_id: "accessories",
    price: 12.99,
    sale_price: null,
    sku: "ACC-INFUSER",
    stock: 30,
    weight: "120",
    dimensions: "12 x 6 x 6",
    description:
      "This elegant ceramic tea infuser is designed to enhance your tea experience. Simply add your favorite Infucius tea, pour hot water, and enjoy the perfect brew.",
    short_description: "An elegant ceramic infuser for the perfect brewing experience.",
    status: "active",
    active: true,
    featured: false,
  },
]

// Message templates for personalization
const messageTemplates = [
  // Inspiration
  { theme_id: "inspiration", message: "The spark you've been seeking is already within you, waiting to be kindled." },
  { theme_id: "inspiration", message: "Today, your creativity will flow like the steam rising from your cup." },
  {
    theme_id: "inspiration",
    message: "Look to the patterns in your tea leaves – they mirror the patterns of opportunity in your life.",
  },
  { theme_id: "inspiration", message: "The inspiration you seek is in the quiet moments between thoughts." },
  { theme_id: "inspiration", message: "A creative breakthrough awaits you where you least expect it." },

  // Serenity
  {
    theme_id: "serenity",
    message: "Find peace in the space between breaths, just as flavor exists in the pause between sips.",
  },
  { theme_id: "serenity", message: "Like this tea, let warmth spread through you, melting away tension." },
  { theme_id: "serenity", message: "The stillness in your cup reflects the calm you can cultivate within." },
  { theme_id: "serenity", message: "Today, let your thoughts settle like tea leaves after the pour." },
  { theme_id: "serenity", message: "Peace isn't found in the absence of chaos, but in your response to it." },

  // Adventure
  { theme_id: "adventure", message: "The journey of a thousand miles begins with a single sip." },
  { theme_id: "adventure", message: "New horizons await beyond the rim of your comfort zone." },
  {
    theme_id: "adventure",
    message: "Like this tea's journey from distant lands, your path will cross unexpected territories.",
  },
  { theme_id: "adventure", message: "The best adventures often start with a moment of courage and a cup of tea." },
  { theme_id: "adventure", message: "Today, let curiosity be your compass and boldness your map." },
]

// Personalization rules
const personalizationRules = [
  {
    name: "Morning Messages",
    conditions: [{ type: "time", operator: "between", value: ["06:00", "12:00"] }],
    actions: [{ type: "useMessageSet", value: "morning" }],
    priority: 10,
    active: true,
  },
  {
    name: "Evening Messages",
    conditions: [{ type: "time", operator: "between", value: ["18:00", "23:59"] }],
    actions: [{ type: "useMessageSet", value: "evening" }],
    priority: 10,
    active: true,
  },
  {
    name: "Rainy Day Messages",
    conditions: [{ type: "weather", operator: "equals", value: "rainy" }],
    actions: [{ type: "useMessageSet", value: "rainy" }],
    priority: 20,
    active: true,
  },
  {
    name: "Returning Customer",
    conditions: [{ type: "scanCount", operator: "greaterThan", value: 3 }],
    actions: [
      { type: "includeUserName", value: true },
      { type: "useMessageSet", value: "returning" },
    ],
    priority: 30,
    active: true,
  },
]

async function initializeDatabase() {
  console.log("Starting database initialization...")

  try {
    // Insert products
    console.log("Inserting products...")
    for (const product of products) {
      const { data, error } = await supabase.from("products").insert(product).select().single()

      if (error) {
        console.error(`Error inserting product ${product.name}:`, error)
      } else {
        console.log(`Inserted product: ${product.name}`)
      }
    }

    // Insert message templates
    console.log("Inserting message templates...")
    for (const template of messageTemplates) {
      const { error } = await supabase.from("message_templates").insert(template)

      if (error) {
        console.error(`Error inserting message template:`, error)
      }
    }
    console.log(`Inserted ${messageTemplates.length} message templates`)

    // Insert personalization rules
    console.log("Inserting personalization rules...")
    for (const rule of personalizationRules) {
      const { error } = await supabase.from("personalization_rules").insert(rule)

      if (error) {
        console.error(`Error inserting personalization rule ${rule.name}:`, error)
      } else {
        console.log(`Inserted rule: ${rule.name}`)
      }
    }

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Database initialization failed:", error)
  }
}

// Run the initialization
initializeDatabase()
