import React from 'react'
import { Button, Layout, TextInput, Text, Popover } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import { Menu, Position, MenuItem } from '@blueprintjs/core'
import { Page } from '@common/exports'
import { routeCDPipelineStudio, routePipelineDetail } from 'navigation/cd/routes'
import { ResponsePageNGPipelineSummaryResponse, useGetPipelineList } from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import i18n from './CDPipelinesPage.i18n'
import { PipelineGridView } from './views/PipelineGridView'
import { PipelineListView } from './views/PipelineListView'
import css from './CDPipelinesPage.module.scss'

export enum Views {
  LIST,
  GRID
}

export interface CDPipelinesPageProps {
  mockData?: UseGetMockData<ResponsePageNGPipelineSummaryResponse>
}

const CDPipelinesPage: React.FC<CDPipelinesPageProps> = ({ mockData }) => {
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const goToPipelineDetail = React.useCallback(
    (/* istanbul ignore next */ pipelineIdentifier = '-1') => {
      history.push(
        routePipelineDetail.url({
          projectIdentifier,
          orgIdentifier,
          pipelineIdentifier
        })
      )
    },
    [projectIdentifier, orgIdentifier, history]
  )

  const goToPipeline = React.useCallback(
    (pipelineIdentifier = '-1') => {
      history.push(
        routeCDPipelineStudio.url({
          projectIdentifier,
          orgIdentifier,
          pipelineIdentifier
        })
      )
    },
    [projectIdentifier, orgIdentifier, history]
  )
  const [page, setPage] = React.useState(0)
  const [view, setView] = React.useState<Views>(Views.GRID)

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
      orgIdentifier,
      searchTerm: searchParam,
      ...extraParam
    },
    debounce: 300,
    mock: mockData
  })

  const [filterTag, setFilterTag] = React.useState(i18n.tags)
  return (
    <>
      <Page.Header
        title={i18n.pipelines.toUpperCase()}
        toolbar={
          <Layout.Horizontal spacing="small" style={{ alignItems: 'center' }}>
            <TextInput
              leftIcon="search"
              placeholder={i18n.searchByUser}
              className={css.search}
              value={searchParam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchParam(e.target.value.trim())
              }}
            />
            <Text>{i18n.filterBy}</Text>
            <Popover
              minimal
              content={
                <Menu>
                  <MenuItem
                    text={i18n.tags}
                    onClick={
                      /* istanbul ignore next */ () => {
                        setFilterTag(i18n.tags)
                      }
                    }
                  />
                  {/* TODO: Change with actual API */}
                  <MenuItem
                    text="Tag 1"
                    onClick={
                      /* istanbul ignore next */ () => {
                        setFilterTag('Tag 1')
                      }
                    }
                  />
                  <MenuItem
                    text="Tag 2"
                    onClick={
                      /* istanbul ignore next */ () => {
                        setFilterTag('Tag 2')
                      }
                    }
                  />
                </Menu>
              }
              position={Position.BOTTOM}
            >
              <Button minimal text={filterTag} rightIcon="caret-down" />
            </Popover>
            <span className={css.separator} />
            <Button
              minimal
              intent="primary"
              data-testid="add-pipeline"
              text={i18n.addPipeline}
              icon="add"
              onClick={() => goToPipeline()}
            />
            <span className={css.separator} />
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
        }
      />
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={/* istanbul ignore next */ () => reloadPipelines()}
        noData={{
          when: () => !data?.data?.content?.length,
          icon: 'pipeline-ng',
          message: i18n.aboutPipeline,
          buttonText: i18n.addPipeline,
          onClick: () => goToPipeline()
        }}
      >
        {view === Views.GRID ? (
          <PipelineGridView
            pipelineList={data?.data?.content || /* istanbul ignore next */ []}
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

export default CDPipelinesPage
