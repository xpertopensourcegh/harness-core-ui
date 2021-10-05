import { TimePeriodEnum } from '@cv/pages/monitored-service/components/ServiceHealth/ServiceHealth.constants'

export const datetimeMock = 1632742200646

export const startTimeToEndTimeMock = (key: string) => {
  switch (key) {
    case TimePeriodEnum.FOUR_HOURS:
      return { interval: 300000, startTimeRoundedOffToNearest30min: 1632727800646 }
    case TimePeriodEnum.TWENTY_FOUR_HOURS:
      return { interval: 1800000, startTimeRoundedOffToNearest30min: 1632655800646 }
    case TimePeriodEnum.THREE_DAYS:
      return { interval: 5400000, startTimeRoundedOffToNearest30min: 1632483000646 }
    case TimePeriodEnum.SEVEN_DAYS:
      return { interval: 12600000, startTimeRoundedOffToNearest30min: 1632137400646 }
    case TimePeriodEnum.THIRTY_DAYS:
      return { interval: 54000000, startTimeRoundedOffToNearest30min: 1630150200646 }
    default:
      break
  }
}

export const mockTimeData = [
  { count: 1, startTime: 1632009431325, endTime: 1632021768825 }, // 1
  { count: 1, startTime: 1632058781325, endTime: 1632071118825 },
  { count: 2, startTime: 1632132806325, endTime: 1632145143825 },
  { count: 4, startTime: 1632145143825, endTime: 1632157481325 }, // 2
  { count: 1, startTime: 1632157481325, endTime: 1632169818825 },
  { count: 3, startTime: 1632169818825, endTime: 1632182156325 },
  { count: 1, startTime: 1632182156325, endTime: 1632194493825 },
  { count: 1, startTime: 1632194493825, endTime: 1632206831325 },
  { count: 1, startTime: 1632219168825, endTime: 1632231506325 },
  { count: 2, startTime: 1632231506325, endTime: 1632243843825 },
  { count: 1, startTime: 1632243843825, endTime: 1632256181325 },
  { count: 2, startTime: 1632256181325, endTime: 1632268518825 },
  { count: 3, startTime: 1632268518825, endTime: 1632280856325 },
  { count: 2, startTime: 1632280856325, endTime: 1632293193825 },
  { count: 2, startTime: 1632293193825, endTime: 1632305531325 }
]
export const changeTimelineResponse = {
  metaData: {},
  resource: {
    categoryTimeline: {
      Deployment: mockTimeData,
      Infrastructure: mockTimeData,
      Alert: mockTimeData
    }
  },
  responseMessages: []
}

export const singleDeploymentMarker = {
  custom: {
    count: 1,
    endTime: 0,
    startTime: 0,
    color: 'var(--green-400)',
    toolTipLabel: '1 deploymentText'
  },
  fillColor: 'var(--green-400)',
  radius: 6,
  symbol: 'diamond'
}

export const twoDeploymentMarker = {
  custom: {
    count: 2,
    endTime: 0,
    startTime: 0,
    color: 'var(--green-400)',
    toolTipLabel: '2 Deployments'
  },
  height: 16,
  symbol: 'url(test-file-stub)',
  width: 16
}

export const multipleDeploymentMarker = {
  custom: {
    count: 4,
    endTime: 0,
    startTime: 0,
    color: 'var(--green-400)',
    toolTipLabel: '4 Deployments'
  },
  height: 18,
  symbol: 'url(test-file-stub)',
  width: 18
}

export const mockDeploymentPayload = {
  data: [
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '1 deploymentText',
          count: 1,
          endTime: 1632021768825,
          startTime: 1632009431325
        },
        fillColor: 'var(--green-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632009431325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '1 deploymentText',
          count: 1,
          endTime: 1632071118825,
          startTime: 1632058781325
        },
        fillColor: 'var(--green-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632058781325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '2 Deployments',
          count: 2,
          endTime: 1632145143825,
          startTime: 1632132806325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632132806325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '4 Deployments',
          count: 4,
          endTime: 1632157481325,
          startTime: 1632145143825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632145143825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '1 deploymentText',
          count: 1,
          endTime: 1632169818825,
          startTime: 1632157481325
        },
        fillColor: 'var(--green-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632157481325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '3 Deployments',
          count: 3,
          endTime: 1632182156325,
          startTime: 1632169818825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632169818825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '1 deploymentText',
          count: 1,
          endTime: 1632194493825,
          startTime: 1632182156325
        },
        fillColor: 'var(--green-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632182156325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '1 deploymentText',
          count: 1,
          endTime: 1632206831325,
          startTime: 1632194493825
        },
        fillColor: 'var(--green-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632194493825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '1 deploymentText',
          count: 1,
          endTime: 1632231506325,
          startTime: 1632219168825
        },
        fillColor: 'var(--green-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632219168825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '2 Deployments',
          count: 2,
          endTime: 1632243843825,
          startTime: 1632231506325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632231506325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '1 deploymentText',
          count: 1,
          endTime: 1632256181325,
          startTime: 1632243843825
        },
        fillColor: 'var(--green-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632243843825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '2 Deployments',
          count: 2,
          endTime: 1632268518825,
          startTime: 1632256181325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632256181325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '3 Deployments',
          count: 3,
          endTime: 1632280856325,
          startTime: 1632268518825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632268518825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '2 Deployments',
          count: 2,
          endTime: 1632293193825,
          startTime: 1632280856325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632280856325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--green-400)',
          toolTipLabel: '2 Deployments',
          count: 2,
          endTime: 1632305531325,
          startTime: 1632293193825
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632293193825,
      y: 0
    }
  ],
  name: 'Deployments',
  type: 'scatter'
}

export const mockIncidentPayload = {
  data: [
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '1 cv.changeSource.incident',
          count: 1,
          endTime: 1632021768825,
          startTime: 1632009431325
        },
        fillColor: 'var(--purple-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632009431325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '1 cv.changeSource.incident',
          count: 1,
          endTime: 1632071118825,
          startTime: 1632058781325
        },
        fillColor: 'var(--purple-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632058781325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '2 cv.changeSource.tooltip.incidents',
          count: 2,
          endTime: 1632145143825,
          startTime: 1632132806325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632132806325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '4 cv.changeSource.tooltip.incidents',
          count: 4,
          endTime: 1632157481325,
          startTime: 1632145143825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632145143825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '1 cv.changeSource.incident',
          count: 1,
          endTime: 1632169818825,
          startTime: 1632157481325
        },
        fillColor: 'var(--purple-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632157481325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '3 cv.changeSource.tooltip.incidents',
          count: 3,
          endTime: 1632182156325,
          startTime: 1632169818825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632169818825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '1 cv.changeSource.incident',
          count: 1,
          endTime: 1632194493825,
          startTime: 1632182156325
        },
        fillColor: 'var(--purple-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632182156325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '1 cv.changeSource.incident',
          count: 1,
          endTime: 1632206831325,
          startTime: 1632194493825
        },
        fillColor: 'var(--purple-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632194493825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '1 cv.changeSource.incident',
          count: 1,
          endTime: 1632231506325,
          startTime: 1632219168825
        },
        fillColor: 'var(--purple-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632219168825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '2 cv.changeSource.tooltip.incidents',
          count: 2,
          endTime: 1632243843825,
          startTime: 1632231506325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632231506325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '1 cv.changeSource.incident',
          count: 1,
          endTime: 1632256181325,
          startTime: 1632243843825
        },
        fillColor: 'var(--purple-400)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632243843825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '2 cv.changeSource.tooltip.incidents',
          count: 2,
          endTime: 1632268518825,
          startTime: 1632256181325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632256181325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '3 cv.changeSource.tooltip.incidents',
          count: 3,
          endTime: 1632280856325,
          startTime: 1632268518825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632268518825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '2 cv.changeSource.tooltip.incidents',
          count: 2,
          endTime: 1632293193825,
          startTime: 1632280856325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632280856325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--purple-400)',
          toolTipLabel: '2 cv.changeSource.tooltip.incidents',
          count: 2,
          endTime: 1632305531325,
          startTime: 1632293193825
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632293193825,
      y: 0
    }
  ],
  name: 'Incidents',
  type: 'scatter'
}

export const mockInfraPayload = {
  data: [
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '1 infrastructureText change',
          count: 1,
          endTime: 1632021768825,
          startTime: 1632009431325
        },
        fillColor: 'var(--primary-4)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632009431325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '1 infrastructureText change',
          count: 1,
          endTime: 1632071118825,
          startTime: 1632058781325
        },
        fillColor: 'var(--primary-4)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632058781325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '2 infrastructureText changes',
          count: 2,
          endTime: 1632145143825,
          startTime: 1632132806325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632132806325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '4 infrastructureText changes',
          count: 4,
          endTime: 1632157481325,
          startTime: 1632145143825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632145143825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '1 infrastructureText change',
          count: 1,
          endTime: 1632169818825,
          startTime: 1632157481325
        },
        fillColor: 'var(--primary-4)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632157481325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '3 infrastructureText changes',
          count: 3,
          endTime: 1632182156325,
          startTime: 1632169818825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632169818825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '1 infrastructureText change',
          count: 1,
          endTime: 1632194493825,
          startTime: 1632182156325
        },
        fillColor: 'var(--primary-4)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632182156325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '1 infrastructureText change',
          count: 1,
          endTime: 1632206831325,
          startTime: 1632194493825
        },
        fillColor: 'var(--primary-4)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632194493825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '1 infrastructureText change',
          count: 1,
          endTime: 1632231506325,
          startTime: 1632219168825
        },
        fillColor: 'var(--primary-4)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632219168825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '2 infrastructureText changes',
          count: 2,
          endTime: 1632243843825,
          startTime: 1632231506325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632231506325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '1 infrastructureText change',
          count: 1,
          endTime: 1632256181325,
          startTime: 1632243843825
        },
        fillColor: 'var(--primary-4)',
        radius: 6,
        symbol: 'diamond'
      },
      x: 1632243843825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '2 infrastructureText changes',
          count: 2,
          endTime: 1632268518825,
          startTime: 1632256181325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632256181325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '3 infrastructureText changes',
          count: 3,
          endTime: 1632280856325,
          startTime: 1632268518825
        },
        height: 18,
        symbol: 'url(test-file-stub)',
        width: 18
      },
      x: 1632268518825,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '2 infrastructureText changes',
          count: 2,
          endTime: 1632293193825,
          startTime: 1632280856325
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632280856325,
      y: 0
    },
    {
      marker: {
        custom: {
          color: 'var(--primary-4)',
          toolTipLabel: '2 infrastructureText changes',
          count: 2,
          endTime: 1632305531325,
          startTime: 1632293193825
        },
        height: 16,
        symbol: 'url(test-file-stub)',
        width: 16
      },
      x: 1632293193825,
      y: 0
    }
  ],
  name: 'Infrastructure',
  type: 'scatter'
}

export const infoCardDataSingleValue = [
  { count: 1, key: 'Deployments', message: '1 deploymentText' },
  { count: 1, key: 'Incidents', message: '1 cv.changeSource.incident' },
  { count: 1, key: 'Infrastructure', message: '1 infrastructureText change' }
]

export const infoCardDataMultipleValue = [
  { count: 9, key: 'Deployments', message: '9 Deployments' },
  { count: 9, key: 'Incidents', message: '9 cv.changeSource.tooltip.incidents' },
  { count: 9, key: 'Infrastructure', message: '9 infrastructureText changes' }
]
