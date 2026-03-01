import { CheckCircle, XCircle } from 'lucide-react';

export default function FeedbackCard({ title, items, type = 'list', icon }) {
  const Icon = icon;

  const colorMap = {
    success: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-200 dark:border-green-800', iconColor: 'text-green-600 dark:text-green-400', headerBg: 'bg-green-100 dark:bg-green-900' },
    warning: { bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-200 dark:border-yellow-800', iconColor: 'text-yellow-600 dark:text-yellow-400', headerBg: 'bg-yellow-100 dark:bg-yellow-900' },
    error: { bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800', iconColor: 'text-red-600 dark:text-red-400', headerBg: 'bg-red-100 dark:bg-red-900' },
    info: { bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'border-indigo-200 dark:border-indigo-800', iconColor: 'text-indigo-600 dark:text-indigo-400', headerBg: 'bg-indigo-100 dark:bg-indigo-900' },
  };

  const colors = colorMap[type] || colorMap.info;

  return (
    <div className={`rounded-2xl border ${colors.border} overflow-hidden`}>
      <div className={`${colors.headerBg} px-5 py-3 flex items-center gap-2`}>
        {Icon && <Icon className={`w-5 h-5 ${colors.iconColor}`} />}
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        {items && (
          <span className={`ml-auto text-sm font-medium ${colors.iconColor}`}>
            {items.length} items
          </span>
        )}
      </div>
      <div className={`${colors.bg} p-5`}>
        {items && items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                {type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                ) : type === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                    type === 'warning' ? 'bg-yellow-500' : 'bg-indigo-500'
                  }`} />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No items to display.</p>
        )}
      </div>
    </div>
  );
}
