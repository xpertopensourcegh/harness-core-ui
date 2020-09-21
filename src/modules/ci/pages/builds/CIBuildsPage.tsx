import React, { useEffect, useState } from 'react'
import { Divider } from '@blueprintjs/core'
import { Container, Button, Intent, Icon, Layout, Select, Pagination } from '@wings-software/uikit'
import { Link } from 'react-router-dom'
import { routeCIBuild } from 'modules/ci/routes'
import { ExtendedPageHeader } from 'modules/ci/components/ExtendedPage/ExtendedPageHeader'
import { TitledInfo } from 'modules/ci/components/TitledInfo/TitledInfo'
import { BuildCard } from 'modules/ci/components/BuildCard/BuildCard'
import ExtendedPageBody from 'modules/ci/components/ExtendedPage/ExtendedPageBody'
import ExtendedPage from 'modules/ci/components/ExtendedPage/ExtendedPage'
import RightBar from 'modules/ci/components/RightBar/RightBar'
import { fetchBuilds } from 'modules/ci/services/BuildsService'
import type { BuildsData } from 'modules/ci/services/Types'
import i18n from './CIBuildsPage.i18n'
import css from './CIBuildsPage.module.scss'

const CDHomePage: React.FC = () => {
  const [buildsData, setBuildsData] = useState<BuildsData>({
    content: [],
    pageable: {
      offset: 0,
      pageNumber: 1,
      pageSize: 10,
      paged: false,
      unpaged: false,
      sort: {
        unsorted: false,
        sorted: true,
        empty: false
      }
    },
    totalPages: 0,
    totalElements: 0,
    last: true,
    size: 0,
    number: 0,
    first: true,
    numberOfElements: 0,
    empty: true,
    sort: {
      unsorted: false,
      sorted: true,
      empty: false
    }
  })

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const result = await fetchBuilds()
      setBuildsData(result.data)
    }

    fetchData()
  })

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
  const buildsFooter = (
    <Pagination
      pageSize={buildsData?.size}
      pageIndex={buildsData?.number}
      pageCount={buildsData?.totalPages}
      itemCount={buildsData?.numberOfElements}
      pageCountClamp={5}
      gotoPage={pageNumber => {
        alert(pageNumber)
      }}
      nextPage={pageNumber => {
        alert(pageNumber)
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
      pipelineId={item.pipeline.id}
      pipelineName={item.pipeline.name}
      triggerType={item.triggerType}
      event={item.event}
      authorId={item.author.id}
      avatar={item.author.avatar}
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
              <Link to={routeCIBuild.url({ projectIdentifier: 'Brad_CI', buildIdentifier: '123' })}>
                Go to build page (temporary link)
              </Link>
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
      <RightBar />
    </Container>
  )
}

export default CDHomePage
