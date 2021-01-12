import React from 'react'
import { Button, Color, ExpandingSearchInput, Icon, Layout, Text } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { ResponsePagePMSPipelineSummaryResponse, useGetPipelineList } from 'services/pipeline-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useAppStore, useStrings } from 'framework/exports'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { PipelineGridView } from './views/PipelineGridView'
import { PipelineListView } from './views/PipelineListView'
import css from './PipelinesPage.module.scss'

export enum Views {
  LIST,
  GRID
}

export interface CDPipelinesPageProps {
  mockData?: UseGetMockData<ResponsePagePMSPipelineSummaryResponse>
}

const PipelinesPage: React.FC<CDPipelinesPageProps> = ({ mockData }) => {
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId, module } = useParams<
    PipelineType<{
      projectIdentifier: string
      orgIdentifier: string
      accountId: string
    }>
  >()

  const { selectedProject } = useAppStore()
  const project = selectedProject

  const goToPipelineDetail = React.useCallback(
    (/* istanbul ignore next */ pipelineIdentifier = '-1') => {
      history.push(
        routes.toPipelineDetail({
          projectIdentifier,
          orgIdentifier,
          pipelineIdentifier,
          accountId,
          module
        })
      )
    },
    [projectIdentifier, orgIdentifier, history, accountId]
  )

  const goToPipeline = React.useCallback(
    (pipelineIdentifier = '-1') => {
      history.push(
        routes.toPipelineStudio({
          projectIdentifier,
          orgIdentifier,
          pipelineIdentifier,
          accountId,
          module
        })
      )
    },
    [projectIdentifier, orgIdentifier, history, accountId]
  )
  const [page, setPage] = React.useState(0)
  const [view, setView] = React.useState<Views>(Views.GRID)
  const { getString } = useStrings()

  let extraParam: { page?: number; size?: number } = {}
  if (extraParam && view === Views.LIST) {
    extraParam = {
      page,
      size: 10
    }
  }

  const [searchParam, setSearchParam] = React.useState('')

  const { loading, data, refetch: reloadPipelines, error } = useGetPipelineList({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      module,
      orgIdentifier,
      searchTerm: searchParam,
      ...extraParam
    },
    debounce: 300,
    mock: mockData
  })

  return (
    <>
      <Page.Header
        title={
          <Layout.Vertical spacing="xsmall">
            <Breadcrumbs
              links={[
                {
                  url: routes.toCDProjectOverview({ orgIdentifier, projectIdentifier, accountId }),
                  label: project?.name as string
                },
                { url: '#', label: getString('pipelines') }
              ]}
            />
            <Text font={{ size: 'medium' }} color={Color.GREY_700}>
              {getString('pipelines')}
            </Text>
          </Layout.Vertical>
        }
      />
      <Layout.Horizontal className={css.header} flex={{ distribution: 'space-between' }}>
        <Layout.Horizontal>
          <Button
            intent="primary"
            data-testid="add-pipeline"
            text={getString('addPipeline')}
            onClick={() => goToPipeline()}
          />
        </Layout.Horizontal>
        <Layout.Horizontal spacing="small" style={{ alignItems: 'center' }}>
          {/* remove condition once CI starts supporting search and filters*/}
          {module === 'cd' && (
            <>
              <div className={css.expandSearch}>
                <ExpandingSearchInput
                  placeholder={getString('search')}
                  throttle={200}
                  onChange={(text: string) => {
                    setSearchParam(text)
                  }}
                />
              </div>
              <Icon name="ng-filter" size={24} />
            </>
          )}
          <Layout.Horizontal inline padding="medium">
            <Button
              minimal
              icon="grid-view"
              intent={view === Views.GRID ? 'primary' : 'none'}
              onClick={() => {
                setView(Views.GRID)
              }}
            />
            <Button
              minimal
              icon="list"
              intent={view === Views.LIST ? 'primary' : 'none'}
              onClick={() => {
                setView(Views.LIST)
              }}
            />
          </Layout.Horizontal>
        </Layout.Horizontal>
      </Layout.Horizontal>
      <Page.Body
        loading={loading}
        className={css.pageBody}
        error={error?.message}
        retryOnError={/* istanbul ignore next */ () => reloadPipelines()}
        noData={{
          when: () => !data?.data?.content?.length,
          icon: 'pipeline-ng',
          message: getString('pipeline-list.aboutPipeline'),
          buttonText: getString('addPipeline'),
          onClick: () => goToPipeline()
        }}
      >
        {view === Views.GRID ? (
          <PipelineGridView
            gotoPage={/* istanbul ignore next */ pageNumber => setPage(pageNumber)}
            data={data?.data}
            goToPipelineDetail={goToPipelineDetail}
            goToPipelineStudio={goToPipeline}
            refetchPipeline={reloadPipelines}
          />
        ) : (
          <PipelineListView
            gotoPage={/* istanbul ignore next */ pageNumber => setPage(pageNumber)}
            data={data?.data}
            goToPipelineDetail={goToPipelineDetail}
            goToPipelineStudio={goToPipeline}
            refetchPipeline={reloadPipelines}
          />
        )}
      </Page.Body>
    </>
  )
}

export default PipelinesPage
