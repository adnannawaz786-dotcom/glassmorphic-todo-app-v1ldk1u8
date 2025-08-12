import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Globe,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: true,
    soundEnabled: true,
    autoSync: true,
    language: 'en',
    dateFormat: 'dd/mm/yyyy',
    defaultView: 'all',
    autoComplete: true,
    compactMode: false,
    glassOpacity: 80
  });

  const [activeSection, setActiveSection] = useState('general');

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingSections = [
    {
      id: 'general',
      title: 'General',
      icon: Settings,
      items: [
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' }
          ]
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Select your language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' }
          ]
        },
        {
          key: 'dateFormat',
          label: 'Date Format',
          description: 'Choose date display format',
          type: 'select',
          options: [
            { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
            { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
            { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' }
          ]
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          key: 'compactMode',
          label: 'Compact Mode',
          description: 'Use smaller spacing and elements',
          type: 'switch'
        },
        {
          key: 'glassOpacity',
          label: 'Glass Opacity',
          description: 'Adjust glassmorphism transparency',
          type: 'slider',
          min: 20,
          max: 100,
          step: 10
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          key: 'notifications',
          label: 'Push Notifications',
          description: 'Receive task reminders and updates',
          type: 'switch'
        },
        {
          key: 'soundEnabled',
          label: 'Sound Effects',
          description: 'Play sounds for actions',
          type: 'switch'
        }
      ]
    },
    {
      id: 'tasks',
      title: 'Tasks',
      icon: Database,
      items: [
        {
          key: 'autoSync',
          label: 'Auto Sync',
          description: 'Automatically sync tasks across devices',
          type: 'switch'
        },
        {
          key: 'autoComplete',
          label: 'Auto Complete Suggestions',
          description: 'Show task completion suggestions',
          type: 'switch'
        },
        {
          key: 'defaultView',
          label: 'Default View',
          description: 'Choose default task view',
          type: 'select',
          options: [
            { value: 'all', label: 'All Tasks' },
            { value: 'today', label: 'Today' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' }
          ]
        }
      ]
    }
  ];

  const renderSettingItem = (item) => {
    switch (item.type) {
      case 'switch':
        return (
          <Switch
            checked={settings[item.key]}
            onCheckedChange={(checked) => updateSetting(item.key, checked)}
          />
        );
      case 'select':
        return (
          <Select value={settings[item.key]} onValueChange={(value) => updateSetting(item.key, value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {item.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'slider':
        return (
          <div className="flex items-center space-x-3 w-32">
            <Slider
              value={[settings[item.key]]}
              onValueChange={([value]) => updateSetting(item.key, value)}
              min={item.min}
              max={item.max}
              step={item.step}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8">
              {settings[item.key]}%
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-2xl">Settings</CardTitle>
                <CardDescription className="text-white/70">
                  Customize your todo app experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <section.icon className="h-5 w-5 text-white" />
                  <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-white/60 text-sm">{item.description}</div>
                      </div>
                      <div className="ml-4">
                        {renderSettingItem(item)}
                      </div>
                    </div>
                    {index < section.items.length - 1 && (
                      <Separator className="mt-4 bg-white/10" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Data Management */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center space-x-3">
              <Database className="h-5 w-5" />
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Export Tasks
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              Import Tasks
            </Button>
            <Button variant="destructive" className="w-full justify-start bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-white font-semibold">Glassmorphic Todo</div>
              <div className="text-white/60 text-sm">Version 1.0.0</div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Premium
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;