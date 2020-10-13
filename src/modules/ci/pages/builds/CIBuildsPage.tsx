import React, { useEffect, useState } from 'react'
import { first } from 'lodash-es'
import cx from 'classnames'
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
import { useGetBuilds } from 'services/ci'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { graph2ExecutionPipeline } from '../build/utils/api2ui'
import i18n from './CIBuildsPage.i18n'
import css from './CIBuildsPage.module.scss'
import common from '../ci-common.module.scss'

interface BuildsPageUrlParams {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  branch: string
  page: string
}

const CIBuildsPage: React.FC = () => {
  const { orgIdentifier, projectIdentifier, accountId } = useParams<BuildsPageUrlParams>()
  const { search: queryParams } = useLocation()
  const { page } = parseQueryString(queryParams)
  const history = useHistory()
  const { data, loading, error, refetch } = useGetBuilds({
    queryParams: {
      // TODO: HARDCODED FOR DEMO
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      page: (page ? page : 0) as number,
      // TODO: to consider, should we allow user to sort
      sort: ['buildNumber', 'desc']
    }
  })

  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (!isRendered && !loading) {
      setIsRendered(true)
    }
  }, [loading])

  // load data every 5 seconds
  useEffect(() => {
    const reloadInterval = setInterval(() => {
      refetch()
    }, 5000)

    return function () {
      clearInterval(reloadInterval)
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
        <Button margin={{ right: 'large' }}>{i18n.myBuilds}</Button>
        <Button>{i18n.running}</Button>
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
  const buildsFooter =
    (buildsData && buildsData.totalItems) ||
    (0 > 0 && (
      <Pagination
        pageSize={buildsData?.pageSize || 0}
        pageIndex={buildsData?.pageIndex}
        pageCount={buildsData?.totalPages || 0}
        itemCount={buildsData?.totalItems || 0}
        pageCountClamp={5}
        gotoPage={pageNumber => {
          navigateToPage(pageNumber)
        }}
        nextPage={pageNumber => {
          navigateToPage(pageNumber)
        }}
      />
    ))

  // body content
  const builds = buildsData?.content?.map((item, key) => (
    <BuildCard
      status={item.graph?.status || ''}
      key={key}
      id={item.id as number}
      startTime={item.graph?.startTs || 0}
      endTime={item.graph?.endTs || 0}
      pipelineId={item.pipeline?.id}
      pipelineName={item.pipeline?.name}
      triggerType={item.triggerType || ''}
      event={(item.event as 'branch') || 'pull_request'}
      authorId={item.author?.id}
      avatar={item.author?.avatar}
      branchName={item?.branch?.name}
      branchLink={item?.branch?.link}
      commits={item?.branch?.commits}
      PRId={item?.pullRequest?.id}
      PRLink={item?.pullRequest?.link || ''}
      PRTitle={item?.pullRequest?.body}
      PRBody={item?.pullRequest?.body}
      PRSourceBranch={item?.pullRequest?.sourceBranch}
      PRTargetBranch={item?.pullRequest?.targetBranch}
      PRState={item?.pullRequest?.state}
      pipeline={graph2ExecutionPipeline(item?.graph)}
      onClick={(id: number) => {
        navigateToBuild(id.toString())
      }}
    />
  ))

  return (
    <Container className={cx(common.main, css.main)}>
      <ExtendedPage>
        <ExtendedPageHeader
          title={i18n.builds}
          toolbar={<Button intent={Intent.PRIMARY}>{i18n.newBuild}</Button>}
          rowOneContent={''}
          rowTwoContent={
            <>
              <TitledInfo
                maxWidth="auto"
                title={i18n.gitRepository}
                value={first(buildsData?.content)?.branch?.link}
                href={first(buildsData?.content)?.branch?.link}
              />
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
      {!isRendered && loading && <PageSpinner />}
      <RightBar />
    </Container>
  )
}

export default CIBuildsPage
