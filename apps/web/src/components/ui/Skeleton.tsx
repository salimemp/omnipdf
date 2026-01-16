import { cn } from '@omnipdf/shared/src/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-surface-200 dark:bg-surface-700',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} className="mt-2" />
        </div>
      </div>
      <Skeleton width="100%" height={100} className="mt-4" />
      <div className="flex gap-2 mt-4">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-surface-100 dark:border-surface-700">
      <Skeleton variant="rectangular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton width="70%" height={16} />
      </div>
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <Skeleton key={i} width={80} height={16} />
      ))}
    </div>
  );
}

export function ConversionCardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="80%" height={18} />
          <Skeleton width="50%" height={14} className="mt-2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton width="100%" height={8} />
        <Skeleton width="80%" height={8} />
      </div>
      <Skeleton width={100} height={36} className="mt-4" />
    </div>
  );
}
