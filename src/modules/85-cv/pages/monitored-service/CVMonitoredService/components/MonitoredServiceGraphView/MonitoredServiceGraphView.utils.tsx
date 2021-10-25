import type { NetworkgraphOptions } from '@cv/components/DependencyGraph/DependencyGraph.types'

export const getListingPageDependencyGraphOptions = (
  onClick: (serviceIdentifier: string) => void
): NetworkgraphOptions => {
  return {
    chart: {
      height: 500,
      spacing: [0, 0, 0, 0]
    },
    tooltip: {
      backgroundColor: 'rgba(56, 57, 70, 1)',
      borderRadius: 20,
      borderWidth: 0,
      padding: 0,
      enabled: true,
      style: {
        pointerEvents: 'auto'
      }
    },
    series: [
      {
        type: 'networkgraph',
        point: {
          events: {
            click: function (e) {
              onClick((e.point as any).id)
            }
          }
        }
      }
    ]
  }
}
