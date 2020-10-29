import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Divider } from '@blueprintjs/core'
import { Container, Button, Icon, Layout, Select, Pagination, Heading, Text, Card, Link } from '@wings-software/uikit'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { parse as parseQueryString } from 'query-string'
import { routeCIBuild, routeCIBuilds } from 'navigation/ci/routes'
import { ExtendedPageHeader } from '@ci/components/ExtendedPage/ExtendedPageHeader'
import { BuildCard } from '@ci/components/BuildCard/BuildCard'
import ExtendedPageBody from '@ci/components/ExtendedPage/ExtendedPageBody'
import ExtendedPage from '@ci/components/ExtendedPage/ExtendedPage'
import RightBar from '@ci/components/RightBar/RightBar'
import { useGetBuilds } from 'services/ci'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { graph2ExecutionPipeline } from '../build/utils/api2ui'
import i18n from './CIBuildsPage.i18n'
import image from './images/image.jpg'
import pipeline from './images/pipeline.svg'
import triggers from './images/triggers.svg'
import manualExecution from './images/manual-execution.svg'
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
    return null
  }

  if (loading) {
    return null
  }

  const buildsData = data?.data

  // BUILDS HEADER
  const buildsHeader = (
    <>
      <Layout.Horizontal spacing="small">
        <Button round margin={{ right: 'large' }}>
          {i18n.myBuilds}
        </Button>
        <Button round>{i18n.running}</Button>
        <Button round>{i18n.failed}</Button>
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
        <ExtendedPageHeader title={i18n.builds} rowOneContent="" rowTwoContent="" />
        {buildsData ? (
          <ExtendedPageBody className={css.builds}>
            <Container className={css.buildsHeader}>{buildsHeader}</Container>
            <Divider />
            <Container className={css.buildsBody}>
              <Container className={css.buildsBodyInner}>{builds}</Container>
            </Container>
            <Divider />
            <Container className={css.buildsFooter}>{buildsFooter}</Container>
          </ExtendedPageBody>
        ) : (
          <ExtendedPageBody className={css.emptyBuilds}>
            <div className={css.emptyBuildsContent}>
              <img className={css.emptyBuildsImage} src={image} alt="" aria-hidden />
              <Heading
                className={css.emptyBuildsTitle}
                level={2}
                font={{ size: 'medium', align: 'center', weight: 'semi-bold' }}
                margin={{ bottom: 'large' }}
              >
                {i18n.emptyBuildsTitle}
              </Heading>
              <Text
                className={css.emptyBuildsText1}
                font={{ size: 'normal', align: 'center' }}
                margin={{ bottom: 'medium' }}
                style={{ opacity: 0.6 }}
              >
                {i18n.emptyBuildsText1}
              </Text>
              <Text
                className={css.emptyBuildsText2}
                font={{ size: 'small', align: 'center' }}
                width={520}
                margin={{ bottom: 'xlarge' }}
              >
                {i18n.emptyBuildsText2}
              </Text>
              <Button intent="primary" margin={{ bottom: 'huge' }}>
                {i18n.emptyBuildsButtonText}
              </Button>
            </div>
            <Divider className={css.emptyBuildsDivider} />
            <Heading
              className={css.conceptsTitle}
              level={2}
              font={{ size: 'normal', weight: 'bold' }}
              margin={{ top: 'xxlarge', bottom: 'large' }}
            >
              {i18n.conceptsTitle}
            </Heading>
            <Layout.Horizontal spacing="xxxlarge">
              <Card className={css.conceptCard}>
                <img className={css.conceptCardIcon} src={pipeline} alt="" aria-hidden />
                <div>
                  <Heading
                    className={css.conceptCardTitle}
                    level={3}
                    font={{ size: 'normal', weight: 'bold' }}
                    margin={{ bottom: 'xsmall' }}
                  >
                    {i18n.concept1Title}
                  </Heading>
                  <Text
                    className={css.conceptCardSubtitle}
                    font={{ size: 'xsmall', weight: 'semi-bold' }}
                    margin={{ bottom: 'xsmall' }}
                  >
                    {i18n.concept1Subtitle}
                  </Text>
                  <Text className={css.conceptCardDescription} font="xsmall" margin={{ bottom: 'small' }}>
                    {i18n.concept1Description}
                  </Text>
                  <Link font={{ size: 'xsmall', weight: 'semi-bold' }} href="/">
                    {i18n.concept1FooterText}
                  </Link>
                </div>
              </Card>
              <Card className={css.conceptCard}>
                <img className={css.conceptCardIcon} src={triggers} alt="" aria-hidden />
                <div>
                  <Heading
                    className={css.conceptCardTitle}
                    level={3}
                    font={{ size: 'normal', weight: 'bold' }}
                    margin={{ bottom: 'xsmall' }}
                  >
                    {i18n.concept2Title}
                  </Heading>
                  <Text
                    className={css.conceptCardSubtitle}
                    font={{ size: 'xsmall', weight: 'semi-bold' }}
                    margin={{ bottom: 'xsmall' }}
                  >
                    {i18n.concept2Subtitle}
                  </Text>
                  <Text className={css.conceptCardDescription} font="xsmall" margin={{ bottom: 'small' }}>
                    {i18n.concept2Description}
                  </Text>
                  <Link font={{ size: 'xsmall', weight: 'semi-bold' }} href="/">
                    {i18n.concept2FooterText}
                  </Link>
                </div>
              </Card>
              <Card className={css.conceptCard}>
                <img className={css.conceptCardIcon} src={manualExecution} alt="" aria-hidden />
                <div>
                  <Heading
                    className={css.conceptCardTitle}
                    level={3}
                    font={{ size: 'normal', weight: 'bold' }}
                    margin={{ bottom: 'xsmall' }}
                  >
                    {i18n.concept3Title}
                  </Heading>
                  <Text
                    className={css.conceptCardSubtitle}
                    font={{ size: 'xsmall', weight: 'semi-bold' }}
                    margin={{ bottom: 'xsmall' }}
                  >
                    {i18n.concept3Subtitle}
                  </Text>
                  <Text className={css.conceptCardDescription} font="xsmall" margin={{ bottom: 'small' }}>
                    {i18n.concept3Description}
                  </Text>
                  <Link font={{ size: 'xsmall', weight: 'semi-bold' }} href="/">
                    {i18n.concept3FooterText}
                  </Link>
                </div>
              </Card>
            </Layout.Horizontal>
          </ExtendedPageBody>
        )}
      </ExtendedPage>
      {!isRendered && loading && <PageSpinner />}
      <RightBar />
    </Container>
  )
}

export default CIBuildsPage
