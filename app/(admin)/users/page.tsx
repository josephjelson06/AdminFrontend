'use client';

/**
 * Users Page
 * 
 * Admin page for managing team members.
 * Uses the UserList component from admin/users.
 */

import { UserList } from '@/components/admin/users';

export default function UsersPage() {
    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            <UserList />
        </div>
    );
}
