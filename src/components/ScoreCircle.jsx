export default function ScoreCircle({ score, size = 120, label }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return { stroke: '#22c55e', bg: '#f0fdf4', text: '#15803d' };
    if (s >= 60) return { stroke: '#eab308', bg: '#fefce8', text: '#a16207' };
    if (s >= 40) return { stroke: '#f97316', bg: '#fff7ed', text: '#c2410c' };
    return { stroke: '#ef4444', bg: '#fef2f2', text: '#dc2626' };
  };

  const colors = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: colors.text }}>
            {score}
          </span>
        </div>
      </div>
      {label && <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>}
    </div>
  );
}
