/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render } from '@testing-library/react'
import { joinAsASentence } from '@common/utils/StringUtils'
import { PipelineExecutionWarning } from '../PipelineExecutionWarning'

describe('Pipeline Execution Warning component testing', () => {
  test('Inital render should match snapshot', () => {
    const { container, getByText } = render(
      <PipelineExecutionWarning warning={joinAsASentence(['tag1(1.0.0)', 'tag2(1.0.1)'])} />
    )
    expect(getByText('tag1(1.0.0) and tag2(1.0.1)')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
