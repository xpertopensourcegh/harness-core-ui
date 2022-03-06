/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { renderHook } from '@testing-library/react-hooks'
import { TestWrapper } from '@common/utils/testUtils'
import * as lwServices from 'services/lw'
import useRegionsForSelection from '../useRegionsForSelection'

const mockedRegionsData = { data: { response: [{ name: 'ap-southeast-1', label: 'ap-southeast-1' }] }, loading: false }

const dataForSelection = [{ label: 'ap-southeast-1', value: 'ap-southeast-1' }]

jest.mock('services/lw', () => ({
  useAllRegions: jest.fn().mockImplementation(() => mockedRegionsData)
}))

describe('useRegionsForSelection Hook', () => {
  test('should return regions data for selection in dropdown', () => {
    const { result } = renderHook(() => useRegionsForSelection({ cloudAccountId: 'cloud_id', additionalProps: {} }), {
      wrapper: TestWrapper
    })
    const { data, loading } = result.current

    expect(data).toStrictEqual(dataForSelection)
    expect(loading).toBe(false)
  })

  test('should return empty regions data for empty response', () => {
    jest.spyOn(lwServices, 'useAllRegions').mockImplementation(
      () =>
        ({
          data: null,
          loading: false
        } as any)
    )
    const { result } = renderHook(() => useRegionsForSelection({ cloudAccountId: 'cloud_id', additionalProps: {} }), {
      wrapper: TestWrapper
    })
    const { data, loading } = result.current

    expect(data).toStrictEqual([])
    expect(loading).toBe(false)
  })
})
