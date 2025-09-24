'use client'

import React, { useState } from 'react'
import { X, Bell, Mail, Smartphone, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNotificationPreferences } from '@/hooks/use-notifications'
import type { NotificationChannel, NotificationType } from '@/lib/notifications/types'

interface NotificationPreferencesProps {
  onClose: () => void
}

const notificationTypes: { type: NotificationType; label: string; description: string }[] = [
  {
    type: 'qa.question',
    label: 'Questions',
    description: 'New questions in Q&A'
  },
  {
    type: 'qa.answer',
    label: 'Answers',
    description: 'Answers to your questions'
  },
  {
    type: 'qa.comment',
    label: 'Comments',
    description: 'Comments on your posts'
  },
  {
    type: 'qa.vote',
    label: 'Votes',
    description: 'Votes on your posts'
  },
  {
    type: 'course.enrollment',
    label: 'Course enrollments',
    description: 'New course enrollments'
  },
  {
    type: 'course.update',
    label: 'Course updates',
    description: 'Updates to your courses'
  },
  {
    type: 'assignment.due',
    label: 'Assignment due',
    description: 'Upcoming assignment deadlines'
  },
  {
    type: 'assignment.graded',
    label: 'Assignment graded',
    description: 'Graded assignments'
  },
  {
    type: 'discussion.reply',
    label: 'Discussion replies',
    description: 'Replies to your discussion posts'
  },
  {
    type: 'discussion.mention',
    label: 'Mentions',
    description: 'When you are mentioned in discussions'
  },
  {
    type: 'achievement.earned',
    label: 'Achievements',
    description: 'New achievements earned'
  },
  {
    type: 'system.maintenance',
    label: 'System maintenance',
    description: 'System maintenance notifications'
  },
  {
    type: 'system.update',
    label: 'System updates',
    description: 'System update notifications'
  }
]

const channels: { channel: NotificationChannel; icon: React.ComponentType<{ className?: string }>; label: string; description: string }[] = [
  { channel: 'in_app', icon: Bell, label: 'In-app', description: 'Show notifications in the app' },
  { channel: 'email', icon: Mail, label: 'Email', description: 'Send notifications via email' },
  { channel: 'push', icon: Smartphone, label: 'Push', description: 'Send push notifications to your device' },
  { channel: 'sms', icon: Volume2, label: 'SMS', description: 'Send notifications via SMS' }
]

export function NotificationPreferences({ onClose }: NotificationPreferencesProps) {
  const { preferences, loading, updatePreferences } = useNotificationPreferences()
  const [saving, setSaving] = useState(false)

  const handleChannelToggle = async (channel: NotificationChannel, enabled: boolean) => {
    if (!preferences) return

    setSaving(true)
    try {
      const updatedChannels = enabled
        ? [...preferences.channels, channel]
        : preferences.channels.filter(c => c !== channel)

      await updatePreferences({ channels: updatedChannels })
    } finally {
      setSaving(false)
    }
  }

  const handleTypeToggle = async (type: NotificationType, enabled: boolean) => {
    if (!preferences) return

    setSaving(true)
    try {
      const updatedTypes = enabled
        ? [...preferences.types, type]
        : preferences.types.filter(t => t !== type)

      await updatePreferences({ types: updatedTypes })
    } finally {
      setSaving(false)
    }
  }

  const handleQuietHoursToggle = async (enabled: boolean) => {
    if (!preferences) return

    setSaving(true)
    try {
      await updatePreferences({ quietHours: enabled })
    } finally {
      setSaving(false)
    }
  }

  const handleQuietHoursChange = async (field: 'start' | 'end', value: string) => {
    if (!preferences) return

    setSaving(true)
    try {
      await updatePreferences({
        quietHoursStart: field === 'start' ? value : preferences.quietHoursStart,
        quietHoursEnd: field === 'end' ? value : preferences.quietHoursEnd
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDigestToggle = async (enabled: boolean) => {
    if (!preferences) return

    setSaving(true)
    try {
      await updatePreferences({ digestEnabled: enabled })
    } finally {
      setSaving(false)
    }
  }

  const handleDigestFrequencyChange = async (frequency: 'daily' | 'weekly') => {
    if (!preferences) return

    setSaving(true)
    try {
      await updatePreferences({ digestFrequency: frequency })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !preferences) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notification Preferences</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notification Preferences</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Notification Channels */}
        <div>
          <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose how you want to receive notifications
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map(({ channel, icon: Icon, label, description }) => (
              <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor={`channel-${channel}`} className="font-medium">
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={`channel-${channel}`}
                  checked={preferences.channels.includes(channel)}
                  onCheckedChange={(checked) => handleChannelToggle(channel, checked)}
                  disabled={saving}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Notification Types */}
        <div>
          <h3 className="text-lg font-medium mb-4">Notification Types</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose which types of notifications you want to receive
          </p>

          <div className="space-y-3">
            {notificationTypes.map(({ type, label, description }) => (
              <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`type-${type}`} className="font-medium">
                    {label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
                <Switch
                  id={`type-${type}`}
                  checked={preferences.types.includes(type)}
                  onCheckedChange={(checked) => handleTypeToggle(type, checked)}
                  disabled={saving}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Quiet Hours */}
        <div>
          <h3 className="text-lg font-medium mb-4">Quiet Hours</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Set hours when you don't want to receive notifications
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours-enabled" className="font-medium">
                Enable quiet hours
              </Label>
              <Switch
                id="quiet-hours-enabled"
                checked={preferences.quietHours}
                onCheckedChange={handleQuietHoursToggle}
                disabled={saving}
              />
            </div>

            {preferences.quietHours && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div>
                  <Label htmlFor="quiet-start" className="text-sm">
                    Start time
                  </Label>
                  <Select
                    value={preferences.quietHoursStart}
                    onValueChange={(value) => handleQuietHoursChange('start', value)}
                    disabled={saving}
                  >
                    <SelectTrigger id="quiet-start">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0')
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quiet-end" className="text-sm">
                    End time
                  </Label>
                  <Select
                    value={preferences.quietHoursEnd}
                    onValueChange={(value) => handleQuietHoursChange('end', value)}
                    disabled={saving}
                  >
                    <SelectTrigger id="quiet-end">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0')
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Email Digest */}
        <div>
          <h3 className="text-lg font-medium mb-4">Email Digest</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Receive a summary of notifications via email
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="digest-enabled" className="font-medium">
                Enable email digest
              </Label>
              <Switch
                id="digest-enabled"
                checked={preferences.digestEnabled}
                onCheckedChange={handleDigestToggle}
                disabled={saving}
              />
            </div>

            {preferences.digestEnabled && (
              <div className="pl-4">
                <Label htmlFor="digest-frequency" className="text-sm">
                  Frequency
                </Label>
                <Select
                  value={preferences.digestFrequency}
                  onValueChange={(value: 'daily' | 'weekly') => handleDigestFrequencyChange(value)}
                  disabled={saving}
                >
                  <SelectTrigger id="digest-frequency" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {saving && (
          <div className="flex items-center justify-center py-4">
            <Badge variant="secondary">Saving...</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}