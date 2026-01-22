/**
 * Export data as CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; label: string }[]
): void {
    if (data.length === 0) return;

    // Determine columns from first item if not provided
    const cols = columns || Object.keys(data[0]).map((key) => ({
        key: key as keyof T,
        label: String(key),
    }));

    // Build header row
    const header = cols.map((col) => `"${col.label}"`).join(',');

    // Build data rows
    const rows = data.map((item) =>
        cols
            .map((col) => {
                const value = item[col.key];
                // Handle different types
                if (value === null || value === undefined) return '""';
                if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
                if (typeof value === 'number') return String(value);
                if (value instanceof Date) return `"${value.toISOString()}"`;
                return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(',')
    );

    // Combine and create blob
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Format currency for export (plain number)
 */
export function formatCurrencyForExport(amount: number): string {
    return amount.toString();
}
