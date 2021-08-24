export interface TickerType {
  percentage: number
  label: string
  count: number
  id: number
}

export interface ServiceHealthProps {
  currentHealthScore: {
    riskStatus: string
    healthScore: number
  }
}
