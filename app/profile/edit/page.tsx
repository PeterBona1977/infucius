"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { CountrySelector, type CountryCode } from "@/components/country-selector"
import { useUserCountry } from "@/hooks/use-user-country"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditProfilePage() {
  const { user, loading, updateUserProfile } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    countryCode: "us",
    phoneNumber: "",
    birthDate: "", // Add birthDate field
    teaLoveReason: "", // Add teaLoveReason field
    favoriteTeaType: "", // Add favorite tea type
  })

  const { countryCode, loading: countryLoading } = useUserCountry()

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.user_metadata?.bio || "Tea enthusiast and fortune seeker.",
        location: user.user_metadata?.location || "San Francisco, CA",
        countryCode: user.user_metadata?.country || countryCode,
        phoneNumber: user.user_metadata?.phone_number || "",
        birthDate: user.user_metadata?.birth_date || "",
        teaLoveReason: user.user_metadata?.tea_love_reason || "It brings me a moment of calm in a busy day.",
        favoriteTeaType: user.user_metadata?.favorite_tea_type || "",
      })
    }
  }, [user, countryCode])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (country: CountryCode) => {
    setFormData((prev) => ({ ...prev, countryCode: country.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update user profile in Supabase
      await updateUserProfile({
        full_name: formData.name,
        bio: formData.bio,
        location: formData.location,
        country: formData.countryCode,
        phone_number: formData.phoneNumber,
        birth_date: formData.birthDate,
        tea_love_reason: formData.teaLoveReason,
        favorite_tea_type: formData.favoriteTeaType,
      })

      router.push("/profile")
    } catch (error) {
      console.error("Error saving profile:", error)
      // Show error message to user
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="text-2xl">{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Picture
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <CountrySelector
                      value={formData.countryCode}
                      onChange={handleCountryChange}
                      className="w-[120px] flex-shrink-0"
                    />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Include your country code for international calls</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for personalized fortunes and astrological insights
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favoriteTeaType">Favorite Tea Type</Label>
                  <Select
                    value={formData.favoriteTeaType}
                    onValueChange={(value) => handleSelectChange("favoriteTeaType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your favorite tea" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green Tea</SelectItem>
                      <SelectItem value="black">Black Tea</SelectItem>
                      <SelectItem value="oolong">Oolong Tea</SelectItem>
                      <SelectItem value="white">White Tea</SelectItem>
                      <SelectItem value="herbal">Herbal Tea</SelectItem>
                      <SelectItem value="chai">Chai</SelectItem>
                      <SelectItem value="matcha">Matcha</SelectItem>
                      <SelectItem value="puerh">Pu-erh Tea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teaLoveReason">I love tea because...</Label>
                <Textarea
                  id="teaLoveReason"
                  name="teaLoveReason"
                  value={formData.teaLoveReason}
                  onChange={handleChange}
                  placeholder="Share why you love tea"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                <div></div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave password fields empty if you don't want to change your password.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
