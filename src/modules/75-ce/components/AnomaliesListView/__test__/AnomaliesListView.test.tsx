/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { fireEvent, queryByText, render, act, waitFor } from '@testing-library/react'
import { Provider } from 'urql'
import { fromValue } from 'wonka'
import * as FeatureFlag from '@common/hooks/useFeatureFlag'
import { TestWrapper } from '@common/utils/testUtils'
import AnomaliesListView from '../AnomaliesListView'
import AnomalyData from './AnomalyData.json'

const params = {
  accountId: 'TEST_ACC',
  perspetiveId: 'perspectiveId',
  perspectiveName: 'sample perspective'
}

jest.mock('services/ce', () => {
  return {
    useReportAnomalyFeedback: jest.fn().mockImplementation(() => ({
      mutate: async () => {
        return {
          status: 'SUCCESS',
          data: {}
        }
      }
    }))
  }
})

describe('test case for anomalies detection overview page', () => {
  test('should be able to render the overview dashboard', async () => {
    jest.spyOn(FeatureFlag, 'useFeatureFlag').mockReturnValue(true)

    const responseState = {
      executeQuery: () => {
        return fromValue({})
      }
    }

    const { container } = render(
      <TestWrapper pathParams={params}>
        <Provider value={responseState as any}>
          <AnomaliesListView
            listData={AnomalyData as any}
            setSortByObj={jest.fn()}
            timeRange={{ to: '2022-03-09', from: '2022-03-03' }}
            sortByObj={{}}
          />
        </Provider>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })

  test('should be able to render the overview dashboard and report false anomaly', async () => {
    jest.spyOn(FeatureFlag, 'useFeatureFlag').mockReturnValue(true)

    const responseState = {
      executeQuery: () => {
        return fromValue({})
      }
    }

    const { container } = render(
      <TestWrapper pathParams={params}>
        <Provider value={responseState as any}>
          <AnomaliesListView
            listData={AnomalyData as any}
            setSortByObj={jest.fn()}
            timeRange={{ to: '2022-03-09', from: '2022-03-03' }}
            sortByObj={{}}
          />
        </Provider>
      </TestWrapper>
    )

    const optionIcon = container.querySelector('span[data-icon="Options"]')
    act(() => {
      fireEvent.click(optionIcon!)
    })
    expect(container).toMatchSnapshot()
    act(() => {
      fireEvent.click(queryByText(container, 'ce.anomalyDetection.tableMenu.falseAnomaly')!)
    })
    await waitFor(() => {
      expect(queryByText(document.body, 'ce.anomalyDetection.userFeedbackSuccessMsg')).toBeDefined()
    })
  })
})
