'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** Custom fallback render. Receives the caught error. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  children: ReactNode;
  /** Fired when an error is caught. Useful for logging / telemetry. */
  onError?: (error: Error, info: { componentStack: string }) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — class component (React requires class for
 * componentDidCatch / getDerivedStateFromError). Wrap any subtree
 * to convert an uncaught render error into a recovery UI.
 *
 * Usage:
 *   <ErrorBoundary fallback={<SomeOther />}>
 *     <RiskyTree />
 *   </ErrorBoundary>
 *
 * The boundary does NOT replace the page-level app/error.tsx (which
 * Next.js uses for route-level failures). It catches errors that
 * happen during a child component's render or commit phase only.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(
    error: Error,
    info: { componentStack: string }
  ): void {
    // eslint-disable-next-line no-console
    console.error('[Nimbus] ErrorBoundary caught:', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  private readonly reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    const { error } = this.state;
    const { fallback } = this.props;

    if (typeof fallback === 'function') {
      return fallback(error!, this.reset);
    }
    if (fallback) return fallback;

    return (
      <div
        role="alert"
        className="p-6 max-w-md mx-auto text-center bg-card border border-border/40 rounded-lg"
      >
        <h2 className="text-lg font-semibold mb-2">Bir şeyler ters gitti</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message ?? 'Bilinmeyen hata'}
        </p>
        <button
          type="button"
          onClick={this.reset}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600
            hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity"
        >
          Tekrar dene
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
