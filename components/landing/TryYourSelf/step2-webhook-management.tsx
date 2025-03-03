"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import type { Webhook } from "./types/webhook"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Copy, Eye, EyeOff, Trash, ArrowLeft, ArrowRight } from "lucide-react"
import { Label } from "./ui/label"

interface Step2Props {
  webhooks: Webhook[]
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>
  goToNextStep: () => void
  goToPreviousStep: () => void
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>
}

export function Step2WebhookManagement({
  webhooks,
  setWebhooks,
  goToNextStep,
  goToPreviousStep,
  setSelectedWebhook,
}: Step2Props) {
  const [viewWebhook, setViewWebhook] = useState<Webhook | null>(null)
  const [deleteWebhook, setDeleteWebhook] = useState<Webhook | null>(null)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleToggleStatus = (id: string) => {
    setWebhooks(webhooks.map((webhook) => (webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook)))
  }

  const handleToggleNotification = (id: string, service: "email" | "slack") => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id
          ? {
              ...webhook,
              notificationServices: {
                ...webhook.notificationServices,
                [service]: !webhook.notificationServices[service],
              },
            }
          : webhook,
      ),
    )
  }

  const handleDeleteWebhook = () => {
    if (deleteWebhook) {
      setWebhooks(webhooks.filter((webhook) => webhook.id !== deleteWebhook.id))
      setDeleteWebhook(null)
      if (viewWebhook?.id === deleteWebhook.id) {
        setViewWebhook(null)
      }
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(type)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleNext = () => {
    if (webhooks.length > 0) {
      setSelectedWebhook(webhooks[0])
      goToNextStep()
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Step 2: Manage Your Webhooks</h3>
        <p className="text-violet-200 mb-6">
          Configure and manage the webhooks you've created. Toggle status, set notification preferences, and more.
        </p>
      </div>

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <motion.div
            key={webhook.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-violet-800/30 p-4"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-white">{webhook.name}</h4>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webhook.isActive}
                    onCheckedChange={() => handleToggleStatus(webhook.id)}
                    className="data-[state=checked]:bg-violet-600"
                  />
                  <span className="text-sm text-violet-200">{webhook.isActive ? "Active" : "Inactive"}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-violet-200">Email</Label>
                    <Switch
                      checked={webhook.notificationServices.email}
                      onCheckedChange={() => handleToggleNotification(webhook.id, "email")}
                      className="data-[state=checked]:bg-violet-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-violet-200">Slack</Label>
                    <Switch
                      checked={webhook.notificationServices.slack}
                      onCheckedChange={() => handleToggleNotification(webhook.id, "slack")}
                      className="data-[state=checked]:bg-violet-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewWebhook(webhook)}
                    className="border-violet-600 text-violet-200 hover:bg-violet-900/30"
                  >
                    View More
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteWebhook(webhook)}
                    className="bg-red-900/50 hover:bg-red-800/70 text-white"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Webhook Modal */}
      <Dialog open={!!viewWebhook} onOpenChange={(open) => !open && setViewWebhook(null)}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-lg border border-violet-800/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Webhook Details</DialogTitle>
          </DialogHeader>

          {viewWebhook && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-violet-300">Webhook Name</Label>
                <div className="bg-gray-800/70 p-3 rounded-md text-white">{viewWebhook.name}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-violet-300">Webhook URL</Label>
                <div className="bg-gray-800/70 p-3 rounded-md text-white flex justify-between items-center">
                  <span className="truncate mr-2">{viewWebhook.url}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(viewWebhook.url, "url")}
                    className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/30"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedText === "url" && <span className="ml-2 text-xs">Copied!</span>}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-violet-300">Secret Key</Label>
                <div className="bg-gray-800/70 p-3 rounded-md text-white flex justify-between items-center">
                  <span className="truncate mr-2">
                    {showSecretKey ? viewWebhook.secretKey : "••••••••••••••••••••••"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/30"
                    >
                      {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(viewWebhook.secretKey, "key")}
                      className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/30"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedText === "key" && <span className="ml-2 text-xs">Copied!</span>}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-violet-300">Notification Services</Label>
                <div className="bg-gray-800/70 p-4 rounded-md flex justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-white">Email</Label>
                    <Switch
                      checked={viewWebhook.notificationServices.email}
                      onCheckedChange={() => handleToggleNotification(viewWebhook.id, "email")}
                      className="data-[state=checked]:bg-violet-600"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-white">Slack</Label>
                    <Switch
                      checked={viewWebhook.notificationServices.slack}
                      onCheckedChange={() => handleToggleNotification(viewWebhook.id, "slack")}
                      className="data-[state=checked]:bg-violet-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteWebhook(viewWebhook)
                setViewWebhook(null)
              }}
              className="bg-red-900/50 hover:bg-red-800/70"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewWebhook(null)}
              className="border-violet-600 text-violet-200 hover:bg-violet-900/30"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteWebhook} onOpenChange={(open) => !open && setDeleteWebhook(null)}>
        <AlertDialogContent className="bg-gray-900/95 backdrop-blur-lg border border-violet-800/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this webhook? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWebhook} className="bg-red-900/70 hover:bg-red-800 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between mt-6">
        <Button
          onClick={goToPreviousStep}
          variant="outline"
          className="border-violet-600 text-violet-200 hover:bg-violet-900/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext} className="bg-violet-600 hover:bg-violet-700 text-white">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

