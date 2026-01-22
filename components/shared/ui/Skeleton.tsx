export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
    );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4">
                <div className="flex gap-4">
                    {Array.from({ length: cols }).map((_, i) => (
                        <Skeleton key={i} className="h-4 flex-1" />
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <div key={rowIdx} className="p-4 flex gap-4">
                        {Array.from({ length: cols }).map((_, colIdx) => (
                            <Skeleton key={colIdx} className="h-4 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

export function DetailPageSkeleton() {
    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Title Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div>
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded" />
                        <Skeleton className="h-6 w-20 rounded" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-6 w-12" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            <TableSkeleton rows={3} cols={5} />
        </div>
    );
}
