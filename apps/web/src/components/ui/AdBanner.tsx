import { cn } from '@omnipdf/shared/src/utils';

interface AdBannerProps {
  slotId: string;
  format?: 'horizontal' | 'rectangle' | 'leaderboard';
  className?: string;
}

export function AdBanner({ slotId, format = 'horizontal', className }: AdBannerProps) {
  const formatDimensions = {
    horizontal: 'h-32 w-full',
    rectangle: 'h-64 w-full max-w-md mx-auto',
    leaderboard: 'h-24 w-full',
  };

  return (
    <div className={cn('relative bg-surface-100 dark:bg-surface-800 rounded-lg overflow-hidden', formatDimensions[format], className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm text-surface-500">Advertisement</p>
      </div>
      {/* Google AdSense placeholder - Replace with actual AdSense code */}
      <div
        id={slotId}
        className="w-full h-full"
        data-ad-format={format}
        data-ad-slot={slotId}
      />
    </div>
  );
}
