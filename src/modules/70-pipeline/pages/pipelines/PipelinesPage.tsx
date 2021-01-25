import React from 'react'
import { Button, Color, ExpandingSearchInput, Icon, Layout, Select, SelectOption, Text } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import {
  PagePMSPipelineSummaryResponse,
  ResponsePagePMSPipelineSummaryResponse,
  useGetPipelineList
} from 'services/pipeline-ng'
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

export enum Sort {
  DESC = 'DESC',
  ASC = 'ASC'
}

export enum SortFields {
  LastUpdatedAt = 'lastUpdatedAt',
  RecentActivity = 'executionSummaryInfo.lastExecutionTs',
  AZ09 = 'AZ09',
  ZA90 = 'ZA90',
  Name = 'name'
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
  const [sort, setStort] = React.useState<string[]>([SortFields.LastUpdatedAt, Sort.DESC])

  const sortOptions: SelectOption[] = [
    {
      label: getString('recentActivity'),
      value: SortFields.RecentActivity
    },
    {
      label: getString('lastUpdatedSort'),
      value: SortFields.LastUpdatedAt
    },
    {
      label: getString('AZ09'),
      value: SortFields.AZ09
    },
    {
      label: getString('ZA90'),
      value: SortFields.ZA90
    }
  ]
  // Set Default to LastUpdated
  const [selectedSort, setSelectedSort] = React.useState<SelectOption>(sortOptions[1])

  const [searchParam, setSearchParam] = React.useState('')
  const [data, setData] = React.useState<PagePMSPipelineSummaryResponse | undefined>()

  const { loading, mutate: reloadPipelines, error, cancel } = useGetPipelineList({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      module,
      orgIdentifier,
      searchTerm: searchParam,
      page,
      sort,
      size: 10
    },
    queryParamStringifyOptions: { arrayFormat: 'comma' },
    mock: mockData
  })

  const fetchPipelines = React.useCallback(async () => {
    cancel()
    setData(await (await reloadPipelines({ filterType: 'PipelineSetup' })).data)
  }, [reloadPipelines, cancel])

  React.useEffect(() => {
    cancel()
    fetchPipelines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, accountId, projectIdentifier, orgIdentifier, module, searchParam, sort])
  return (
    <>
      <Page.Header
        title={
          <Layout.Vertical spacing="xsmall">
            <Breadcrumbs
              links={[
                {
                  url: routes.toProjectOverview({ orgIdentifier, projectIdentifier, accountId, module }),
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
        retryOnError={/* istanbul ignore next */ () => fetchPipelines()}
        noData={{
          when: () => !data?.content?.length,
          icon: 'pipeline-ng',
          message: getString('pipeline-list.aboutPipeline'),
          buttonText: getString('addPipeline'),
          onClick: () => goToPipeline()
        }}
      >
        <Layout.Horizontal
          spacing="large"
          margin={{ left: 'xxlarge', top: 'large', bottom: 'large', right: 'xxlarge' }}
          className={css.topHeaderFields}
        >
          <Text color={Color.GREY_800} iconProps={{ size: 14 }}>
            {getString('total')}: {data?.totalElements}
          </Text>
          <Select
            items={sortOptions}
            value={selectedSort}
            className={css.sortSelector}
            onChange={item => {
              if (item.value === SortFields.AZ09) {
                setStort([SortFields.Name, Sort.ASC])
              } else if (item.value === SortFields.ZA90) {
                setStort([SortFields.Name, Sort.DESC])
              } else if (item.value === SortFields.LastUpdatedAt) {
                setStort([SortFields.LastUpdatedAt, Sort.DESC])
              } else if (item.value === SortFields.RecentActivity) {
                setStort([SortFields.RecentActivity, Sort.DESC])
              }
              setPage(0)
              setSelectedSort(item)
            }}
          />
        </Layout.Horizontal>
        {view === Views.GRID ? (
          <PipelineGridView
            gotoPage={/* istanbul ignore next */ pageNumber => setPage(pageNumber)}
            data={data}
            goToPipelineDetail={goToPipelineDetail}
            goToPipelineStudio={goToPipeline}
            refetchPipeline={fetchPipelines}
          />
        ) : (
          <PipelineListView
            gotoPage={/* istanbul ignore next */ pageNumber => setPage(pageNumber)}
            data={data}
            goToPipelineDetail={goToPipelineDetail}
            goToPipelineStudio={goToPipeline}
            refetchPipeline={fetchPipelines}
          />
        )}
      </Page.Body>
    </>
  )
}

export default PipelinesPage
