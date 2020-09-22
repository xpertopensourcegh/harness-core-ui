import React from 'react'
import { Divider } from '@blueprintjs/core'
import { Container, Button, Intent, Icon, Layout, Select, Pagination } from '@wings-software/uikit'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { parse as parseQueryString } from 'query-string'
import { routeCIBuild, routeCIBuilds } from 'modules/ci/routes'
import { routePageNotFound } from 'modules/common/routes'
import { ExtendedPageHeader } from 'modules/ci/components/ExtendedPage/ExtendedPageHeader'
import { TitledInfo } from 'modules/ci/components/TitledInfo/TitledInfo'
import { BuildCard } from 'modules/ci/components/BuildCard/BuildCard'
import ExtendedPageBody from 'modules/ci/components/ExtendedPage/ExtendedPageBody'
import ExtendedPage from 'modules/ci/components/ExtendedPage/ExtendedPage'
import RightBar from 'modules/ci/components/RightBar/RightBar'
import { useGetBuilds } from 'modules/ci/services/BuildsService'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import i18n from './CIBuildsPage.i18n'
import css from './CIBuildsPage.module.scss'

interface BuildsPageUrlParams {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  branch: string
  page: string
}

const CIBuildsPage: React.FC = () => {
  const { accountId: accountIdentifier, orgIdentifier, projectIdentifier } = useParams<BuildsPageUrlParams>()
  const { search: queryParams } = useLocation()
  const { page } = parseQueryString(queryParams)
  const history = useHistory()
  const { data, loading, error } = useGetBuilds({
    queryParams: {
      accountIdentifier,
      orgIdentifier,
      projectIdentifier,
      page: (page ? page : '0') as string
    }
  })

  const navigateToPage = (gotoPage: number): void => {
    history.push(routeCIBuilds.url({ orgIdentifier, projectIdentifier }) + `?page=${gotoPage}`)
  }

  const navigateToBuild = (buildIdentifier: string): void => {
    history.push(routeCIBuild.url({ orgIdentifier, projectIdentifier, buildIdentifier }))
  }

  if (error) {
    // NOTE: use replace to remove last url which is not valid
    // TODO: should we handle error in a different way?
    history.replace(routePageNotFound.url())
    return null
  }

  const buildsData = data?.data

  // BUILDS HEADER
  const buildsHeader = (
    <>
      <Layout.Horizontal spacing="small">
        <Button>{i18n.myBuilds}</Button>
        <Button active={true}>{i18n.running}</Button>
        <Button>{i18n.failed}</Button>
      </Layout.Horizontal>
      <Layout.Horizontal spacing="small">
        <Select
          inputProps={{ placeholder: i18n.selectSavedFilter }}
          items={[
            { label: 'Saved filter 1', value: '1' },
            { label: 'Saved filter 2', value: '2' }
          ]}
        />
        <Button minimal>
          <Icon name="main-search" />
        </Button>
        <Button minimal>
          <Icon name="properties" />
        </Button>
      </Layout.Horizontal>
    </>
  )

  // BUILDS FOOTER
  const buildsFooter = buildsData && (
    <Pagination
      pageSize={buildsData?.pageSize}
      pageIndex={buildsData?.pageIndex}
      pageCount={buildsData?.pageCount}
      itemCount={buildsData?.itemCount}
      pageCountClamp={5}
      gotoPage={pageNumber => {
        navigateToPage(pageNumber)
      }}
      nextPage={pageNumber => {
        navigateToPage(pageNumber)
      }}
    />
  )

  // body content
  const builds = buildsData?.content.map((item, key) => (
    <BuildCard
      key={key}
      id={item.id}
      startTime={item.startTime}
      endTime={item.endTime}
      pipelineId={item.pipeline?.id}
      pipelineName={item.pipeline?.name}
      triggerType={item.triggerType}
      event={item.event}
      authorId={item.author?.id}
      avatar={item.author?.avatar}
      branchName={item?.branch?.name}
      branchLink={item?.branch?.link}
      commits={item?.branch?.commits}
      PRId={item?.pullRequest?.id}
      PRLink={item?.pullRequest?.link}
      PRTitle={item?.pullRequest?.body}
      PRBody={item?.pullRequest?.body}
      PRSourceBranch={item?.pullRequest?.sourceBranch}
      PRTargetBranch={item?.pullRequest?.targetBranch}
      PRState={item?.pullRequest?.state}
      onClick={(id: number) => {
        navigateToBuild(id.toString())
      }}
    />
  ))

  return (
    <Container className={css.main}>
      <ExtendedPage>
        <ExtendedPageHeader
          title={i18n.builds}
          toolbar={<Button intent={Intent.PRIMARY}>{i18n.newBuild}</Button>}
          rowOneContent={''}
          rowTwoContent={
            <>
              <TitledInfo maxWidth="auto" title="BUILD #" value="test-test/test-repo-1" href="https://harness.io" />
            </>
          }
        />
        <ExtendedPageBody className={css.builds}>
          <Container className={css.buildsHeader}>{buildsHeader}</Container>
          <Divider />
          <Container className={css.buildsBody}>
            <Container className={css.buildsBodyInner}>{builds}</Container>
          </Container>
          <Divider />
          <Container className={css.buildsFooter}>{buildsFooter}</Container>
        </ExtendedPageBody>
      </ExtendedPage>
      {loading && <PageSpinner />}
      <RightBar />
    </Container>
  )
}

export default CIBuildsPage
