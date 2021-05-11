import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'
import CDDashboardPage from '../CDDashboardPage'

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as any),
  useRouteParams: () => ({
    params: {
      projectIdentifier: 'test'
    }
  })
}))

jest.mock('react-timeago', () => () => 'dummy date')

const deploymentExecutionMock = {
  data: {
    executionDeploymentList: [
      {
        date: '2020-01-19',
        deployments: {
          total: 0,
          success: 0,
          failure: 0
        }
      },
      {
        date: '2020-01-20',
        deployments: {
          total: 0,
          success: 0,
          failure: 0
        }
      },
      {
        date: '2020-01-21',
        deployments: {
          total: 0,
          success: 0,
          failure: 0
        }
      }
    ]
  }
}

const deploymentHealthMock = {
  data: {
    healthDeploymentInfo: {
      total: {
        count: 19,
        production: Math.floor(Math.random() * 10),
        nonProduction: 2,
        countList: [
          {
            time: '2021-04-21',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-22',
            deployments: {
              count: 6
            }
          },
          {
            time: '2021-04-23',
            deployments: {
              count: 11
            }
          },
          {
            time: '2021-04-24',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-25',
            deployments: {
              count: 2
            }
          }
        ]
      },
      success: {
        count: 8,
        rate: 700.0,
        countList: [
          {
            time: '2021-04-21',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-22',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-23',
            deployments: {
              count: 6
            }
          },
          {
            time: '2021-04-24',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-25',
            deployments: {
              count: 2
            }
          }
        ]
      },
      failure: {
        count: 1,
        rate: 0.0,
        countList: [
          {
            time: '2021-04-21',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-22',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-23',
            deployments: {
              count: 1
            }
          },
          {
            time: '2021-04-24',
            deployments: {
              count: 0
            }
          },
          {
            time: '2021-04-25',
            deployments: {
              count: 0
            }
          }
        ]
      }
    }
  }
}

const deploymentsMock = {
  data: {
    failure: [
      {
        name: 'twoStagetwoSer',
        startTs: '2021-04-28 14:53:42.575',
        endTs: '2021-04-28 14:55:18.503',
        status: 'FAILED',
        serviceInfoList: [
          {
            serviceName: 'service2',
            serviceTag: null
          },
          {
            serviceName: 'service1',
            serviceTag: null
          }
        ]
      }
    ],
    pending: [
      {
        name: 'p1',
        startTs: '2021-04-23 20:59:59.654',
        endTs: '2021-04-28 18:43:29.089',
        status: 'PENDING',
        serviceInfoList: [
          {
            serviceName: 'service1',
            serviceTag: null
          },
          {
            serviceName: 'service1',
            serviceTag: null
          }
        ]
      }
    ],
    active: [
      {
        name: 'RunningPipeline',
        startTs: '2021-04-23 20:59:59.654',
        endTs: '2021-04-28 18:43:29.089',
        status: 'RUNNING',
        serviceInfoList: [
          {
            serviceName: 'service1',
            serviceTag: null
          },
          {
            serviceName: 'service1',
            serviceTag: null
          }
        ]
      }
    ]
  }
}

const workloadsMock = {
  data: {
    workloadDeploymentInfoList: [
      {
        name: 'springboot',
        buildCount: 7,
        percentSuccess: 0.0,
        successRate: -100.0,
        lastCommit: 'Update test.txt',
        countList: [
          {
            time: '2021-04-16',
            builds: {
              count: 3
            }
          },
          {
            time: '2021-04-17',
            builds: {
              count: 0
            }
          },
          {
            time: '2021-04-18',
            builds: {
              count: 1
            }
          },
          {
            time: '2021-04-19',
            builds: {
              count: 0
            }
          },
          {
            time: '2021-04-20',
            builds: {
              count: 0
            }
          },
          {
            time: '2021-04-21',
            builds: {
              count: 3
            }
          },
          {
            time: '2021-04-22',
            builds: {
              count: 0
            }
          }
        ],
        time: '2021-04-21 17:03:39.123'
      }
    ]
  }
}

jest.mock('services/cd-ng', () => ({
  useGetDeployments: () => ({
    loading: false,
    data: {
      data: deploymentsMock
    }
  }),
  useGetDeploymentHealth: () => ({
    loading: false,
    data: deploymentHealthMock
  }),
  useGetDeploymentExecution: () => ({
    loading: false,
    data: deploymentExecutionMock
  }),
  useGetWorkloads: () => ({
    loading: false,
    data: workloadsMock
  })
}))

jest.mock('highcharts-react-official', () => () => <div />)
const RealDate = Date.now

describe('CDDashboardPage snapshot test', () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2021-04-22T10:20:30Z').getTime())
  })

  afterAll(() => {
    global.Date.now = RealDate
  })
  test('should render properly', async () => {
    const { container } = render(
      <TestWrapper defaultAppStoreValues={defaultAppStoreValues}>
        <CDDashboardPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
