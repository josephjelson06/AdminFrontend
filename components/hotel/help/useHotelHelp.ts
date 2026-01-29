'use client';

/**
 * useHotelHelp Hook
 * 
 * Manages help page state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    hotelHelpService,
    type FAQItem,
    type SupportTicket,
} from '@/lib/services/hotelHelpService';

export interface UseHotelHelpReturn {
    // Data
    faqs: FAQItem[];
    tickets: SupportTicket[];

    // FAQ state
    openFaqIndex: number | null;
    setOpenFaqIndex: (index: number | null) => void;

    // Contact form
    showContactForm: boolean;
    setShowContactForm: (show: boolean) => void;
    contactSubject: string;
    setContactSubject: (subject: string) => void;
    contactMessage: string;
    setContactMessage: (message: string) => void;

    // Actions
    sendMessage: () => Promise<boolean>;

    // State
    isLoading: boolean;
    isSending: boolean;
}

export function useHotelHelp(): UseHotelHelpReturn {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await hotelHelpService.getHelpData();
                setFaqs(data.faqs);
                setTickets(data.tickets);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const sendMessage = useCallback(async (): Promise<boolean> => {
        if (!contactSubject.trim() || !contactMessage.trim()) {
            return false;
        }

        setIsSending(true);
        try {
            const result = await hotelHelpService.submitMessage(contactSubject, contactMessage);
            if (result.success) {
                setContactSubject('');
                setContactMessage('');
                setShowContactForm(false);
            }
            return result.success;
        } finally {
            setIsSending(false);
        }
    }, [contactSubject, contactMessage]);

    return {
        faqs,
        tickets,
        openFaqIndex,
        setOpenFaqIndex,
        showContactForm,
        setShowContactForm,
        contactSubject,
        setContactSubject,
        contactMessage,
        setContactMessage,
        sendMessage,
        isLoading,
        isSending,
    };
}
