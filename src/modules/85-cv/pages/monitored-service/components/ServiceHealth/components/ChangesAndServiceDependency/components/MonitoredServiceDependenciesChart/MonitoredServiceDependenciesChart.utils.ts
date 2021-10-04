import type { DependencyData, GraphData, Node } from '@cv/components/DependencyGraph/DependencyGraph.types'
import type { RestResponseServiceDependencyGraphDTO } from 'services/cv'

export const getDependencyData = (
  serviceDependencyGraphData: RestResponseServiceDependencyGraphDTO | null
): DependencyData | null => {
  let dependencyData = null
  if (serviceDependencyGraphData?.resource?.nodes && serviceDependencyGraphData.resource.nodes.length) {
    dependencyData = {
      nodes: serviceDependencyGraphData.resource.nodes.map(node => ({
        id: node?.identifierRef,
        status: node?.riskLevel,
        icon: 'cd-main',
        name: node?.serviceRef
      })) as Node[],
      data: serviceDependencyGraphData?.resource?.edges as GraphData[]
    }
  }

  return dependencyData
}
