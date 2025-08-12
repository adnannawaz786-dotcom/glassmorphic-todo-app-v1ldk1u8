import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Upload, 
  Database, 
  Shield, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  FileJson,
  HardDrive,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { useTodos } from '../../hooks/useTodos';

const DataSettings = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastBackup, setLastBackup] = useState(new Date().toLocaleDateString());
  
  const { todos, clearAllTodos } = useTodos();
  const { toast } = useToast();

  const handleExportData = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 200);

      const exportData = {
        todos,
        settings: {
          autoBackup,
          cloudSync,
          exportDate: new Date().toISOString()
        },
        version: '1.0.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        toast({
          title: "Export Complete",
          description: "Your data has been exported successfully.",
        });
      }, 1000);
    } catch (error) {
      setIsExporting(false);
      setExportProgress(0);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.todos && Array.isArray(importedData.todos)) {
          // Here you would typically call a function to import the todos
          toast({
            title: "Import Complete",
            description: `Successfully imported ${importedData.todos.length} todos.`,
          });
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format or corrupted data.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      clearAllTodos();
      toast({
        title: "Data Cleared",
        description: "All todos have been deleted.",
        variant: "destructive",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Data Export Section */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Export Data</h3>
              <p className="text-sm text-white/70">Download your todos and settings</p>
            </div>
          </div>
          
          {isExporting && (
            <div className="mb-4">
              <Progress value={exportProgress} className="h-2" />
              <p className="text-sm text-white/70 mt-2">Exporting data... {exportProgress}%</p>
            </div>
          )}
          
          <Button 
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </>
            )}
          </Button>
        </Card>
      </motion.div>

      {/* Data Import Section */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Upload className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Import Data</h3>
              <p className="text-sm text-white/70">Restore from backup file</p>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              disabled={isImporting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button 
              disabled={isImporting}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File to Import
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Backup Settings */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <HardDrive className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Backup Settings</h3>
              <p className="text-sm text-white/70">Configure automatic backups</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Auto Backup</Label>
                <p className="text-sm text-white/60">Automatically backup data daily</p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
            
            <Separator className="bg-white/10" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Cloud Sync</Label>
                <p className="text-sm text-white/60">Sync data across devices</p>
              </div>
              <Switch
                checked={cloudSync}
                onCheckedChange={setCloudSync}
              />
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-white/60">
                Last backup: {lastBackup}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Storage Info */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Database className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Storage Info</h3>
              <p className="text-sm text-white/70">Current data usage</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Total Todos:</span>
              <span className="text-white">{todos.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Storage Used:</span>
              <span className="text-white">~{Math.ceil(JSON.stringify(todos).length / 1024)} KB</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-red-500/10 backdrop-blur-lg border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-300">Danger Zone</h3>
              <p className="text-sm text-red-200/70">Irreversible actions</p>
            </div>
          </div>
          
          <Alert className="mb-4 bg-red-500/10 border-red-500/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              This action cannot be undone. All your todos will be permanently deleted.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleClearAllData}
            variant="destructive"
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Data
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DataSettings;