import { Loader2 } from 'lucide-react';

export default function Component() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center bg-background">
      <Loader2 className={'my-2 h-16 w-16 animate-spin text-foreground/60'} />
      <p className="mt-4 text-2xl font-semibold text-foreground/60">
        Loading...
      </p>
    </div>
  );
}
