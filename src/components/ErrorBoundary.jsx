import { Component } from "react";

// ErrorBoundary must be a CLASS component — React requires this
// It catches any errors that happen inside child components
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  // Called when a child component throws an error
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  // Called after an error is caught — good for logging
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
            {/* Error icon */}
            <div className="text-6xl mb-4">😕</div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              {this.state.errorMessage || "An unexpected error occurred."}
            </p>

            {/* Retry button — reloads the page */}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // No error — render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;