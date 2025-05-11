"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Plus, Save, Trash2, Edit, Copy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock personalization rules
const mockRules = [
  {
    id: "rule1",
    name: "Morning Messages",
    active: true,
    conditions: [{ type: "time", operator: "between", value: ["06:00", "12:00"] }],
    actions: [{ type: "useMessageSet", value: "morning" }],
    priority: 10,
  },
  {
    id: "rule2",
    name: "Evening Messages",
    active: true,
    conditions: [{ type: "time", operator: "between", value: ["18:00", "23:59"] }],
    actions: [{ type: "useMessageSet", value: "evening" }],
    priority: 10,
  },
  {
    id: "rule3",
    name: "Rainy Day Messages",
    active: true,
    conditions: [{ type: "weather", operator: "equals", value: "rainy" }],
    actions: [{ type: "useMessageSet", value: "rainy" }],
    priority: 20,
  },
  {
    id: "rule4",
    name: "Returning Customer",
    active: true,
    conditions: [{ type: "scanCount", operator: "greaterThan", value: 3 }],
    actions: [
      { type: "includeUserName", value: true },
      { type: "useMessageSet", value: "returning" },
    ],
    priority: 30,
  },
  {
    id: "rule5",
    name: "Location-Based: New York",
    active: false,
    conditions: [{ type: "location", operator: "contains", value: "New York" }],
    actions: [{ type: "useMessageSet", value: "newyork" }],
    priority: 15,
  },
]

// Mock message sets
const mockMessageSets = [
  {
    id: "morning",
    name: "Morning Messages",
    description: "Messages for morning hours",
    messages: [
      "The morning dew on leaves mirrors the fresh start in your cup.",
      "Like the sunrise, this tea brings warmth and clarity to your day.",
      "Begin your day with intention, just as this tea was crafted with care.",
    ],
  },
  {
    id: "evening",
    name: "Evening Messages",
    description: "Messages for evening hours",
    messages: [
      "As the day winds down, let this tea help you reflect and release.",
      "Evening brings a special stillness, perfect for savoring this blend.",
      "The day's experiences steep within you, just as these leaves in water.",
    ],
  },
  {
    id: "rainy",
    name: "Rainy Day Messages",
    description: "Messages for rainy weather",
    messages: [
      "Rain nourishes the earth as this tea nourishes your spirit.",
      "The rhythm of raindrops matches the calming cadence of sipping tea.",
      "On days when clouds gather, find your sunshine in this cup.",
    ],
  },
  {
    id: "returning",
    name: "Returning Customer Messages",
    description: "Messages for repeat customers",
    messages: [
      "Welcome back! Your journey with us continues to unfold with each cup.",
      "Your return is like revisiting a favorite book – familiar yet revealing new insights.",
      "Like an old friend, this tea remembers you and greets you warmly.",
    ],
  },
  {
    id: "newyork",
    name: "New York Messages",
    description: "Messages for customers in New York",
    messages: [
      "The energy of the city meets the tranquility of tea in your cup.",
      "Even in the city that never sleeps, moments of calm are essential.",
      "From bustling streets to this moment of stillness – New York contains multitudes.",
    ],
  },
]

// Mock variables for personalization
const mockVariables = [
  { id: "userName", name: "User Name", description: "The user's first name", example: "John" },
  { id: "timeOfDay", name: "Time of Day", description: "Morning, Afternoon, Evening, or Night", example: "Afternoon" },
  { id: "weather", name: "Weather", description: "Current weather condition", example: "Sunny" },
  { id: "location", name: "Location", description: "User's city or region", example: "San Francisco" },
  { id: "previousTea", name: "Previous Tea", description: "The last tea theme scanned", example: "Serenity" },
  { id: "scanCount", name: "Scan Count", description: "Number of times user has scanned QR codes", example: "5" },
]

export default function PersonalizationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("rules")
  const [rules, setRules] = useState(mockRules)
  const [messageSets, setMessageSets] = useState(mockMessageSets)
  const [variables] = useState(mockVariables)
  const [editingRule, setEditingRule] = useState<any>(null)
  const [editingMessageSet, setEditingMessageSet] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "admin") {
        router.push("/unauthorized")
      }
    }
  }, [loading, user, router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in the useEffect
  }

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, active: !rule.active } : rule)))
  }

  const handleEditRule = (rule: any) => {
    setEditingRule(rule)
  }

  const handleSaveRule = () => {
    if (editingRule) {
      setRules(rules.map((rule) => (rule.id === editingRule.id ? editingRule : rule)))
      setEditingRule(null)
    }
  }

  const handleEditMessageSet = (messageSet: any) => {
    setEditingMessageSet(messageSet)
  }

  const handleSaveMessageSet = () => {
    if (editingMessageSet) {
      setMessageSets(messageSets.map((set) => (set.id === editingMessageSet.id ? editingMessageSet : set)))
      setEditingMessageSet(null)
    }
  }

  const handleAddMessage = () => {
    if (newMessage.trim() && editingMessageSet) {
      setEditingMessageSet({
        ...editingMessageSet,
        messages: [...editingMessageSet.messages, newMessage.trim()],
      })
      setNewMessage("")
    }
  }

  const handleRemoveMessage = (index: number) => {
    if (editingMessageSet) {
      setEditingMessageSet({
        ...editingMessageSet,
        messages: editingMessageSet.messages.filter((_: any, i: number) => i !== index),
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Message Personalization</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="rules">Personalization Rules</TabsTrigger>
          <TabsTrigger value="messages">Message Sets</TabsTrigger>
          <TabsTrigger value="variables">Available Variables</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules">
          {editingRule ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Rule: {editingRule.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input
                    id="ruleName"
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Conditions</Label>
                  {editingRule.conditions.map((condition: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Select
                        value={condition.type}
                        onValueChange={(value) => {
                          const newConditions = [...editingRule.conditions]
                          newConditions[index] = { ...newConditions[index], type: value }
                          setEditingRule({ ...editingRule, conditions: newConditions })
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Time</SelectItem>
                          <SelectItem value="weather">Weather</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                          <SelectItem value="scanCount">Scan Count</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={condition.operator}
                        onValueChange={(value) => {
                          const newConditions = [...editingRule.conditions]
                          newConditions[index] = { ...newConditions[index], operator: value }
                          setEditingRule({ ...editingRule, conditions: newConditions })
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="greaterThan">Greater Than</SelectItem>
                          <SelectItem value="lessThan">Less Than</SelectItem>
                          <SelectItem value="between">Between</SelectItem>
                        </SelectContent>
                      </Select>

                      {condition.operator === "between" ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            value={condition.value[0]}
                            onChange={(e) => {
                              const newConditions = [...editingRule.conditions]
                              newConditions[index] = {
                                ...newConditions[index],
                                value: [e.target.value, condition.value[1]],
                              }
                              setEditingRule({ ...editingRule, conditions: newConditions })
                            }}
                            placeholder="From"
                          />
                          <Input
                            value={condition.value[1]}
                            onChange={(e) => {
                              const newConditions = [...editingRule.conditions]
                              newConditions[index] = {
                                ...newConditions[index],
                                value: [condition.value[0], e.target.value],
                              }
                              setEditingRule({ ...editingRule, conditions: newConditions })
                            }}
                            placeholder="To"
                          />
                        </div>
                      ) : (
                        <Input
                          value={Array.isArray(condition.value) ? condition.value[0] : condition.value}
                          onChange={(e) => {
                            const newConditions = [...editingRule.conditions]
                            newConditions[index] = { ...newConditions[index], value: e.target.value }
                            setEditingRule({ ...editingRule, conditions: newConditions })
                          }}
                          className="flex-1"
                        />
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newConditions = editingRule.conditions.filter((_: any, i: number) => i !== index)
                          setEditingRule({ ...editingRule, conditions: newConditions })
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRule({
                        ...editingRule,
                        conditions: [...editingRule.conditions, { type: "time", operator: "equals", value: "" }],
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Condition
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  {editingRule.actions.map((action: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Select
                        value={action.type}
                        onValueChange={(value) => {
                          const newActions = [...editingRule.actions]
                          newActions[index] = { ...newActions[index], type: value }
                          setEditingRule({ ...editingRule, actions: newActions })
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="useMessageSet">Use Message Set</SelectItem>
                          <SelectItem value="includeUserName">Include User Name</SelectItem>
                          <SelectItem value="includeLocation">Include Location</SelectItem>
                        </SelectContent>
                      </Select>

                      {action.type === "useMessageSet" ? (
                        <Select
                          value={action.value}
                          onValueChange={(value) => {
                            const newActions = [...editingRule.actions]
                            newActions[index] = { ...newActions[index], value }
                            setEditingRule({ ...editingRule, actions: newActions })
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select message set" />
                          </SelectTrigger>
                          <SelectContent>
                            {messageSets.map((set) => (
                              <SelectItem key={set.id} value={set.id}>
                                {set.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : action.type === "includeUserName" || action.type === "includeLocation" ? (
                        <Select
                          value={action.value.toString()}
                          onValueChange={(value) => {
                            const newActions = [...editingRule.actions]
                            newActions[index] = { ...newActions[index], value: value === "true" }
                            setEditingRule({ ...editingRule, actions: newActions })
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select value" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={action.value}
                          onChange={(e) => {
                            const newActions = [...editingRule.actions]
                            newActions[index] = { ...newActions[index], value: e.target.value }
                            setEditingRule({ ...editingRule, actions: newActions })
                          }}
                          className="flex-1"
                        />
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newActions = editingRule.actions.filter((_: any, i: number) => i !== index)
                          setEditingRule({ ...editingRule, actions: newActions })
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRule({
                        ...editingRule,
                        actions: [...editingRule.actions, { type: "useMessageSet", value: messageSets[0]?.id || "" }],
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="100"
                    value={editingRule.priority}
                    onChange={(e) => setEditingRule({ ...editingRule, priority: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Higher priority rules will be evaluated first (1-100)</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={editingRule.active}
                    onCheckedChange={(checked) => setEditingRule({ ...editingRule, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingRule(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRule}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Rule
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personalization Rules</CardTitle>
                <Button
                  onClick={() => {
                    setEditingRule({
                      id: `rule-${Date.now()}`,
                      name: "New Rule",
                      active: true,
                      conditions: [{ type: "time", operator: "equals", value: "" }],
                      actions: [{ type: "useMessageSet", value: messageSets[0]?.id || "" }],
                      priority: 10,
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Rule
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.conditions.length} condition(s)</TableCell>
                        <TableCell>{rule.actions.length} action(s)</TableCell>
                        <TableCell>{rule.priority}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`active-${rule.id}`}
                              checked={rule.active}
                              onCheckedChange={() => toggleRuleStatus(rule.id)}
                            />
                            <Label htmlFor={`active-${rule.id}`}>{rule.active ? "Active" : "Inactive"}</Label>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Message Sets Tab */}
        <TabsContent value="messages">
          {editingMessageSet ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Message Set: {editingMessageSet.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="setName">Set Name</Label>
                  <Input
                    id="setName"
                    value={editingMessageSet.name}
                    onChange={(e) => setEditingMessageSet({ ...editingMessageSet, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setDescription">Description</Label>
                  <Textarea
                    id="setDescription"
                    value={editingMessageSet.description}
                    onChange={(e) => setEditingMessageSet({ ...editingMessageSet, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Messages</Label>
                  {editingMessageSet.messages.map((message: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 border rounded">
                      <div className="flex-1">
                        <p>{message}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewMessage(message)
                          }}
                        >
                          <Copy className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveMessage(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="newMessage">Add New Message</Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="newMessage"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Enter a new message..."
                        rows={2}
                        className="flex-1"
                      />
                      <Button className="self-end" onClick={handleAddMessage} disabled={!newMessage.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can use variables like {"{userName}"}, {"{location}"}, etc. in your messages.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingMessageSet(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMessageSet}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Message Set
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Message Sets</CardTitle>
                <Button
                  onClick={() => {
                    setEditingMessageSet({
                      id: `set-${Date.now()}`,
                      name: "New Message Set",
                      description: "Description of this message set",
                      messages: [],
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Set
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messageSets.map((set) => (
                      <TableRow key={set.id}>
                        <TableCell className="font-medium">{set.name}</TableCell>
                        <TableCell>{set.description}</TableCell>
                        <TableCell>{set.messages.length} message(s)</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditMessageSet(set)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Variables Tab */}
        <TabsContent value="variables">
          <Card>
            <CardHeader>
              <CardTitle>Available Personalization Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Example</TableHead>
                    <TableHead>Usage in Messages</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variables.map((variable) => (
                    <TableRow key={variable.id}>
                      <TableCell className="font-medium">{variable.name}</TableCell>
                      <TableCell>{variable.description}</TableCell>
                      <TableCell>{variable.example}</TableCell>
                      <TableCell>
                        <code>{`{${variable.id}}`}</code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
