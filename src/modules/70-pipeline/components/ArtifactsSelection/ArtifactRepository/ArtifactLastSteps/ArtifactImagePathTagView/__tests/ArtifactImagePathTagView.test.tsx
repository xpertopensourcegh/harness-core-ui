/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { MultiTypeInputType } from '@harness/uicore'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { ArtifactType } from '@pipeline/components/ArtifactsSelection/ArtifactInterface'
import ArtifactImagePathTagView from '../ArtifactImagePathTagView'

describe('ArtifactImagePathTagView tests', () => {
  const props = {
    selectedArtifact: 'DockerRegistry' as ArtifactType,
    formik: {},
    expressions: [''],
    isReadonly: false,
    allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME, MultiTypeInputType.EXPRESSION],
    connectorIdValue: 'connectorId',
    fetchTags: jest.fn(),
    buildDetailsLoading: false,
    tagList: undefined,
    setTagList: jest.fn(),
    tagError: null
  }
  test('check if artifactimagetagView renders correctly', () => {
    const { container } = render(
      <TestWrapper>
        <ArtifactImagePathTagView {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})