"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutoTranslationSettings } from "@/components/admin/auto-translation-settings"
import { TranslationManager } from "@/components/admin/translation-manager"

export default function TranslationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Translation Management</h1>
      </div>

      <Tabs defaultValue="auto" className="w-full">
        <TabsList>
          <TabsTrigger value="auto">Auto Translation</TabsTrigger>
          <TabsTrigger value="manual">Manual Translation</TabsTrigger>
        </TabsList>
        <TabsContent value="auto">
          <AutoTranslationSettings />
        </TabsContent>
        <TabsContent value="manual">
          <TranslationManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
