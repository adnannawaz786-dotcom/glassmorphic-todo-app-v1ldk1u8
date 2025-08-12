import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Droplets, 
  Sparkles,
  Check,
  Brush,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

const ThemeSettings = () => {
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [glassIntensity, setGlassIntensity] = useState(70);
  const [blurStrength, setBlurStrength] = useState(12);
  const [colorScheme, setColorScheme] = useState('blue');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Clean and bright' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Follows device' }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500', accent: 'from-blue-400 to-cyan-400' },
    { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500', accent: 'from-purple-400 to-pink-400' },
    { id: 'green', name: 'Forest Green', color: 'bg-green-500', accent: 'from-green-400 to-emerald-400' },
    { id: 'orange', name: 'Sunset Orange', color: 'bg-orange-500', accent: 'from-orange-400 to-red-400' },
    { id: 'pink', name: 'Cherry Blossom', color: 'bg-pink-500', accent: 'from-pink-400 to-rose-400' },
    { id: 'teal', name: 'Tropical Teal', color: 'bg-teal-500', accent: 'from-teal-400 to-cyan-400' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    // Apply theme logic here
    document.documentElement.setAttribute('data-theme', themeId);
  };

  const handleColorSchemeChange = (schemeId) => {
    setColorScheme(schemeId);
    // Apply color scheme logic here
    document.documentElement.setAttribute('data-color-scheme', schemeId);
  };

  const handleGlassIntensityChange = (value) => {
    setGlassIntensity(value[0]);
    document.documentElement.style.setProperty('--glass-opacity', value[0] / 100);
  };

  const handleBlurStrengthChange = (value) => {
    setBlurStrength(value[0]);
    document.documentElement.style.setProperty('--blur-strength', `${value[0]}px`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Theme Mode Selection */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Theme Mode</h3>
              <p className="text-sm text-gray-300">Choose your preferred appearance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((theme) => (
              <motion.div
                key={theme.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedTheme === theme.id ? "default" : "outline"}
                  className={`w-full p-4 h-auto flex flex-col gap-2 relative ${
                    selectedTheme === theme.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent' 
                      : 'glass-card border-white/20 text-white hover:bg-white/10'
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <theme.icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">{theme.label}</div>
                    <div className="text-xs opacity-70">{theme.description}</div>
                  </div>
                  {selectedTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Color Schemes */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500">
              <Brush className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Color Scheme</h3>
              <p className="text-sm text-gray-300">Customize your accent colors</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {colorSchemes.map((scheme) => (
              <motion.div
                key={scheme.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-xl cursor-pointer border-2 transition-all ${
                  colorScheme === scheme.id 
                    ? 'border-white/40 bg-white/10' 
                    : 'border-white/20 hover:border-white/30'
                }`}
                onClick={() => handleColorSchemeChange(scheme.id)}
              >
                <div className={`w-full h-12 rounded-lg bg-gradient-to-r ${scheme.accent} mb-2`} />
                <div className="text-sm font-medium text-white text-center">
                  {scheme.name}
                </div>
                {colorScheme === scheme.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                  >
                    <Check className="w-3 h-3 text-green-600" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Glass Effects */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Glass Effects</h3>
              <p className="text-sm text-gray-300">Adjust glassmorphism intensity</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-white">Glass Intensity</Label>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {glassIntensity}%
                </Badge>
              </div>
              <Slider
                value={[glassIntensity]}
                onValueChange={handleGlassIntensityChange}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-white">Blur Strength</Label>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {blurStrength}px
                </Badge>
              </div>
              <Slider
                value={[blurStrength]}
                onValueChange={handleBlurStrengthChange}
                max={24}
                min={4}
                step={2}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Animation Settings */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Animations</h3>
              <p className="text-sm text-gray-300">Control motion and transitions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Enable Animations</Label>
                <p className="text-sm text-gray-300">Turn on smooth transitions</p>
              </div>
              <Switch
                checked={animationsEnabled}
                onCheckedChange={setAnimationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Reduced Motion</Label>
                <p className="text-sm text-gray-300">Minimize motion effects</p>
              </div>
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preview Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-teal-600">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <p className="text-sm text-gray-300">See your theme in action</p>
            </div>
          </div>

          <div className="p-4 rounded-lg glass-card border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorSchemes.find(s => s.id === colorScheme)?.accent}`} />
              <div>
                <div className="text-white font-medium">Sample Todo Item</div>
                <div className="text-gray-300 text-sm">This is how your todos will look</div>
              </div>
            </div>
            <Button 
              size="sm" 
              className={`bg-gradient-to-r ${colorSchemes.find(s => s.id === colorScheme)?.accent} text-white`}
            >
              Complete Task
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSettings;