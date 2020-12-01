import React from 'react'
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ProjectCard from '@projects-orgs/components/ProjectCard/ProjectCard'
import routes from '@common/RouteDefinitions'
import { defaultAppStoreValues, project } from './DefaultAppStoreData'
import { projectWithModules } from './ProjectPageMock'

describe('Project Card test', () => {
  test('initializes ok ', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectCard data={project} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  }),
    test('Preview is ok', async () => {
      const { container } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <ProjectCard data={projectWithModules} isPreview={true} />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
    })
})

describe('Project Card Functionality Test', () => {
  let container: HTMLElement
  let queryByText: RenderResult['queryByText']
  let getByTestId: RenderResult['getByTestId']

  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectCard data={projectWithModules} />
      </TestWrapper>
    )
    container = renderObj.container
    queryByText = renderObj.queryByText
    getByTestId = renderObj.getByTestId
  })
  test('Click on CD', async () => {
    expect(container).toMatchSnapshot()
    const cdrow = queryByText('DEPLOYMENTS IN LAST 7 DAYS')
    fireEvent.click(cdrow!)
    await waitFor(() => getByTestId('location'))
    expect(
      getByTestId('location').innerHTML.endsWith(
        routes.toCDDashboard({
          accountId: 'testAcc',
          orgIdentifier: projectWithModules.orgIdentifier!,
          projectIdentifier: projectWithModules.identifier
        })
      )
    ).toBeTruthy()
  }),
    test('Click on CV', async () => {
      const cvrow = queryByText('VERIFICATIONS IN LAST 7 DAYS')
      fireEvent.click(cvrow!)
      await waitFor(() => getByTestId('location'))
      expect(
        getByTestId('location').innerHTML.endsWith(
          routes.toCVMainDashBoardPage({
            accountId: 'testAcc',
            orgIdentifier: projectWithModules.orgIdentifier,
            projectIdentifier: projectWithModules.identifier
          })
        )
      ).toBeTruthy()
    }),
    test('Click on CI', async () => {
      const cirow = queryByText('BUILDS IN LAST 7 DAYS')
      fireEvent.click(cirow!)
      await waitFor(() => getByTestId('location'))
      expect(
        getByTestId('location').innerHTML.endsWith(
          routes.toCIDashboard({
            accountId: 'testAcc',
            orgIdentifier: projectWithModules.orgIdentifier!,
            projectIdentifier: projectWithModules.identifier
          })
        )
      ).toBeTruthy()
    }),
    test('Click on CF', async () => {
      expect(container).toMatchSnapshot()
      const cfrow = queryByText('TBD')
      fireEvent.click(cfrow!)
      await waitFor(() => getByTestId('location'))
      expect(
        getByTestId('location').innerHTML.endsWith(
          routes.toCFDashboard({
            accountId: 'testAcc',
            orgIdentifier: projectWithModules.orgIdentifier!,
            projectIdentifier: projectWithModules.identifier
          })
        )
      ).toBeTruthy()
    })
})
