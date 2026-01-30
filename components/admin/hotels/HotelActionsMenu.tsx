'use client';

/**
 * HotelActionsMenu Component
 * 
 * Dropdown menu for hotel row actions.
 */

import {
    MoreHorizontal,
    Edit2,
    Trash2,
    ExternalLink,
    UserCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { Hotel } from '@/types/schema';

interface HotelActionsMenuProps {
    hotel: Hotel;
    onEdit: (hotel: Hotel) => void;
    onDelete: (hotel: Hotel) => void;
    onImpersonate: (hotel: Hotel) => void;
}

export function HotelActionsMenu({
    hotel,
    onEdit,
    onDelete,
    onImpersonate,
}: HotelActionsMenuProps) {
    const router = useRouter();

    return (
        <Dropdown
            trigger={
                <button className="p-2.5 rounded-xl surface-glass-soft hover:surface-glass-strong transition-all duration-200">
                    <MoreHorizontal className="w-4 h-4 text-muted" />
                </button>
            }
            align="right"
        >
            <DropdownItem onClick={() => onImpersonate(hotel)}>
                <UserCheck className="w-4 h-4 text-warning" />
                <span className="text-warning font-medium">Login as Admin</span>
            </DropdownItem>

            <div className="my-1.5 border-t border-glass" />

            <DropdownItem onClick={() => router.push(`/hotels/${hotel.id}`)}>
                <ExternalLink className="w-4 h-4" />
                View Details
            </DropdownItem>

            <DropdownItem onClick={() => onEdit(hotel)}>
                <Edit2 className="w-4 h-4" />
                Edit Hotel
            </DropdownItem>

            <div className="my-1.5 border-t border-glass" />

            <DropdownItem
                onClick={() => onDelete(hotel)}
                className="text-danger"
            >
                <Trash2 className="w-4 h-4" />
                Delete Hotel
            </DropdownItem>
        </Dropdown>
    );
}
