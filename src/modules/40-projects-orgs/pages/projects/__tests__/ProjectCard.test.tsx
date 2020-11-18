import React from 'react'
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ProjectCard from '@projects-orgs/components/ProjectCard/ProjectCard'
import { routeCVMainDashBoardPage } from 'navigation/cv/routes'
import { routeCDDashboard } from 'navigation/cd/routes'
import { routeCIDashboard } from 'navigation/ci/routes'
import { routeCFDashboard } from 'navigation/cf/routes'
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
    await fireEvent.click(cdrow!)
    await waitFor(() => getByTestId('location'))
    expect(
      getByTestId('location').innerHTML.endsWith(
        routeCDDashboard.url({
          orgIdentifier: projectWithModules.orgIdentifier,
          projectIdentifier: projectWithModules.identifier
        })
      )
    ).toBeTruthy()
  }),
    test('Click on CV', async () => {
      const cvrow = queryByText('VERIFICATIONS IN LAST 7 DAYS')
      await fireEvent.click(cvrow!)
      await waitFor(() => getByTestId('location'))
      expect(
        getByTestId('location').innerHTML.endsWith(
          routeCVMainDashBoardPage.url({
            orgIdentifier: projectWithModules.orgIdentifier,
            projectIdentifier: projectWithModules.identifier
          })
        )
      ).toBeTruthy()
    }),
    test('Click on CI', async () => {
      const cirow = queryByText('BUILDS IN LAST 7 DAYS')
      await fireEvent.click(cirow!)
      await waitFor(() => getByTestId('location'))
      expect(
        getByTestId('location').innerHTML.endsWith(
          routeCIDashboard.url({
            orgIdentifier: projectWithModules.orgIdentifier,
            projectIdentifier: projectWithModules.identifier
          })
        )
      ).toBeTruthy()
    }),
    test('Click on CF', async () => {
      expect(container).toMatchSnapshot()
      const cfrow = queryByText('TBD')
      await fireEvent.click(cfrow!)
      await waitFor(() => getByTestId('location'))
      expect(
        getByTestId('location').innerHTML.endsWith(
          routeCFDashboard.url({
            orgIdentifier: projectWithModules.orgIdentifier,
            projectIdentifier: projectWithModules.identifier
          })
        )
      ).toBeTruthy()
    })
})
