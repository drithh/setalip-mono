import { cn } from '#dep/lib/utils';
import React from 'react';

export interface AddonInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}
const AddonInput = React.forwardRef<HTMLInputElement, AddonInputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div className="flex flex-col rounded focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
        <div
          className={cn(
            'flex items-center h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        >
          {startAdornment && (
            <span className="px-3 text-sm text-muted-foreground">
              {startAdornment}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'hide-arrows flex-1 px-3 py-2 bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-none disabled:opacity-50'
            )}
            ref={ref}
            {...props}
          />
          {endAdornment && (
            <span className="px-3 text-sm text-muted-foreground">
              {endAdornment}
            </span>
          )}
        </div>

        <style>{`
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .hide-arrows {
            -moz-appearance: textfield; /* Firefox */
        }
				`}</style>
      </div>
    );
  }
);

AddonInput.displayName = 'AddonInput';

export { AddonInput };
