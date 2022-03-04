/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import { PipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import pipelineContextMock from '@pipeline/components/PipelineStudio/RightDrawer/__tests__/stateMock'
import { stepTemplateMock } from '@pipeline/utils/__tests__/useSaveTemplate.test'
import type { ConfigModalProps } from 'framework/Templates/TemplateConfigModal/TemplateConfigModal'
import { DefaultTemplate } from 'framework/Templates/templates'
import { SaveTemplateButton, SaveTemplateButtonProps } from '../SaveTemplateButton'

const mockChildComponent = jest.fn()
jest.mock('framework/Templates/TemplateConfigModal/TemplateConfigModal', () => ({
  ...(jest.requireActual('framework/Templates/TemplateConfigModal/TemplateConfigModal') as any),
  TemplateConfigModal: (props: ConfigModalProps) => {
    mockChildComponent(props)
    return <div className="template-config-modal-mock"></div>
  }
}))

const baseProps: SaveTemplateButtonProps = {
  data: {
    ...stepTemplateMock.spec,
    name: 'name',
    identifier: 'identifier',
    description: 'some description',
    tags: { tag1: '', tag2: '' }
  },
  type: 'Stage'
}
const PATH = routes.toPipelineStudio({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })
const PATH_PARAMS = {
  pipelineIdentifier: 'stage1',
  accountId: 'accountId',
  orgIdentifier: 'CV',
  projectIdentifier: 'Milos2',
  module: 'cd'
}

describe('<SaveTemplateButton /> tests', () => {
  test('should match snapshot', async () => {
    const { container } = render(
      <PipelineContext.Provider value={pipelineContextMock}>
        <TestWrapper path={PATH} pathParams={PATH_PARAMS}>
          <SaveTemplateButton {...baseProps} />
        </TestWrapper>
      </PipelineContext.Provider>
    )
    expect(container).toMatchSnapshot()
  })

  test('should open template save dialog on click', async () => {
    const { getByText } = render(
      <PipelineContext.Provider value={pipelineContextMock}>
        <TestWrapper path={PATH} pathParams={PATH_PARAMS}>
          <SaveTemplateButton {...baseProps} />
        </TestWrapper>
      </PipelineContext.Provider>
    )

    const saveAsTemplateBtn = getByText('common.saveAsTemplate')
    await act(async () => {
      fireEvent.click(saveAsTemplateBtn)
    })

    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValues: {
          ...DefaultTemplate,
          type: 'Stage',
          projectIdentifier: 'Milos2',
          orgIdentifier: 'CV',
          spec: stepTemplateMock.spec,
          repo: '',
          branch: ''
        }
      })
    )
    expect(findDialogContainer()).toBeDefined()
  })
})
