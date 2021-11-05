import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { TemplateType } from '@templates-library/utils/templatesUtils'
import { useMutateAsGet } from '@common/hooks'
import routes from '@common/RouteDefinitions'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import { mockTemplatesSuccessResponse } from '@templates-library/TemplatesTestHelper'
import { TemplateSelector } from '../TemplateSelector'

jest.mock('@common/components/YAMLBuilder/YamlBuilder')
jest.mock('@wings-software/monaco-yaml/lib/esm/languageservice/yamlLanguageService', () => ({
  getLanguageService: jest.fn()
}))

jest.mock('@common/hooks', () => ({
  ...(jest.requireActual('@common/hooks') as any),
  useMutateAsGet: jest.fn()
}))

const TEST_PATH = routes.toPipelineStudio({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })
const pathParams = {
  accountId: 'TEST_ACCOUNT_ID',
  orgIdentifier: 'TEST_ORG',
  projectIdentifier: 'TEST_PROJECT',
  pipelineIdentifier: 'TEST_PIPELINE',
  executionIdentifier: 'TEST_EXECUTION',
  module: 'cd',
  stageId: 'selectedStageId'
}

describe('<TemplateSelector /> tests', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    // @ts-ignore
    useMutateAsGet.mockReturnValue(mockTemplatesSuccessResponse)
  })
  test('snapshot test', async () => {
    const { container } = render(
      <TestWrapper path={TEST_PATH} pathParams={pathParams} defaultAppStoreValues={{ isGitSyncEnabled: false }}>
        <TemplateSelector templateType={TemplateType.Step} childTypes={['Http']} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
