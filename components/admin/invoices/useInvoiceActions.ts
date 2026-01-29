'use client';

/**
 * useInvoiceActions Hook
 * 
 * Manages invoice actions and modal states.
 */

import { useState, useCallback } from 'react';
import { invoiceService } from '@/lib/services/invoiceService';
import { useToast } from '@/components/shared/ui/Toast';
import type { Invoice } from '@/types/finance';

export interface UseInvoiceActionsReturn {
    // Selected invoice
    selectedInvoice: Invoice | null;
    setSelectedInvoice: (invoice: Invoice | null) => void;

    // Modal states
    showNewModal: boolean;
    showDetailSlideOver: boolean;

    // Modal openers
    openNewModal: () => void;
    openDetailSlideOver: (invoice: Invoice) => void;
    closeAllModals: () => void;

    // Actions
    markAsPaid: (invoice: Invoice) => Promise<void>;
    sendReminder: (invoice: Invoice) => Promise<void>;
    createInvoice: (data: Partial<Invoice>) => Promise<void>;
    downloadPdf: (invoice: Invoice) => void;
    exportData: (format: 'pdf' | 'excel') => void;
}

export function useInvoiceActions(onSuccess?: () => void): UseInvoiceActionsReturn {
    const { addToast } = useToast();

    // Selected invoice
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Modal states
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailSlideOver, setShowDetailSlideOver] = useState(false);

    // Modal openers
    const openNewModal = useCallback(() => setShowNewModal(true), []);

    const openDetailSlideOver = useCallback((invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailSlideOver(true);
    }, []);

    const closeAllModals = useCallback(() => {
        setShowNewModal(false);
        setShowDetailSlideOver(false);
        setSelectedInvoice(null);
    }, []);

    // Mark as paid
    const markAsPaid = useCallback(async (invoice: Invoice) => {
        const response = await invoiceService.markAsPaid(invoice.id);
        if (response.success) {
            addToast('success', 'Payment Recorded', `Invoice ${invoice.invoiceNumber} marked as paid.`);
            onSuccess?.();
        } else {
            addToast('error', 'Error', response.error || 'Failed to update invoice');
        }
    }, [addToast, onSuccess]);

    // Send reminder
    const sendReminder = useCallback(async (invoice: Invoice) => {
        const response = await invoiceService.sendReminder(invoice.id);
        if (response.success) {
            addToast('info', 'Reminder Sent', `Payment reminder sent for ${invoice.invoiceNumber}.`);
        } else {
            addToast('error', 'Error', response.error || 'Failed to send reminder');
        }
    }, [addToast]);

    // Create invoice
    const createInvoice = useCallback(async (data: Partial<Invoice>) => {
        const response = await invoiceService.create(data);
        if (response.success) {
            addToast('success', 'Invoice Created', `New invoice created for ${data.hotelName}.`);
            closeAllModals();
            onSuccess?.();
        } else {
            addToast('error', 'Error', response.error || 'Failed to create invoice');
        }
    }, [addToast, closeAllModals, onSuccess]);

    // Download PDF
    const downloadPdf = useCallback((invoice: Invoice) => {
        addToast('info', 'Downloading...', `Downloading ${invoice.invoiceNumber}.pdf`);
    }, [addToast]);

    // Export data
    const exportData = useCallback((format: 'pdf' | 'excel') => {
        addToast('info', 'Exporting...', `Generating ${format.toUpperCase()} export...`);
    }, [addToast]);

    return {
        selectedInvoice,
        setSelectedInvoice,
        showNewModal,
        showDetailSlideOver,
        openNewModal,
        openDetailSlideOver,
        closeAllModals,
        markAsPaid,
        sendReminder,
        createInvoice,
        downloadPdf,
        exportData,
    };
}
