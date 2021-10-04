import type { Options } from 'highcharts'
import type { Edge } from 'services/cv'

export type NetworkgraphOptions = Omit<Options, 'type'>
export interface Node {
  icon?: string
  name: string
  id: string
  status: string
}

export interface GraphData {
  from: string
  to: string
}

export type DependencyData = {
  data?: Edge[]
  nodes?: Node[]
}

export interface DependencyGraphProps {
  dependencyData: DependencyData
  options?: NetworkgraphOptions
}
