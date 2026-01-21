export function TinySparkline({ data, color = "stroke-emerald-500" }: { data: number[], color?: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 30 - ((val - min) / (max - min)) * 30;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg viewBox="0 0 100 30" className="w-24 h-8 overflow-visible">
            <polyline fill="none" strokeWidth="2" points={points} className={color} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
