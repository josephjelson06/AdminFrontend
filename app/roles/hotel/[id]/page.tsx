'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Building2,
    Users,
    Check,
    X,
    Info,
    Loader2,
    LayoutDashboard,
    ClipboardList,
    BedDouble,
    Monitor,
    Settings,
    UserCog,
    CreditCard,
    HelpCircle,
} from 'lucide-react';
import { getHotelRoleById, HOTEL_PAGES, HotelRoleDefinition, HotelPageAccess } from '@/lib/rbac-data';
import { useToast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

// Icon mapping for pages
const PAGE_ICONS: Record<string, React.ElementType> = {
    dashboard: LayoutDashboard,
    guests: ClipboardList,
    rooms: BedDouble,
    kiosk: Monitor,
    settings: Settings,
    team: UserCog,
    billing: CreditCard,
    help: HelpCircle,
};

// Color mapping
const ROLE_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
        gradient: 'from-indigo-500 to-indigo-600',
    },
    blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        gradient: 'from-blue-500 to-blue-600',
    },
    amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        gradient: 'from-amber-500 to-amber-600',
    },
    emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        gradient: 'from-emerald-500 to-emerald-600',
    },
};

export default function EditHotelRolePage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();

    const [role, setRole] = useState<HotelRoleDefinition | null>(null);
    const [pageAccess, setPageAccess] = useState<HotelPageAccess[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const roleId = params.id as string;
        const foundRole = getHotelRoleById(roleId);
        if (foundRole) {
            setRole(foundRole);
            setPageAccess([...foundRole.pageAccess]);
        }
    }, [params.id]);

    if (!role) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const colors = ROLE_COLORS[role.color] || ROLE_COLORS.indigo;
    const enabledCount = pageAccess.filter(p => p.enabled).length;

    const togglePage = (pageId: string) => {
        setPageAccess(prev => prev.map(p =>
            p.id === pageId ? { ...p, enabled: !p.enabled } : p
        ));
        setHasChanges(true);
    };

    const enableAll = () => {
        setPageAccess(prev => prev.map(p => ({ ...p, enabled: true })));
        setHasChanges(true);
    };

    const disableAll = () => {
        setPageAccess(prev => prev.map(p => ({ ...p, enabled: false })));
        setHasChanges(true);
    };

    const handleSave = () => {
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowConfirm(false);
        setHasChanges(false);
        addToast('success', 'Role Updated', `${role.name} page access has been saved.`);
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
                href="/roles"
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Roles
            </Link>

            {/* Role Header Card */}
            <div className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 text-white mb-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Building2 className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{role.name}</h1>
                            <p className="text-white/80">{role.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">{role.userCount} users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Access Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Section Header */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Page Access
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Select which Hotel Panel pages this role can access ({enabledCount}/{HOTEL_PAGES.length} enabled)
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={enableAll}
                                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Enable All
                            </button>
                            <button
                                onClick={disableAll}
                                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Disable All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {pageAccess.map((page) => {
                        const Icon = PAGE_ICONS[page.id] || LayoutDashboard;

                        return (
                            <div
                                key={page.id}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${page.enabled ? colors.bg : 'bg-slate-100 dark:bg-slate-700'}`}>
                                        <Icon className={`w-5 h-5 ${page.enabled ? colors.text : 'text-slate-400 dark:text-slate-500'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">{page.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{page.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => togglePage(page.id)}
                                    className={`relative w-12 h-7 rounded-full transition-all ${page.enabled
                                            ? 'bg-indigo-600'
                                            : 'bg-slate-200 dark:bg-slate-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${page.enabled ? 'left-6' : 'left-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info Banner */}
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Changes Apply Globally
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        Page access changes for this role will affect all {role.userCount} users across all hotels using the {role.name} role.
                    </p>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/roles"
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Save Confirmation */}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmSave}
                title="Save Page Access"
                message={`This will update page access for all ${role.userCount} users with the ${role.name} role. Are you sure?`}
                confirmLabel="Save Changes"
                variant="default"
            />
        </div>
    );
}
