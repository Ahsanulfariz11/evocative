import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center border-4 border-black m-4">
          <div className="bg-black text-white px-4 py-1 mb-4 font-mono text-[10px] uppercase tracking-widest">
            // System Error [500]
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">
            Circuit Overload
          </h1>
          <p className="text-sm font-mono text-neutral-500 mb-8 max-w-xs uppercase tracking-widest">
            Ekstraksi database gagal. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-8 py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-black"
          >
            Reboot System
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-neutral-100 text-[10px] font-mono text-left overflow-auto max-w-full">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
