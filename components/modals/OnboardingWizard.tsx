'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Building2, MapPin, CreditCard, Cpu } from 'lucide-react';
import { SelectDropdown } from '@/components/ui/Dropdown';
import { useToast } from '@/components/ui/Toast';

interface OnboardingWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (data: OnboardingData) => void;
}

interface OnboardingData {
    // Step 1: Basic Info
    hotelName: string;
    location: string;
    city: string;
    state: string;
    // Step 2: Contact
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    gstin: string;
    // Step 3: Plan
    plan: string;
    contractMonths: string;
    // Step 4: Kiosks
    kioskCount: string;
}

const INITIAL_DATA: OnboardingData = {
    hotelName: '',
    location: '',
    city: '',
    state: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    gstin: '',
    plan: 'standard',
    contractMonths: '12',
    kioskCount: '1',
};

const STEPS = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Contact', icon: MapPin },
    { id: 3, title: 'Plan', icon: CreditCard },
    { id: 4, title: 'Kiosks', icon: Cpu },
];

export function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        onComplete?.(formData);
        addToast('success', 'Hotel Onboarded!', `${formData.hotelName} has been successfully onboarded.`);
        setFormData(INITIAL_DATA);
        setCurrentStep(1);
        onClose();
    };

    const updateField = (field: keyof OnboardingData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Onboard New Hotel</h2>
                        <p className="text-sm text-slate-500">Step {currentStep} of {STEPS.length}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center gap-2 ${isActive ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                                        }`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-slate-900 text-white' :
                                                isCompleted ? 'bg-emerald-100 text-emerald-600' :
                                                    'bg-slate-200 text-slate-400'
                                            }`}>
                                            {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="px-6 py-6 min-h-[280px]">
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name *</label>
                                <input
                                    type="text"
                                    value={formData.hotelName}
                                    onChange={(e) => updateField('hotelName', e.target.value)}
                                    placeholder="e.g., Royal Orchid Bangalore"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    placeholder="Street address"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => updateField('city', e.target.value)}
                                        placeholder="e.g., Bangalore"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => updateField('state', e.target.value)}
                                        placeholder="e.g., Karnataka"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person *</label>
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => updateField('contactName', e.target.value)}
                                    placeholder="e.g., Rajesh Kumar"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => updateField('contactEmail', e.target.value)}
                                        placeholder="ops@hotel.com"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => updateField('contactPhone', e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label>
                                <input
                                    type="text"
                                    value={formData.gstin}
                                    onChange={(e) => updateField('gstin', e.target.value)}
                                    placeholder="22AAAAA0000A1Z5"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Plan</label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => updateField('plan', 'standard')}
                                        className={`p-4 border rounded-lg text-left transition-all ${formData.plan === 'standard'
                                                ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="font-semibold text-slate-900">Standard</div>
                                        <div className="text-sm text-slate-500 mt-1">Limited languages per kiosk</div>
                                        <div className="text-lg font-bold text-slate-900 mt-2">₹15,000/mo</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateField('plan', 'advanced')}
                                        className={`p-4 border rounded-lg text-left transition-all ${formData.plan === 'advanced'
                                                ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="font-semibold text-amber-600">Advanced</div>
                                        <div className="text-sm text-slate-500 mt-1">All regional languages</div>
                                        <div className="text-lg font-bold text-slate-900 mt-2">₹25,000/mo</div>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contract Duration</label>
                                <SelectDropdown
                                    value={formData.contractMonths}
                                    onChange={(value) => updateField('contractMonths', value)}
                                    options={[
                                        { value: '6', label: '6 months' },
                                        { value: '12', label: '12 months' },
                                        { value: '24', label: '24 months' },
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Number of Kiosks to Deploy</label>
                                <SelectDropdown
                                    value={formData.kioskCount}
                                    onChange={(value) => updateField('kioskCount', value)}
                                    options={[
                                        { value: '1', label: '1 Kiosk' },
                                        { value: '2', label: '2 Kiosks' },
                                        { value: '3', label: '3 Kiosks' },
                                        { value: '4', label: '4 Kiosks' },
                                        { value: '5', label: '5+ Kiosks' },
                                    ]}
                                />
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">Onboarding Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Hotel</span>
                                        <span className="font-medium text-slate-900">{formData.hotelName || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Location</span>
                                        <span className="font-medium text-slate-900">{formData.city ? `${formData.city}, ${formData.state}` : '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Plan</span>
                                        <span className="font-medium text-slate-900 capitalize">{formData.plan}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Kiosks</span>
                                        <span className="font-medium text-slate-900">{formData.kioskCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentStep === 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    {currentStep < STEPS.length ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            Complete Onboarding
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
