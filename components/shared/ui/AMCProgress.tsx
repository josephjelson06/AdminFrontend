interface AMCProgressProps {
    startDate: string;
    endDate: string;
    label?: string;
}

export function AMCProgress({ startDate, endDate, label = 'Contract' }: AMCProgressProps) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();

    const total = end - start;
    const elapsed = now - start;
    const remaining = end - now;

    // Calculate percentage (clamped 0-100)
    const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100));

    // Days remaining
    const daysRemaining = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));

    // Determine color based on remaining time
    const getColor = () => {
        if (daysRemaining <= 15) return { bar: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-100' };
        if (daysRemaining <= 30) return { bar: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-100' };
        return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-100' };
    };

    const color = getColor();

    // Format end date
    const formattedEnd = new Date(endDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{label}</span>
                <span className={`font-medium ${color.text}`}>
                    {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                </span>
            </div>
            <div className={`h-2 rounded-full ${color.bg} overflow-hidden`}>
                <div
                    className={`h-full ${color.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="text-xs text-slate-400 text-right">
                Renews: {formattedEnd}
            </div>
        </div>
    );
}

interface AMCBadgeProps {
    daysRemaining: number;
}

export function AMCBadge({ daysRemaining }: AMCBadgeProps) {
    if (daysRemaining <= 0) {
        return (
            <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 rounded">
                Expired
            </span>
        );
    }
    if (daysRemaining <= 15) {
        return (
            <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 rounded">
                {daysRemaining}d left
            </span>
        );
    }
    if (daysRemaining <= 30) {
        return (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                {daysRemaining}d left
            </span>
        );
    }
    return (
        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
            {daysRemaining}d left
        </span>
    );
}
