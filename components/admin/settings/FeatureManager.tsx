'use client';

import { useState } from 'react';
import { ToggleLeft, ToggleRight, Zap, Beaker, AlertTriangle } from 'lucide-react';
import { FEATURE_FLAGS, type FeatureFlag } from '@/lib/admin/system-data';
import { useToast } from '@/components/shared/ui/Toast';

export function FeatureManager() {
    const { addToast } = useToast();
    const [flags, setFlags] = useState(FEATURE_FLAGS);

    const toggleFlag = (id: string) => {
        setFlags(prev => prev.map(flag => {
            if (flag.id === id) {
                const newStatus = flag.status === 'inactive' ? 'active' : 'inactive';
                addToast(
                    newStatus === 'active' ? 'success' : 'info',
                    `Feature ${newStatus === 'active' ? 'Enabled' : 'Disabled'}`,
                    `${flag.name} is now ${newStatus}.`
                );
                return { ...flag, status: newStatus };
            }
            return flag;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Feature Flag Warning</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        Toggling features here affects the production environment immediately.
                        Ensure beta features are tested in staging first.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {flags.map((flag) => (
                    <div
                        key={flag.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${flag.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                                    flag.status === 'beta' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                        'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                }`}>
                                {flag.status === 'beta' ? <Beaker className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{flag.name}</h4>
                                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                        {flag.key}
                                    </span>
                                    {flag.status === 'beta' && (
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded uppercase">Beta</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                                    {flag.description}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                    <span className="font-medium text-slate-600 dark:text-slate-300">Rollout: {flag.rolloutPercentage}%</span>
                                    <span>•</span>
                                    <span>Target: Global</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleFlag(flag.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flag.status !== 'inactive' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flag.status !== 'inactive' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
