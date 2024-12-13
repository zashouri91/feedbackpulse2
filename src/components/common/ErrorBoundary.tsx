import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ErrorLogger } from './ErrorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <>
          <ErrorLogger 
            error={this.state.error!}
            componentStack={this.state.errorInfo?.componentStack}
          />
          
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <h1 className="mt-4 text-xl font-semibold text-gray-900">
                Something went wrong
              </h1>
              <p className="mt-2 text-gray-600">
                We apologize for the inconvenience. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}