import { CardGridSkeleton, Skeleton } from '@/components/shared/ui/Skeleton';

export default function DashboardLoading() {
    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>

            {/* KPI Cards */}
            <CardGridSkeleton count={4} />

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-2 surface-glass-strong rounded-lg border border-glass p-4">
                    <Skeleton className="h-4 w-40 mb-4" />
                    <div className="flex items-end gap-3 h-36">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="flex-1 h-full" />
                        ))}
                    </div>
                </div>
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <Skeleton className="h-4 w-32 mb-4" />
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
