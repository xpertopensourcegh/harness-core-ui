import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { useHistory, useParams } from 'react-router-dom'
import { MenuItem } from '@blueprintjs/core'

import { Container, Icon, Text, Color, Button } from '@wings-software/uikit'
import { Select } from '@blueprintjs/select'
import type { StageOptions } from '@pipeline/components/ExecutionStageDiagram/ExecutionPipelineModel'
import routes from '@common/RouteDefinitions'

import type { ExecutionGraph } from 'services/cd-ng'
import type { ExecutionPathParams } from '@pipeline/utils/executionUtils'
import { useExecutionContext } from '../../ExecutionContext/ExecutionContext'
import LogsContent from './LogsContent'
import css from './ExecutionLogView.module.scss'
import 'xterm/css/xterm.css'

const statusIcon: {
  [key: string]: string
} = {
  Failed: 'deployment-failed-new',
  Suspended: 'cross',
  Aborted: 'stop',
  Success: 'deployment-success-legacy',
  Running: 'spinner'
}

interface Node {
  children: string[]
  next: string[]
  data: string
}
interface TreeProps {
  node: Node
  isRootNode: boolean
  level: number
}

export default function ExecutionLogView(): React.ReactElement {
  const {
    pipelineExecutionDetail,
    selectedStageId: autoSelectedStageId,
    pipelineStagesMap,
    queryParams
  } = useExecutionContext()
  const [selectedStageId, setStageId] = useState(autoSelectedStageId)
  const params = useParams<ExecutionPathParams>()
  const history = useHistory()
  useEffect(() => {
    setStageId(queryParams.stage || autoSelectedStageId)
  }, [autoSelectedStageId])

  if (!pipelineExecutionDetail) {
    return <div />
  }

  const { stageGraph } = pipelineExecutionDetail
  if (!stageGraph) {
    return <div />
  }
  const stagesOptions: StageOptions[] = [...pipelineStagesMap].map(item => ({
    label: item[1].stageName || /* istanbul ignore next */ '',
    value: item[1].stageIdentifier || /* istanbul ignore next */ ''
  }))

  const stageIds: any = []

  const getNodeDetails = (nodeId: string) => {
    const { nodeMap }: { nodeMap?: ExecutionGraph['nodeMap'] } = stageGraph
    if (!nodeMap) {
      return {}
    }
    return nodeMap[nodeId]
  }

  const getChildren = (nodeId: string) => {
    const { nodeAdjacencyListMap }: { nodeAdjacencyListMap?: ExecutionGraph['nodeAdjacencyListMap'] } = stageGraph
    if (!nodeAdjacencyListMap) {
      return []
    }
    return nodeAdjacencyListMap[nodeId].children
  }

  const getNextIds = (nodeId: string) => {
    const { nodeAdjacencyListMap }: { nodeAdjacencyListMap?: ExecutionGraph['nodeAdjacencyListMap'] } = stageGraph
    if (!nodeAdjacencyListMap) {
      return []
    }
    return nodeAdjacencyListMap[nodeId].nextIds
  }

  const renderTimeDiff = (node: any) => {
    const { startTs, endTs } = node

    if (startTs && endTs) {
      return <Text font="small">{moment(moment(node.endTs).diff(moment(node.startTs))).format('S')}s</Text>
    }
  }

  const renderNodeDetails = (nodeId: string) => {
    const rootNode = getNodeDetails(nodeId)
    if (!rootNode) {
      return <div />
    }

    const status: string = rootNode?.status || ''
    const icon: string = statusIcon[status]

    const attrs: any = rootNode?.status === 'Running' ? { color: 'blue500' } : {}
    return (
      <section className={`${css.node}`}>
        <div className={css.nodeInfo}>
          {<Icon name={icon} className={css.icon} {...attrs} />}
          <Text color={Color.BLACK}>{rootNode.name}</Text>
        </div>
        {renderTimeDiff(rootNode)}
      </section>
    )
  }

  const StageSelection = Select.ofType<StageOptions>()
  const renderRootNode = () => {
    // const rootNode = getNodeDetails(nodeId)
    return (
      <section>
        <StageSelection
          itemRenderer={(item, { handleClick }) => (
            <div>
              <MenuItem key={item.value.toString()} text={item?.label} onClick={handleClick} />
            </div>
          )}
          itemDisabled={item => {
            return item.disabled ?? false
          }}
          itemPredicate={(query, item, _index, exactMatch) => {
            const normalizedValue = item.value.toLowerCase()
            const normalizedQuery = query.toLowerCase()
            /* istanbul ignore if */ if (exactMatch) {
              return normalizedValue === normalizedQuery
            } else {
              return normalizedValue.indexOf(normalizedQuery) > -1
            }
          }}
          items={stagesOptions || /* istanbul ignore next */ []}
          onItemSelect={item => {
            const { value } = item
            setStageId(value)

            const { orgIdentifier, executionIdentifier, pipelineIdentifier, projectIdentifier, accountId } = params
            const logUrl = routes.toCDExecutionPiplineView({
              orgIdentifier,
              executionIdentifier,
              pipelineIdentifier,
              projectIdentifier,
              accountId
            })

            history.push(`${logUrl}?view=log&stage=${value}`)
          }}
        >
          <Button minimal rightIcon="chevron-down" text={selectedStageId} icon="geolocation" />
        </StageSelection>
      </section>
    )
  }

  const traverseNodeGraph = (activeNode = stageGraph?.rootNodeId, isRootNode = true) => {
    const index = stageIds.length

    if (activeNode) {
      stageIds[index] = {
        data: '',
        next: []
      }
      stageIds[index].data = activeNode
      stageIds[index].next = []
      stageIds[index].children = []

      const children = getChildren(activeNode)

      if (!isRootNode) {
        const nextIds = getNextIds(activeNode)
        if (nextIds && nextIds.length) {
          for (const id of nextIds) {
            stageIds[index].next.push(id)
            traverseNodeGraph(id, false)
          }
        }
      }

      if (children && children.length) {
        for (const child of children) {
          stageIds[index].children.push(child)
          traverseNodeGraph(child, false)
        }
      }
    }
    return null
  }
  if (!stageGraph) {
    return <div />
  }

  const getByStage = (id: string) => stageIds.find((stg: Node) => stg.data === id)

  const TreeNode = (props: TreeProps) => {
    const {
      node: { children, next, data },
      isRootNode,
      level
    } = props
    const rootCls = isRootNode ? css.rootNode : ''
    const childCls = level > 0 ? css.childNode : css.rootElement
    const treeCls = level === 0 ? css.rNode : ''
    return (
      <Container className={treeCls}>
        <ul className={childCls} key={data}>
          <li className={rootCls}>
            {!isRootNode && renderNodeDetails(data)}
            {isRootNode && renderRootNode()}
          </li>

          {children &&
            children.map((item: string) => (
              <TreeNode {...props} node={getByStage(item)} isRootNode={false} level={level + 1} key={item} />
            ))}
        </ul>
        {next &&
          next.map((item: string) => <TreeNode {...props} node={getByStage(item)} isRootNode={false} key={item} />)}
      </Container>
    )
  }
  if (stageGraph) {
    traverseNodeGraph()
    return (
      <Container className={css.logsContainer}>
        <TreeNode node={stageIds[0]} isRootNode={true} level={0} />

        <LogsContent />
      </Container>
    )
  }
  return <div />
}
