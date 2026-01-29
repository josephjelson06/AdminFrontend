/**
 * Admin Dashboard Components
 * 
 * Barrel export for dashboard-related admin components.
 */

// Layout components
export { DashboardHeader } from './DashboardHeader';
export { DashboardKPIs } from './DashboardKPIs';
export { DashboardCharts } from './DashboardCharts';
export { AlertsFeed } from './AlertsFeed';
export { QuickAccessGrid } from './QuickAccessGrid';

// Existing components
export { DashboardFilter } from './DashboardFilter';
export { KPICard } from './KPICard';

// Hooks
export { useDashboard } from './useDashboard';
export type { UseDashboardReturn } from './useDashboard';
