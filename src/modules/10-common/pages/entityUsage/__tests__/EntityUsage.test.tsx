import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, secretPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import EntityUsage from '../EntityUsage'
import referencedData from './entity-usage-data.json'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Entity Usage', () => {
  test('render for no data', async () => {
    const { container } = render(
      <TestWrapper
        path={routes.toResourcesSecretDetailsReferences({ ...accountPathProps, ...secretPathProps })}
        pathParams={{ accountId: 'dummy', secretId: 'secretId' }}
      >
        <EntityUsage
          mockData={{
            data: {} as any,
            loading: false
          }}
          entityIdentifier="secretId"
          entityType="Secrets"
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'entityReference.noRecordFound'))
    expect(container).toMatchSnapshot()
  })
  test('render for data', async () => {
    const { container } = render(
      <TestWrapper
        path={routes.toResourcesSecretDetailsReferences({ ...accountPathProps, ...secretPathProps })}
        pathParams={{ accountId: 'dummy', secretId: 'secretId' }}
      >
        <EntityUsage
          mockData={{
            data: referencedData as any,
            loading: false
          }}
          entityIdentifier="secretId"
          entityType="Secrets"
        />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
