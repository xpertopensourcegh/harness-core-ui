import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { MinimalLayout, EmptyLayout } from '@common/layouts'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'
import { RouteWithLayout } from './RouteWithLayout'

describe('RouteWithLayout', () => {
  test('empty', () => {
    const { container, getByText } = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'dummy' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <RouteWithLayout layout={EmptyLayout} path="/account/:accountId/projects">
          <div>matched-route</div>
        </RouteWithLayout>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
    expect(getByText('matched-route')).toBeTruthy()
  })

  test('minimal', () => {
    const { container, getByText } = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'dummy' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <RouteWithLayout layout={MinimalLayout} path="/account/:accountId/projects">
          <div>matched-route</div>
        </RouteWithLayout>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
    expect(getByText('matched-route')).toBeTruthy()
  })

  test('basic', () => {
    const SideNav = () => <div>sidenav</div>

    const { container, getByText } = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'dummy' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <RouteWithLayout
          sidebarProps={{ navComponent: SideNav, title: 'TITLE', subtitle: 'SUBTITLE' }}
          path="/account/:accountId/projects"
        >
          <div>matched-route</div>
        </RouteWithLayout>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
    expect(getByText('matched-route')).toBeTruthy()
    expect(getByText('sidenav')).toBeTruthy()
    expect(getByText('TITLE')).toBeTruthy()
    expect(getByText('SUBTITLE')).toBeTruthy()
  })
})
