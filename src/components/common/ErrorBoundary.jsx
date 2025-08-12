import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // This would typically send to a service like Sentry, LogRocket, etc.
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Store in localStorage as fallback
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(errorData);
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.shift();
      }
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  };

  handleRetry = async () => {
    this.setState({ isRetrying: true });
    
    // Wait a bit to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, isRetrying } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-lg"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center"
                >
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </motion.div>
                
                <CardTitle className="text-white text-xl font-bold">
                  Oops! Something went wrong
                </CardTitle>
                
                <CardDescription className="text-white/80 mt-2">
                  We encountered an unexpected error. Don't worry, we're on it!
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {isDevelopment && error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm font-medium">
                        Error Details
                      </span>
                    </div>
                    
                    <div className="text-xs text-white/70 font-mono bg-black/20 rounded p-2 max-h-32 overflow-y-auto">
                      <div className="mb-2">
                        <strong>Message:</strong> {error.message}
                      </div>
                      {errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap text-xs mt-1">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="text-white/60 text-sm text-center">
                  You can try refreshing the page or go back to the home screen.
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={this.handleRetry}
                    disabled={isRetrying}
                    className="flex-1 bg-white/20 hover:bg-white/30 border-white/30 text-white"
                    variant="outline"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    className="flex-1 bg-blue-500/80 hover:bg-blue-500 text-white"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>

                <Button
                  onClick={this.handleReload}
                  variant="ghost"
                  className="w-full text-white/60 hover:text-white hover:bg-white/10"
                >
                  Reload Page
                </Button>
              </CardFooter>
            </Card>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-4 text-white/50 text-xs"
            >
              Error ID: {Date.now().toString(36)}
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for functional components
export const withErrorBoundary = (Component, fallback) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

export default ErrorBoundary;