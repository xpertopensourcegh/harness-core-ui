import type { TableDashboardItem, TableData } from '@cv/components/MetricsDashboardList/MetricsDashboardList.type'

export function initializeTableData(
  selectedDashboards: Map<string, TableDashboardItem>,
  dashboards?: TableDashboardItem[]
): TableData[] {
  if (!dashboards) {
    return []
  }

  const tableData: TableData[] = []
  for (const dashboard of dashboards) {
    if (!dashboard || !dashboard.id || !dashboard.name) {
      continue
    }
    tableData.push({
      selected: selectedDashboards.has(dashboard.name),
      dashboard: dashboard
    })
  }
  return tableData
}

export function initializeSelectedDashboards<T>(
  items: T[],
  mapper: (item: T) => TableDashboardItem
): Map<string, TableDashboardItem> {
  if (!items?.length) {
    return new Map()
  }
  const tableDashboards = items.map(dashboard => mapper(dashboard))
  const selectedDashboards = new Map<string, TableDashboardItem>()
  for (const dashboard of tableDashboards) {
    if (dashboard?.name && dashboard.id) {
      selectedDashboards.set(dashboard.name, dashboard)
    }
  }
  return selectedDashboards
}
