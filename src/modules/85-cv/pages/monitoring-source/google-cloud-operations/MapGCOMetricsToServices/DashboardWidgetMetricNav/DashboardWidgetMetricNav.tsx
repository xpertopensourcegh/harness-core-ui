import React, { useEffect, useState } from 'react'
import { Color, Container, Link, Text } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Classes, ITreeNode, Tree } from '@blueprintjs/core'
import { useToaster } from '@common/exports'
import { PageSpinner } from '@common/components'
import { String, useStrings } from 'framework/exports'
import { StackdriverDashboardDetail, StackdriverDashboardDTO, useGetStackdriverDashboardDetail } from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { ManualInputQueryModal, MANUAL_INPUT_QUERY } from '../../ManualInputQueryModal/ManualInputQueryModal'
import css from './DashboardWidgetMetricNav.module.scss'

export interface DashboardWidgetMetricNavProps {
  className?: string
  gcoDashboards: StackdriverDashboardDTO[]
  manuallyInputQueries?: string[]
  connectorIdentifier: string
  onSelectMetric: (selectedMetric: string, query: string, widgetName: string) => void
  showSpinnerOnLoad?: boolean
}

interface TreeNodeLabelProps {
  width: number
  label: string | JSX.Element
}

const NodeDepth = {
  METRIC: 3,
  WIDGET: 2,
  DASHBOARD: 1
}
const LabelWidth = {
  FIRST_LEVEL: 192,
  SECOND_LEVEL: 170,
  THIRD_LEVEL: 140
}

const NodeType = {
  MANUAL_INPUT_METRIC: 'ManuallyInputQueryMetric',
  MANUAL_INPUT_QUERY: 'ManuualyInputQuery',
  DASHBOARD: 'Dashboard',
  WIDGET: 'Widget',
  GCO_METRIC: 'GCOMetric'
}

const LoadingSkeleton = [
  {
    id: 1,
    isExpanded: true,
    disabled: true,
    label: <Container className={Classes.SKELETON} width={177} height={15} />,
    childNodes: [
      { id: 2, label: <Container className={Classes.SKELETON} width={155} height={15} /> },
      { id: 3, label: <Container className={Classes.SKELETON} width={155} height={15} /> },
      {
        id: 4,
        label: <Container className={Classes.SKELETON} width={155} height={15} />
      }
    ]
  },
  {
    id: 2,
    isExpanded: false,
    disabled: true,
    label: <Container className={Classes.SKELETON} width={177} height={15} />,
    hasCaret: true
  }
]

type NodeDataType = {
  type: string
  data?: any
}

function initializeSelectedMetric(
  manuallyInputQueries?: string[],
  gcoDashboards?: StackdriverDashboardDTO[]
): ITreeNode | undefined {
  if (gcoDashboards?.length || !manuallyInputQueries?.length) {
    return
  }

  return {
    id: manuallyInputQueries[0],
    hasCaret: false,
    label: (
      <Text color={Color.BLACK} width={170} lineClamp={1} className={css.textOverflow}>
        {manuallyInputQueries[0]}
      </Text>
    )
  }
}

function generateTreeNode(type: string, data: any, id: string, isExpanded?: boolean): ITreeNode<NodeDataType> {
  switch (type) {
    case NodeType.DASHBOARD:
      return {
        id,
        hasCaret: true,
        label: <TreeNodeLabel width={LabelWidth.FIRST_LEVEL} label={id} />,
        childNodes: [],
        nodeData: {
          data,
          type: NodeType.DASHBOARD
        }
      }
    case NodeType.WIDGET:
      return {
        id: id,
        hasCaret: true,
        isExpanded: isExpanded,
        label: <TreeNodeLabel width={LabelWidth.SECOND_LEVEL} label={id} />,
        childNodes: [],
        nodeData: {
          type: NodeType.WIDGET
        }
      }
    case NodeType.GCO_METRIC:
      return {
        id: id,
        label: <TreeNodeLabel width={LabelWidth.THIRD_LEVEL} label={id} />,
        hasCaret: false,
        isExpanded: false,
        nodeData: {
          data,
          type: NodeType.GCO_METRIC
        }
      }
    case NodeType.MANUAL_INPUT_QUERY:
      return {
        id: MANUAL_INPUT_QUERY,
        hasCaret: true,
        label: (
          <TreeNodeLabel
            width={LabelWidth.FIRST_LEVEL}
            label={<String stringID="cv.monitoringSources.gco.mapMetricsToServicesPage.manuallyInputQueriesLabel" />}
          />
        ),
        childNodes: [],
        nodeData: {
          type: NodeType.MANUAL_INPUT_QUERY
        }
      }
    case NodeType.MANUAL_INPUT_METRIC:
    default:
      return {
        id,
        hasCaret: false,
        label: <TreeNodeLabel width={LabelWidth.SECOND_LEVEL} label={id} />,
        childNodes: [],
        nodeData: {
          type: NodeType.MANUAL_INPUT_METRIC
        }
      }
  }
}

function transformDashboardsToTreeNodes(
  gcoDashboards: StackdriverDashboardDTO[],
  manuallyInputQueries: string[]
): ITreeNode<NodeDataType>[] {
  if (!gcoDashboards?.length && !manuallyInputQueries?.length) {
    return []
  }
  const treeNodes: ITreeNode<NodeDataType>[] = []

  for (const dashboard of gcoDashboards || []) {
    if (dashboard?.name && dashboard.path) {
      treeNodes.push(generateTreeNode(NodeType.DASHBOARD, dashboard.path, dashboard.name))
    }
  }

  // create manually input queries tree node
  treeNodes.unshift(generateTreeNode(NodeType.MANUAL_INPUT_QUERY, undefined, MANUAL_INPUT_QUERY))

  // insert all manual metrics into manually input queries node
  for (const metric of manuallyInputQueries || []) {
    if (metric) {
      treeNodes[0]?.childNodes?.push(generateTreeNode(NodeType.MANUAL_INPUT_METRIC, undefined, metric))
    }
  }

  // by default preselect a dashboard from google
  if (treeNodes[1]) {
    treeNodes[1].isExpanded = true
    treeNodes[1].childNodes = LoadingSkeleton
  }

  return treeNodes
}

function transformWidgetsToTreeNodes(
  gcoWidgets: StackdriverDashboardDetail[],
  isFirstLoad: boolean
): { treeNodes: ITreeNode<NodeDataType>[]; selectedMetric?: ITreeNode<NodeDataType> } {
  if (!gcoWidgets?.length) {
    return { treeNodes: [] }
  }

  const treeNodes: ITreeNode<NodeDataType>[] = []
  let selectedMetric: ITreeNode<NodeDataType> = {} as ITreeNode<NodeDataType>
  for (let widgetIndex = 0; widgetIndex < gcoWidgets.length; widgetIndex++) {
    const widget = gcoWidgets[widgetIndex]
    if (!widget || !widget.widgetName || !widget.dataSetList?.length) {
      continue
    }

    const treeNode: ITreeNode<NodeDataType> = generateTreeNode(
      NodeType.WIDGET,
      undefined,
      widget.widgetName,
      widgetIndex === 0
    )

    for (let dataSetIndex = 0; dataSetIndex < widget.dataSetList.length; dataSetIndex++) {
      const dataSet = widget.dataSetList[dataSetIndex]
      if (!dataSet || !dataSet.metricName || !dataSet.timeSeriesQuery) {
        continue
      }

      const metric: ITreeNode<NodeDataType> = generateTreeNode(
        NodeType.GCO_METRIC,
        { widget: treeNode.id, query: dataSet.timeSeriesQuery },
        dataSet.metricName
      )
      if (isFirstLoad && dataSetIndex === 0 && widgetIndex === 0) {
        metric.isSelected = true
        selectedMetric = metric
      }
      treeNode.childNodes?.push(metric)
    }

    treeNodes.push(treeNode)
  }

  return { treeNodes, selectedMetric: selectedMetric }
}

function TreeNodeLabel(props: TreeNodeLabelProps): JSX.Element {
  const { width, label } = props
  return (
    <Text color={Color.BLACK} width={width} lineClamp={1} className={css.textOverflow}>
      {label}
    </Text>
  )
}

export function DashboardWidgetMetricNav(props: DashboardWidgetMetricNavProps): JSX.Element {
  const {
    className,
    connectorIdentifier,
    gcoDashboards,
    onSelectMetric,
    showSpinnerOnLoad,
    manuallyInputQueries = []
  } = props
  const { projectIdentifier, accountId, orgIdentifier } = useParams<ProjectPathProps>()
  const [selectedMetric, setSelectedMetric] = useState<ITreeNode | undefined>(
    initializeSelectedMetric(manuallyInputQueries, gcoDashboards)
  )
  const [selectedDashboard, setSelectedDashboard] = useState<StackdriverDashboardDTO | undefined>(
    gcoDashboards?.filter(dashboard => dashboard?.path && dashboard.name)[0] || []
  )
  const { getString } = useStrings()
  const { showError } = useToaster()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [navContent, setNavContent] = useState<ITreeNode<NodeDataType>[]>(
    transformDashboardsToTreeNodes(gcoDashboards, manuallyInputQueries)
  )
  const { error, loading, data, refetch: fetchDetails } = useGetStackdriverDashboardDetail({ lazy: true })
  useEffect(() => {
    const selectedDashIndex = navContent.findIndex(treeNode => treeNode.id === selectedDashboard?.name)
    if (selectedDashIndex === -1) {
      return
    }
    if (error?.message || (!loading && !data?.resource?.length)) {
      navContent[selectedDashIndex].isExpanded = false
      navContent[selectedDashIndex].childNodes = []
      setNavContent([...navContent])
      if (error?.message) {
        showError(error.message, 5000)
      }
    } else if (!loading && data?.resource?.length) {
      const { treeNodes, selectedMetric: metric } = transformWidgetsToTreeNodes(data.resource, !selectedMetric)
      navContent[selectedDashIndex].childNodes = treeNodes
      setNavContent([...navContent])
      setSelectedMetric(metric)
      const { data: datum } = metric?.nodeData || {}
      onSelectMetric(metric?.id as string, JSON.stringify(datum?.query), datum?.widget)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading])

  useEffect(() => {
    if (selectedDashboard?.path) {
      fetchDetails({
        queryParams: {
          projectIdentifier,
          orgIdentifier,
          accountId,
          connectorIdentifier,
          path: selectedDashboard.path
        }
      })
    }
  }, [selectedDashboard?.path])

  return (
    <Container width={250} className={cx(css.main, className)}>
      {loading && showSpinnerOnLoad && <PageSpinner />}
      <Link withoutHref onClick={() => setIsModalOpen(true)} className={css.inputQueryLink}>
        {getString('cv.monitoringSources.gco.addManualInputQuery')}
      </Link>
      <Tree
        contents={navContent}
        onNodeExpand={(node, nodePath) => {
          const { type, data: datum } = node.nodeData || {}
          if (
            nodePath.length === NodeDepth.DASHBOARD &&
            !node.childNodes?.length &&
            type !== NodeType.MANUAL_INPUT_QUERY
          ) {
            navContent.forEach(dashboard => (dashboard.isExpanded = false))
            node.childNodes = LoadingSkeleton
            setSelectedDashboard({ name: node.id as string, path: datum })
          }
          node.isExpanded = true
          setNavContent([...navContent])
        }}
        onNodeCollapse={node => {
          node.isExpanded = false
          setNavContent([...navContent])
        }}
        onNodeClick={(node, nodePath) => {
          const { isExpanded, id, childNodes, nodeData } = node
          const { data: datum, type } = nodeData || {}
          switch (nodePath.length) {
            case NodeDepth.DASHBOARD:
              navContent.forEach(dashboard => (dashboard.isExpanded = false))
              node.isExpanded = !isExpanded
              if (type !== NodeType.MANUAL_INPUT_QUERY && isExpanded && !childNodes?.length) {
                node.childNodes = LoadingSkeleton
                setSelectedDashboard({ name: id as string, path: datum })
              }
              break
            case NodeDepth.WIDGET:
              if (type === NodeType.MANUAL_INPUT_METRIC) {
                if (selectedMetric) selectedMetric.isSelected = false
                node.isSelected = true
                setSelectedMetric(node)
                setSelectedDashboard(undefined)
                onSelectMetric(id as string, '', '')
              } else {
                node.isExpanded = !isExpanded
              }
              break
            case NodeDepth.METRIC:
              if (selectedMetric) selectedMetric.isSelected = false
              node.isSelected = true
              setSelectedMetric(node)
              onSelectMetric(id as string, JSON.stringify(datum.query), datum.widget)
              break
            default:
              break
          }

          setNavContent([...navContent])
        }}
      />
      {isModalOpen && (
        <ManualInputQueryModal
          manuallyInputQueries={manuallyInputQueries}
          onSubmit={values => {
            if (selectedMetric) {
              selectedMetric.isSelected = false
            }
            setSelectedDashboard(undefined)
            const newMetric = generateTreeNode(NodeType.MANUAL_INPUT_METRIC, undefined, values.metricName)
            newMetric.isSelected = true
            navContent.forEach(dashboard => (dashboard.isExpanded = false))
            if (navContent[0]?.nodeData?.type === NodeType.MANUAL_INPUT_QUERY) {
              navContent[0].childNodes?.unshift(newMetric)
              navContent[0].isExpanded = true
            }
            setNavContent([...navContent])
            setSelectedMetric(newMetric)
            onSelectMetric(values.metricName, '', '')
          }}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </Container>
  )
}
