import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "email,public_profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Admin hardcoded credentials
        if (credentials.email === "admin@infucius.com" && credentials.password === "admin123") {
          return {
            id: "admin-id",
            name: "Admin User",
            email: "admin@infucius.com",
            role: "admin",
            image: null,
          }
        }

        // Check Supabase for user
        const { data, error } = await supabase.from("users").select("*").eq("email", credentials.email).single()

        if (error || !data) {
          console.error("User lookup error:", error)
          return null
        }

        // In a real app, you would verify the password hash here
        // For demo purposes, we're just checking if it matches
        if (data.password !== credentials.password) {
          return null
        }

        return {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role || "user",
          image: data.image,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          image: user.image,
        }

        if (account) {
          token.accessToken = account.access_token
          token.provider = account.provider
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken
      }

      return session
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      // Store user data in Supabase when they sign in with OAuth
      if (account && account.provider && profile) {
        try {
          // Check if user exists
          const { data: existingUser } = await supabase.from("users").select("*").eq("email", user.email).single()

          if (!existingUser) {
            // Create new user
            await supabase.from("users").insert([
              {
                id: user.id,
                email: user.email,
                name: user.name || profile.name,
                image: user.image,
                provider: account.provider,
                provider_id: account.providerAccountId,
                role: "user",
                created_at: new Date().toISOString(),
              },
            ])
          }
        } catch (error) {
          console.error("Error saving user to Supabase:", error)
        }
      }

      return true
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("User signed in:", user)
      console.log("Account:", account)
      console.log("Profile:", profile)
      console.log("Is new user:", isNewUser)
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
