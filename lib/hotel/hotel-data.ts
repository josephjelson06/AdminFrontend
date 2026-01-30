// Hotel Panel Data Layer

// ============================================
// HOTEL USER ROLES
// ============================================

export type HotelUserRole = 'hotel_manager' | 'front_desk' | 'housekeeping' | 'hotel_finance' | 'maintenance_staff';

export interface HotelUser {
    id: string;
    name: string;
    email: string;
    role: HotelUserRole;
    hotelId: string;
    phone?: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
}

// Role display names
export const HOTEL_ROLE_LABELS: Record<HotelUserRole, string> = {
    hotel_manager: 'Hotel Manager',
    front_desk: 'Front Desk',
    housekeeping: 'Housekeeping',
    hotel_finance: 'Finance',
    maintenance_staff: 'Maintenance Staff',
};

// Page access for hotel roles
export const HOTEL_ROLE_ACCESS: Record<HotelUserRole, string[]> = {
    hotel_manager: ['dashboard', 'guests', 'rooms', 'kiosk', 'settings', 'team', 'billing'],
    front_desk: ['dashboard', 'guests', 'rooms'],
    housekeeping: ['rooms'],
    hotel_finance: ['dashboard', 'billing'],
    maintenance_staff: ['incidents', 'help'],
};

// ============================================
// HOTEL DATA
// ============================================

export interface HotelProfile {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    logo?: string;
    plan: 'standard' | 'advanced' | 'enterprise';
    planExpiry: string;
    totalRooms: number;
    kiosksAllocated: number;
}

export const MOCK_HOTEL_PROFILE: HotelProfile = {
    id: 'hotel-001',
    name: 'Grand Hyatt Mumbai',
    address: 'Off Western Express Highway, Santacruz East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400055',
    phone: '+91 22 6676 1234',
    email: 'info@grandhyattmumbai.com',
    plan: 'advanced',
    planExpiry: '2026-06-15',
    totalRooms: 150,
    kiosksAllocated: 2,
};

// ============================================
// KIOSK DATA
// ============================================

export type KioskStatus = 'online' | 'offline' | 'maintenance';

export interface HotelKiosk {
    id: string;
    name: string;
    location: string;
    status: KioskStatus;
    lastHeartbeat: string;
    todayCheckIns: number;
    firmware: string;
}

export const MOCK_HOTEL_KIOSKS: HotelKiosk[] = [
    {
        id: 'kiosk-001',
        name: 'Lobby Kiosk 1',
        location: 'Main Lobby',
        status: 'online',
        lastHeartbeat: '2 mins ago',
        todayCheckIns: 24,
        firmware: 'v2.4.1',
    },
    {
        id: 'kiosk-002',
        name: 'Lobby Kiosk 2',
        location: 'East Wing',
        status: 'online',
        lastHeartbeat: '1 min ago',
        todayCheckIns: 18,
        firmware: 'v2.4.1',
    },
];

// ============================================
// GUEST CHECK-IN DATA
// ============================================

export type VerificationStatus = 'verified' | 'manual' | 'failed';

export interface GuestCheckIn {
    id: string;
    guestName: string;
    bookingId: string;
    roomNumber: string;
    checkInTime: string;
    language: string;
    verification: VerificationStatus;
    kioskId: string;
}

export const MOCK_GUEST_CHECKINS: GuestCheckIn[] = [
    {
        id: 'ci-001',
        guestName: 'Rajesh Kumar',
        bookingId: 'BK-2024-001234',
        roomNumber: '304',
        checkInTime: '2 mins ago',
        language: 'Hindi',
        verification: 'verified',
        kioskId: 'kiosk-001',
    },
    {
        id: 'ci-002',
        guestName: 'Priya Sharma',
        bookingId: 'BK-2024-001235',
        roomNumber: '512',
        checkInTime: '15 mins ago',
        language: 'English',
        verification: 'verified',
        kioskId: 'kiosk-002',
    },
    {
        id: 'ci-003',
        guestName: 'Amit Patel',
        bookingId: 'BK-2024-001236',
        roomNumber: '207',
        checkInTime: '32 mins ago',
        language: 'Hindi',
        verification: 'manual',
        kioskId: 'kiosk-001',
    },
    {
        id: 'ci-004',
        guestName: 'Sarah Johnson',
        bookingId: 'BK-2024-001237',
        roomNumber: '801',
        checkInTime: '1 hour ago',
        language: 'English',
        verification: 'verified',
        kioskId: 'kiosk-002',
    },
    {
        id: 'ci-005',
        guestName: 'Vikram Singh',
        bookingId: 'BK-2024-001238',
        roomNumber: '415',
        checkInTime: '2 hours ago',
        language: 'Hindi',
        verification: 'failed',
        kioskId: 'kiosk-001',
    },
    {
        id: 'ci-006',
        guestName: 'Ananya Reddy',
        bookingId: 'BK-2024-001239',
        roomNumber: '623',
        checkInTime: '3 hours ago',
        language: 'English',
        verification: 'verified',
        kioskId: 'kiosk-002',
    },
];

// ============================================
// ROOM DATA
// ============================================

export type RoomStatus = 'ready' | 'cleaning' | 'occupied' | 'dirty';

export interface Room {
    id: string;
    number: string;
    floor: number;
    type: 'standard' | 'deluxe' | 'suite';
    status: RoomStatus;
    lastUpdated: string;
}

export const MOCK_ROOMS: Room[] = [
    // Floor 1
    { id: 'r-101', number: '101', floor: 1, type: 'standard', status: 'ready', lastUpdated: '10 mins ago' },
    { id: 'r-102', number: '102', floor: 1, type: 'standard', status: 'occupied', lastUpdated: '2 hours ago' },
    { id: 'r-103', number: '103', floor: 1, type: 'deluxe', status: 'cleaning', lastUpdated: '5 mins ago' },
    { id: 'r-104', number: '104', floor: 1, type: 'standard', status: 'ready', lastUpdated: '1 hour ago' },
    { id: 'r-105', number: '105', floor: 1, type: 'suite', status: 'dirty', lastUpdated: '30 mins ago' },
    // Floor 2
    { id: 'r-201', number: '201', floor: 2, type: 'standard', status: 'ready', lastUpdated: '15 mins ago' },
    { id: 'r-202', number: '202', floor: 2, type: 'deluxe', status: 'occupied', lastUpdated: '4 hours ago' },
    { id: 'r-203', number: '203', floor: 2, type: 'standard', status: 'ready', lastUpdated: '45 mins ago' },
    { id: 'r-204', number: '204', floor: 2, type: 'standard', status: 'cleaning', lastUpdated: '8 mins ago' },
    { id: 'r-205', number: '205', floor: 2, type: 'deluxe', status: 'ready', lastUpdated: '2 hours ago' },
    // Floor 3
    { id: 'r-301', number: '301', floor: 3, type: 'deluxe', status: 'occupied', lastUpdated: '5 hours ago' },
    { id: 'r-302', number: '302', floor: 3, type: 'standard', status: 'dirty', lastUpdated: '20 mins ago' },
    { id: 'r-303', number: '303', floor: 3, type: 'suite', status: 'ready', lastUpdated: '1 hour ago' },
    { id: 'r-304', number: '304', floor: 3, type: 'standard', status: 'occupied', lastUpdated: '2 mins ago' },
    { id: 'r-305', number: '305', floor: 3, type: 'deluxe', status: 'ready', lastUpdated: '3 hours ago' },
];

// ============================================
// KIOSK CONFIG
// ============================================

export interface KioskConfig {
    welcomeMessage: string;
    enabledLanguages: string[];
    maxLanguages: number;
    logoUrl?: string;
}

export interface Language {
    id: string;
    name: string;
    native: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
    { id: 'en', name: 'English', native: 'English' },
    { id: 'hi', name: 'Hindi', native: 'हिंदी' },
    { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { id: 'te', name: 'Telugu', native: 'తెలుగు' },
    { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { id: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { id: 'mr', name: 'Marathi', native: 'मराठी' },
    { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

export const MOCK_KIOSK_CONFIG: KioskConfig = {
    welcomeMessage: 'Welcome to Grand Hyatt Mumbai! Please scan your booking confirmation to begin check-in.',
    enabledLanguages: ['en', 'hi'],
    maxLanguages: 4, // Based on plan
};

// ============================================
// BILLING DATA
// ============================================

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    period: string;
}

export const MOCK_INVOICES: Invoice[] = [
    { id: 'INV-2024-001', date: '2024-01-01', amount: 25000, status: 'paid', period: 'Jan 2024' },
    { id: 'INV-2024-002', date: '2024-02-01', amount: 25000, status: 'paid', period: 'Feb 2024' },
    { id: 'INV-2024-003', date: '2024-03-01', amount: 25000, status: 'paid', period: 'Mar 2024' },
    { id: 'INV-2024-004', date: '2024-04-01', amount: 25000, status: 'paid', period: 'Apr 2024' },
    { id: 'INV-2024-005', date: '2024-05-01', amount: 25000, status: 'pending', period: 'May 2024' },
];

// ============================================
// HOTEL TEAM DATA
// ============================================

export const MOCK_HOTEL_TEAM: HotelUser[] = [
    {
        id: 'hu-001',
        name: 'Vikram Mehta',
        email: 'manager@hotel.in',
        role: 'hotel_manager',
        hotelId: 'hotel-001',
        phone: '+91 98765 00001',
        status: 'active',
        lastLogin: '10 mins ago',
    },
    {
        id: 'hu-002',
        name: 'Anita Desai',
        email: 'frontdesk@hotel.in',
        role: 'front_desk',
        hotelId: 'hotel-001',
        phone: '+91 98765 00002',
        status: 'active',
        lastLogin: '5 mins ago',
    },
    {
        id: 'hu-003',
        name: 'Ramesh Kumar',
        email: 'hk@hotel.in',
        role: 'housekeeping',
        hotelId: 'hotel-001',
        status: 'active',
        lastLogin: '1 hour ago',
    },
    {
        id: 'hu-004',
        name: 'Priya Nair',
        email: 'finance@hotel.in',
        role: 'hotel_finance',
        hotelId: 'hotel-001',
        status: 'active',
        lastLogin: '2 hours ago',
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getKioskStatusColor(status: KioskStatus): string {
    switch (status) {
        case 'online': return 'bg-emerald-500';
        case 'offline': return 'bg-rose-500';
        case 'maintenance': return 'bg-amber-500';
    }
}

export function getRoomStatusColor(status: RoomStatus): string {
    switch (status) {
        case 'ready': return 'bg-emerald-500';
        case 'cleaning': return 'bg-amber-500';
        case 'occupied': return 'bg-blue-500';
        case 'dirty': return 'bg-rose-500';
    }
}

export function getRoomStatusLabel(status: RoomStatus): string {
    switch (status) {
        case 'ready': return 'Ready';
        case 'cleaning': return 'Cleaning';
        case 'occupied': return 'Occupied';
        case 'dirty': return 'Dirty';
    }
}

export function getVerificationColor(status: VerificationStatus): string {
    switch (status) {
        case 'verified': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
        case 'manual': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        case 'failed': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
    }
}

// ============================================
// INCIDENT DATA (Maintenance Staff)
// ============================================

export type IncidentPriority = 'Low' | 'Medium' | 'Immediate Fix' | null;
export type IncidentStatus = 'Reported' | 'Assigned' | 'In Progress' | 'Resolved';

export interface Incident {
    id: string;
    guestName: string;
    guestReportPhoto: string;
    resolvedPhoto: string | null;
    description: string;
    priority: IncidentPriority;
    status: IncidentStatus;
    assignedToUserId: string | null; // null = unassigned
    roomNumber: string;
    reportedAt: string;
}

// Mock maintenance staff user ID (matches auth.tsx)
export const MAINTENANCE_STAFF_USER_ID = 'hu-005';
export const UNASSIGNED = null;

export const MOCK_INCIDENTS: Incident[] = [
    // ========== UNASSIGNED (Guest Reported - Pending Manager Review) ==========
    {
        id: 'inc-101',
        guestName: 'Ravi Sharma',
        guestReportPhoto: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=400',
        resolvedPhoto: null,
        description: 'Shower head is broken and water pressure is very low. Cannot take a proper shower.',
        priority: null, // Guest didn't set priority - Manager needs to set
        status: 'Reported',
        assignedToUserId: UNASSIGNED,
        roomNumber: '401',
        reportedAt: '5 mins ago',
    },
    {
        id: 'inc-102',
        guestName: 'Meera Patel',
        guestReportPhoto: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        resolvedPhoto: null,
        description: 'Window curtain rod has fallen down. Curtains are on the floor.',
        priority: 'Low', // Guest set priority
        status: 'Reported',
        assignedToUserId: UNASSIGNED,
        roomNumber: '215',
        reportedAt: '20 mins ago',
    },
    {
        id: 'inc-103',
        guestName: 'John Williams',
        guestReportPhoto: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400',
        resolvedPhoto: null,
        description: 'Water is flooding from bathroom. Pipe seems to have burst!',
        priority: 'Immediate Fix', // Guest marked urgent
        status: 'Reported',
        assignedToUserId: UNASSIGNED,
        roomNumber: '608',
        reportedAt: '2 mins ago',
    },
    {
        id: 'inc-104',
        guestName: 'Ananya Reddy',
        guestReportPhoto: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        resolvedPhoto: null,
        description: 'Mini fridge is not cooling. Food items getting spoiled.',
        priority: null, // Guest didn't set priority
        status: 'Reported',
        assignedToUserId: UNASSIGNED,
        roomNumber: '322',
        reportedAt: '1 hour ago',
    },
    // ========== ASSIGNED (Already sent to Maintenance Staff) ==========
    {
        id: 'inc-001',
        guestName: 'Rajesh Kumar',
        guestReportPhoto: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400',
        resolvedPhoto: null,
        description: 'Bathroom sink is leaking. Water dripping from under the cabinet.',
        priority: 'Immediate Fix',
        status: 'Assigned',
        assignedToUserId: MAINTENANCE_STAFF_USER_ID,
        roomNumber: '304',
        reportedAt: '10 mins ago',
    },
    {
        id: 'inc-002',
        guestName: 'Priya Sharma',
        guestReportPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        resolvedPhoto: null,
        description: 'Air conditioning unit making loud noise. Guest unable to sleep.',
        priority: 'Medium',
        status: 'Assigned',
        assignedToUserId: MAINTENANCE_STAFF_USER_ID,
        roomNumber: '512',
        reportedAt: '45 mins ago',
    },
    {
        id: 'inc-003',
        guestName: 'Amit Patel',
        guestReportPhoto: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        resolvedPhoto: null,
        description: 'TV remote not working. Guest requested replacement.',
        priority: 'Low',
        status: 'In Progress',
        assignedToUserId: MAINTENANCE_STAFF_USER_ID,
        roomNumber: '207',
        reportedAt: '2 hours ago',
    },
    {
        id: 'inc-004',
        guestName: 'Sarah Johnson',
        guestReportPhoto: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400',
        resolvedPhoto: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=400',
        description: 'Light bulb in bathroom burnt out. Replaced with new LED bulb.',
        priority: 'Low',
        status: 'Resolved',
        assignedToUserId: MAINTENANCE_STAFF_USER_ID,
        roomNumber: '415',
        reportedAt: '1 day ago',
    },
];

export function getIncidentPriorityColor(priority: IncidentPriority): string {
    switch (priority) {
        case 'Immediate Fix': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
        case 'Medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
        case 'Low': return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
        default: return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400';
    }
}

export function getIncidentStatusColor(status: IncidentStatus): string {
    switch (status) {
        case 'Reported': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        case 'Assigned': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        case 'In Progress': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
        case 'Resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    }
}

// ============================================
// HELP & SUPPORT DATA
// ============================================

export interface FAQItem {
    question: string;
    answer: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    createdAt: string;
    status: 'open' | 'resolved';
}

export const MOCK_FAQS: FAQItem[] = [
    {
        question: 'How do I update room status for housekeeping?',
        answer: 'Navigate to the Room Status page from the sidebar. Tap on any room card to cycle through statuses: Dirty → Cleaning → Ready. Occupied rooms will automatically change to Dirty upon guest checkout.',
    },
    {
        question: 'What languages can guests use on the kiosk?',
        answer: 'Available languages depend on your subscription plan. Standard plans support 2 languages, Advanced plans support 4, and Enterprise plans support all 8 languages. Configure languages in Kiosk Settings.',
    },
    {
        question: 'How do I add a new team member?',
        answer: 'Go to Team Access, click "Add Team Member", fill in their details and assign a role. They will receive an email invitation to set up their account.',
    },
    {
        question: 'What does "Manual Verification" mean in Guest Log?',
        answer: 'Manual verification occurs when the kiosk cannot automatically verify a guest\'s ID. Front desk staff then manually verifies the guest\'s identity.',
    },
    {
        question: 'How do I download invoice history?',
        answer: 'Visit Subscription & Billing, find the invoice in the history table, and click the download icon. Invoices are available in PDF format.',
    },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
    { id: '4521', subject: 'Kiosk display issue', createdAt: '3 days ago', status: 'resolved' },
    { id: '4519', subject: 'Add Hindi language', createdAt: '5 days ago', status: 'resolved' },
];

