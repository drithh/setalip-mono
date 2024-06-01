'use client';
import { Button } from '@repo/ui/components/ui/button';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

interface QueryResetBoundaryProps {
  children: React.ReactNode;
}

export default function QueryResetBoundary({
  children,
}: QueryResetBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div className="flex flex-col gap-2">
              There was an error!
              <Button className="w-24" onClick={() => resetErrorBoundary()}>
                Try again
              </Button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
