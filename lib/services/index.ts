/**
 * Services Index
 * 
 * Centralized data access layer for the application.
 * All services abstract API calls through the adapter pattern.
 */

export { hotelService } from './hotelService';
export { kioskService } from './kioskService';
export { userService } from './userService';
export { invoiceService } from './invoiceService';
export { subscriptionService } from './subscriptionService';
export { auditService } from './auditService';
export { planService } from './planService';
export { supportService } from './supportService';
export { dashboardService } from './dashboardService';
export { settingsService } from './settingsService';
export { rolesService } from './rolesService';
export { reportsService } from './reportsService';
export { hotelDashboardService } from './hotelDashboardService';
export { hotelRoomService } from './hotelRoomService';
export { hotelGuestService } from './hotelGuestService';
export { hotelBillingService } from './hotelBillingService';
export { hotelKioskConfigService } from './hotelKioskConfigService';
export { hotelSettingsService } from './hotelSettingsService';
export { hotelTeamService } from './hotelTeamService';
export { hotelHelpService } from './hotelHelpService';
export { hotelRolesService } from './hotelRolesService';
export { hotelIncidentsService } from './hotelIncidentsService';
export type { HotelQueryParams, ServiceResponse, PaginatedResult } from './hotelService';
export type { KioskQueryParams, KioskStats } from './kioskService';
export type { UserQueryParams } from './userService';
export type { InvoiceQueryParams, InvoiceSummary } from './invoiceService';
export type { SubscriptionQueryParams, SubscriptionMetrics, TabCounts } from './subscriptionService';
export type { AuditQueryParams } from './auditService';
export type { Plan } from './planService';
export type { TicketFilterStatus, TicketStats } from './supportService';
export type { DashboardMetrics, Alert, ChartDataPoint } from './dashboardService';
export type { GeneralSettings, NotificationSettings, SecuritySettings, SystemMetric, SystemInfo } from './settingsService';
export type { ReportsMetrics, CheckinDataPoint, LanguageDataPoint, TopHotel, StateData, DailyDataPoint } from './reportsService';
export type { DashboardStats, SparklineData, ActivityFilter } from './hotelDashboardService';
export type { RoomStats, FLOOR_FILTERS, STATUS_FILTERS } from './hotelRoomService';
export type { GuestStats, GuestStatusFilter, DATE_FILTERS, GUEST_STATUS_FILTERS } from './hotelGuestService';
export type { BillingData, PLAN_FEATURES } from './hotelBillingService';
export type { KioskConfig } from './hotelKioskConfigService';
export type { HotelSettingsData } from './hotelSettingsService';
export type { TeamData } from './hotelTeamService';

