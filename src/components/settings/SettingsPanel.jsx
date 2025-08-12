import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download, 
  Upload,
  Trash2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Settings as SettingsIcon,
  ChevronRight,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

const SettingsPanel = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: true,
    sounds: true,
    soundVolume: 50,
    autoSave: true,
    compactMode: false,
    showCompleted: true,
    defaultPriority: 'medium',
    language: 'en',
    dateFormat: 'dd/mm/yyyy'
  });

  const [activeSection, setActiveSection] = useState('general');

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportData = () => {
    const data = JSON.stringify(localStorage.getItem('todos') || '[]');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          localStorage.setItem('todos', JSON.stringify(data));
          window.location.reload();
        } catch (error) {
          console.error('Invalid backup file');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const settingSections = [
    {
      id: 'general',
      title: 'General',
      icon: SettingsIcon,
      items: [
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor }
          ]
        },
        {
          key: 'language',
          label: 'Language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' }
          ]
        },
        {
          key: 'compactMode',
          label: 'Compact Mode',
          type: 'switch',
          description: 'Show more items in less space'
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
          label: 'Enable Notifications',
          type: 'switch',
          description: 'Get notified about due tasks'
        },
        {
          key: 'sounds',
          label: 'Sound Effects',
          type: 'switch',
          description: 'Play sounds for interactions'
        },
        {
          key: 'soundVolume',
          label: 'Sound Volume',
          type: 'slider',
          min: 0,
          max: 100,
          disabled: !settings.sounds
        }
      ]
    },
    {
      id: 'tasks',
      title: 'Tasks',
      icon: User,
      items: [
        {
          key: 'autoSave',
          label: 'Auto Save',
          type: 'switch',
          description: 'Automatically save changes'
        },
        {
          key: 'showCompleted',
          label: 'Show Completed',
          type: 'switch',
          description: 'Display completed tasks'
        },
        {
          key: 'defaultPriority',
          label: 'Default Priority',
          type: 'select',
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]
        }
      ]
    }
  ];

  const renderSettingItem = (item) => {
    switch (item.type) {
      case 'switch':
        return (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-white/90">{item.label}</div>
              {item.description && (
                <div className="text-sm text-white/60">{item.description}</div>
              )}
            </div>
            <Switch
              checked={settings[item.key]}
              onCheckedChange={(value) => updateSetting(item.key, value)}
              disabled={item.disabled}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <label className="font-medium text-white/90">{item.label}</label>
            <Select value={settings[item.key]} onValueChange={(value) => updateSetting(item.key, value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {item.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon && <option.icon className="h-4 w-4" />}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-white/90">{item.label}</label>
              <Badge variant="secondary">{settings[item.key]}%</Badge>
            </div>
            <Slider
              value={[settings[item.key]]}
              onValueChange={(value) => updateSetting(item.key, value[0])}
              min={item.min}
              max={item.max}
              step={1}
              disabled={item.disabled}
              className="w-full"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl border-l border-white/20 z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                  {settingSections.map((section) => (
                    <div key={section.id} className="space-y-4">
                      <div className="flex items-center gap-2 text-white/90">
                        <section.icon className="h-5 w-5" />
                        <h3 className="font-medium">{section.title}</h3>
                      </div>
                      
                      <div className="space-y-4 pl-7">
                        {section.items.map((item) => (
                          <div key={item.key}>
                            {renderSettingItem(item)}
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="bg-white/20" />
                    </div>
                  ))}

                  <div className="space-y-4">
                    <h3 className="font-medium text-white/90 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Data Management
                    </h3>
                    
                    <div className="space-y-3 pl-7">
                      <Button
                        onClick={exportData}
                        variant="outline"
                        className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importData}
                          className="hidden"
                          id="import-file"
                        />
                        <Button
                          onClick={() => document.getElementById('import-file').click()}
                          variant="outline"
                          className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Import Data
                        </Button>
                      </div>
                      
                      <Button
                        onClick={clearAllData}
                        variant="outline"
                        className="w-full justify-start bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/20">
                <div className="text-center text-white/60 text-sm">
                  Glassmorphic Todo App v1.0.0
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;