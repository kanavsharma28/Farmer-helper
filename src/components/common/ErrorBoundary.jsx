import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-error-container/40 text-error flex items-center justify-center mx-auto ring-8 ring-error-container/20">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <div className="space-y-1.5">
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Something went wrong
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {this.state.error?.message || 'An unexpected rendering error occurred. Please try again.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-container transition-all shadow-xs cursor-pointer"
              >
                Try Again
              </button>
              <a
                href="/dashboard"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-surface-container text-on-surface font-medium text-xs sm:text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
