import React from 'react'
import { Text, Color, NestedAccordionProvider, useNestedAccordion } from '@wings-software/uicore'
import type { ITreeNode } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { stringify, parse } from 'yaml'
import { get, debounce } from 'lodash-es'

import type { StageElementWrapper, NgPipeline } from 'services/cd-ng'
import { useCreateVariables } from 'services/pipeline-ng'
import type { PipelinePathProps } from '@common/interfaces/RouteInterfaces'
import { PageSpinner } from '@common/components'
import { shouldShowError } from '@common/utils/errorUtils'

import { PageError } from '@common/components/Page/PageError'
import i18n from './PipelineVariables.i18n'
import { usePipelineContext } from '../PipelineContext/PipelineContext'
import { getPipelineTree } from '../PipelineUtils'
import StagesTree, { stagesTreeNodeClasses } from '../../StagesThree/StagesTree'
import PipelineCard from './Cards/PipelineCard'
import StageCard from './Cards/StageCard'
import type { PipelineVariablesData } from './types'

import css from './PipelineVariables.module.scss'

export const PipelineVariables: React.FC = (): JSX.Element => {
  const {
    updatePipeline,
    stepsFactory,
    state: { pipeline: originalPipeline }
  } = usePipelineContext()

  const { openNestedPath } = useNestedAccordion()
  const [initLoading, setInitLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [{ variablesPipeline, metadataMap }, setPipelineVariablesData] = React.useState<PipelineVariablesData>({
    variablesPipeline: { name: '', identifier: '' },
    metadataMap: {}
  })
  const [nodes, updateNodes] = React.useState<ITreeNode[]>([])
  const { accountId, orgIdentifier, projectIdentifier } = useParams<PipelinePathProps>()

  const [selectedTreeNodeId, setSelectedTreeNodeId] = React.useState<string>('Pipeline_Variables')
  const { mutate: createVariables } = useCreateVariables({
    pipelineIdentifier: '-1',
    requestOptions: {
      headers: {
        'content-type': 'application/yaml'
      }
    }
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchVariablesData = React.useCallback(
    debounce(async (pipeline: NgPipeline): Promise<void> => {
      try {
        setError(null)
        const { data } = await createVariables((stringify({ pipeline }) as unknown) as void, {
          queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
        })

        setPipelineVariablesData({
          metadataMap: data?.metadataMap || {},
          variablesPipeline: parse(data?.yaml || '')?.pipeline || {}
        })
        setInitLoading(false)
      } catch (e) {
        if (shouldShowError(e)) {
          setInitLoading(false)
          setError(e.data?.message || e.message)
        }
      }
    }, 300),
    [accountId, orgIdentifier, projectIdentifier]
  )

  React.useEffect(() => {
    updateNodes(getPipelineTree(originalPipeline, stagesTreeNodeClasses))
    fetchVariablesData(originalPipeline)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalPipeline])

  const stagesCards: JSX.Element[] = []
  /* istanbul ignore else */
  if (variablesPipeline.stages && variablesPipeline.stages?.length > 0) {
    variablesPipeline.stages.forEach((data, i) => {
      if (data.parallel && data.parallel.length > 0) {
        data.parallel.forEach((nodeP: StageElementWrapper, j: number) => {
          nodeP.stage &&
            stagesCards.push(
              <StageCard
                originalStage={get(originalPipeline, `stages[${i}].parallel[${j}].stage`)}
                key={nodeP.stage.identifier}
                stage={nodeP.stage}
                metadataMap={metadataMap}
              />
            )
        })
      } /* istanbul ignore else */ else if (data.stage) {
        stagesCards.push(
          <StageCard
            key={data.stage.identifier}
            stage={data.stage}
            originalStage={get(originalPipeline, `stages[${i}].stage`)}
            metadataMap={metadataMap}
          />
        )
      }
    })
  }

  function handleSelectionChange(id: string): void {
    setSelectedTreeNodeId(id)
    openNestedPath(id)

    document.getElementById(`${id}-panel`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (initLoading) return <PageSpinner />

  if (error) {
    return <PageError message={error} />
  }

  return (
    <div className={css.pipelineVariables}>
      <div className={css.variablesContainer}>
        <div className={css.header}>
          <Text font={{ size: 'medium' }}>{i18n.variables}</Text>
        </div>
        <div className={css.content}>
          <StagesTree
            className={css.stagesTree}
            contents={nodes}
            selectedId={selectedTreeNodeId}
            selectionChange={handleSelectionChange}
          />
          <div className={css.variableList}>
            <Text className={css.title} color={Color.BLACK}>
              {i18n.pipeline}
            </Text>
            <div className={css.variableListHeader}>
              <Text font={{ size: 'small' }}>{i18n.variables}</Text>
              <Text font={{ size: 'small' }}>{i18n.type}</Text>
              <Text font={{ size: 'small' }}>{i18n.values}</Text>
            </div>
            <PipelineCard
              pipeline={variablesPipeline}
              originalPipeline={originalPipeline}
              stepsFactory={stepsFactory}
              updatePipeline={updatePipeline}
              metadataMap={metadataMap}
            />
            {stagesCards}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PipelineVariablesWrapper(): React.ReactElement {
  return (
    <NestedAccordionProvider>
      <PipelineVariables />
    </NestedAccordionProvider>
  )
}
