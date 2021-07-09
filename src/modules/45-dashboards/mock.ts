import { Color } from '@wings-software/uicore'
import type { ServiceInstanceWidgetProps } from './components/Services/ServiceInstancesWidget/ServiceInstancesWidget'
import type { MostActiveServicesWidgetProps } from './components/Services/MostActiveServicesWidget/MostActiveServicesWidget'
import { DeploymentStatus } from './components/Services/ServicesList/ServicesList'
import type { ServicesListProps } from './components/Services/ServicesList/ServicesList'

export const ServiceInstancesWidgetMock: ServiceInstanceWidgetProps = {
  serviceCount: 57,
  serviceInstancesCount: 130,
  trendTitle: '6 month trend',
  trendData: [38, 10, 70, 63, 61, 107, 40, 61, 82, 22, 100, 63, 94, 16, 73, 59, 31, 90, 87, 102, 45, 39, 10, 64, 76],
  nonProdCount: 120,
  prodCount: 20
}

export const MostActiveServicesWidgetMock: MostActiveServicesWidgetProps = {
  title: 'Most active services',
  data: [
    {
      label: 'Login',
      value: 23,
      color: Color.RED_800,
      change: 5
    },
    {
      label: 'Backend',
      value: 20,
      color: Color.RED_700,
      change: 5
    },
    {
      label: 'Portal',
      value: 16,
      color: Color.RED_500,
      change: 5
    },
    {
      label: 'Test',
      value: 12,
      color: Color.ORANGE_900,
      change: 5
    },
    {
      label: 'Others',
      value: 8,
      color: Color.ORANGE_400,
      change: 5
    },
    {
      label: 'Login',
      value: 5,
      color: Color.ORANGE_400,
      change: -5
    },
    {
      label: 'Backend',
      value: 4,
      color: Color.ORANGE_400,
      change: 5
    },
    {
      label: 'Portal',
      value: 3,
      color: Color.ORANGE_400,
      change: -5
    },
    {
      label: 'Test',
      value: 2,
      color: Color.ORANGE_400,
      change: 5
    },
    {
      label: 'Others',
      value: 1,
      color: Color.ORANGE_400,
      change: 5
    }
  ]
}

export const deploymentsInfo = {
  status: 'SUCCESS',
  data: {
    startTime: 1623149323912,
    endTime: 1625741323912,
    totalDeployments: 57,
    failureRate: 24.2,
    frequency: 324.2,
    failureRateChangeRate: 45.7,
    totalDeploymentsChangeRate: 34.4,
    frequencyChangeRate: 23.2,
    serviceDeploymentList: [{ time: 1625443200000, deployments: { total: 0, success: 0, failure: 0 } }]
  },
  metaData: null,
  correlationId: 'deaf3a4d-161b-4d64-a77d-5be92b7cf41b'
}

export const ServiceListMock: ServicesListProps = {
  total: 54,
  totalItems: 10,
  totalPages: 1,
  data: Array(10).fill({
    name: 'My Login Service',
    id: 'Service 001',
    serviceInstances: {
      count: 13,
      prodCount: 12,
      nonProdCount: 1
    },
    deployments: {
      value: '13',
      change: 5
    },
    failureRate: {
      value: '20%',
      change: 5
    },
    frequency: {
      value: '23',
      change: 5
    },
    lastDeployment: {
      name: 'My Pipeline X',
      id: 'Pipeline X 1899',
      timestamp: '1619120733360',
      status: DeploymentStatus.SUCCESS
    }
  })
}
