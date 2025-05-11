"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <details className="text-sm text-red-700 whitespace-pre-wrap">
              <summary>Show error details</summary>
              <p className="mt-2">{this.state.error?.toString()}</p>
              <p className="mt-2">{this.state.error?.stack}</p>
            </details>
          </div>
        )
      )
    }

    return this.props.children
  }
}
