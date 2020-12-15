import React, { useEffect } from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { YamlBuilderProps } from '@common/interfaces/YAMLBuilderProps'
import * as mockSchemaData from '@common/services/mocks/schema.json'
import CreateSecretFromYamlPage from '../CreateSecretFromYamlPage'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ bind }: YamlBuilderProps) => {
  useEffect(() => {
    bind?.({
      getLatestYaml: () => 'name: test',
      getYAMLValidationErrorMap: () => new Map()
    })
  }, [])

  return 'dummy'
})

describe('CreateSecretFromYamlPage', () => {
  test('render', () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/create-secret-from-yaml" pathParams={{ accountId: 'dummy' }}>
        <CreateSecretFromYamlPage mockSchemaData={mockSchemaData as any} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('Create'))
    })
  })
})
