import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Calendar, Smartphone, Volume2, VolumeX, Zap, Moon } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    taskReminders: true,
    dailyDigest: true,
    weeklyReport: false,
    overdueAlerts: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    reminderTiming: '15',
    digestTime: '09:00',
    priority: 'high'
  });

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
    loadSettings();
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.permission;
      setHasPermission(permission === 'granted');
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive task reminders and updates.",
        });
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Enable notifications in your browser settings.",
          variant: "destructive"
        });
      }
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleSelectChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const testNotification = () => {
    if (hasPermission && settings.pushNotifications) {
      new Notification('Todo App Test', {
        body: 'This is how your notifications will look!',
        icon: '/favicon.ico'
      });
      toast({
        title: "Test Sent",
        description: "Check if you received the notification.",
      });
    } else {
      toast({
        title: "Cannot Send Test",
        description: "Please enable notifications first.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
            <Bell className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Notification Settings</h2>
            <p className="text-white/60">Customize your notification preferences</p>
          </div>
        </div>

        {!hasPermission && (
          <Card className="mb-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-md border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white">Enable Notifications</p>
                    <p className="text-sm text-white/60">Allow notifications to receive reminders</p>
                  </div>
                </div>
                <Button onClick={requestPermission} size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Smartphone className="h-5 w-5" />
                General Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-sm text-white/60">Receive notifications in your browser</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle('pushNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-sm text-white/60">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4 text-green-400" /> : <VolumeX className="h-4 w-4 text-red-400" />}
                  <Label className="text-white">Sound</Label>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={() => handleToggle('soundEnabled')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                  <Label className="text-white">Vibration</Label>
                </div>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={() => handleToggle('vibrationEnabled')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" />
                Task Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Task Reminders</Label>
                  <p className="text-sm text-white/60">Get reminded about upcoming tasks</p>
                </div>
                <Switch
                  checked={settings.taskReminders}
                  onCheckedChange={() => handleToggle('taskReminders')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Reminder Timing</Label>
                <Select value={settings.reminderTiming} onValueChange={(value) => handleSelectChange('reminderTiming', value)}>
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Overdue Alerts</Label>
                  <p className="text-sm text-white/60">Get notified about overdue tasks</p>
                </div>
                <Switch
                  checked={settings.overdueAlerts}
                  onCheckedChange={() => handleToggle('overdueAlerts')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Moon className="h-5 w-5" />
                Quiet Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Enable Quiet Hours</Label>
                  <p className="text-sm text-white/60">Disable notifications during specific hours</p>
                </div>
                <Switch
                  checked={settings.quietHours}
                  onCheckedChange={() => handleToggle('quietHours')}
                />
              </div>

              {settings.quietHours && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Start Time</Label>
                    <Select value={settings.quietStart} onValueChange={(value) => handleSelectChange('quietStart', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">End Time</Label>
                    <Select value={settings.quietEnd} onValueChange={(value) => handleSelectChange('quietEnd', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={testNotification}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Bell className="h-4 w-4 mr-2" />
              Test Notification
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettings;