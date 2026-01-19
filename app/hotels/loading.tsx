import { CardGridSkeleton, TableSkeleton } from '@/components/ui/Skeleton';

export default function HotelsLoading() {
    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-9 w-28 bg-slate-200 rounded animate-pulse" />
            </div>

            {/* Table */}
            <TableSkeleton rows={5} cols={7} />
        </div>
    );
}
