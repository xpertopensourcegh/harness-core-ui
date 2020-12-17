import React, { useEffect, useState } from 'react'
import { Color, Container, Text } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Classes, ITreeNode, Tree } from '@blueprintjs/core'
import { useToaster } from '@common/exports'
import { PageSpinner } from '@common/components'
import { StackdriverDashboardDetail, StackdriverDashboardDTO, useGetStackdriverDashboardDetail } from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import css from './DashboardWidgetMetricNav.module.scss'

export interface DashboardWidgetMetricNavProps {
  className?: string
  gcoDashboards: StackdriverDashboardDTO[]
  connectorIdentifier: string
  onSelectMetric: (selectedMetric: string, query: string, widgetName: string) => void
  showSpinnerOnLoad?: boolean
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

function transformDashboardsToTreeNodes(gcoDashboards: StackdriverDashboardDTO[]): ITreeNode[] {
  if (!gcoDashboards?.length) {
    return []
  }
  const treeNodes: ITreeNode[] = []

  for (const dashboard of gcoDashboards) {
    if (dashboard && dashboard.name && dashboard.path) {
      treeNodes.push({
        id: dashboard.name,
        hasCaret: true,
        label: (
          <Text color={Color.BLACK} width={192} lineClamp={1} className={css.textOverflow}>
            {dashboard.name}
          </Text>
        ),
        childNodes: [],
        nodeData: dashboard.path
      })
    }
  }

  treeNodes[0].isExpanded = true
  treeNodes[0].childNodes = LoadingSkeleton
  return treeNodes
}

function transformWidgetsToTreeNodes(
  gcoWidgets: StackdriverDashboardDetail[],
  isFirstLoad: boolean
): { treeNodes: ITreeNode[]; selectedMetric?: ITreeNode } {
  if (!gcoWidgets?.length) {
    return { treeNodes: [] }
  }

  const treeNodes: ITreeNode[] = []
  let selectedMetric: ITreeNode = {} as ITreeNode
  for (let widgetIndex = 0; widgetIndex < gcoWidgets.length; widgetIndex++) {
    const widget = gcoWidgets[widgetIndex]
    if (!widget || !widget.widgetName || !widget.dataSetList?.length) {
      continue
    }

    const treeNode: ITreeNode = {
      id: widget.widgetName,
      hasCaret: true,
      isExpanded: widgetIndex === 0,
      label: (
        <Text color={Color.BLACK} width={170} lineClamp={1} className={css.textOverflow}>
          {widget.widgetName}
        </Text>
      ),
      childNodes: []
    }

    for (let dataSetIndex = 0; dataSetIndex < widget.dataSetList.length; dataSetIndex++) {
      const dataSet = widget.dataSetList[dataSetIndex]
      if (!dataSet || !dataSet.metricName || !dataSet.timeSeriesQuery) {
        continue
      }
      const metric: ITreeNode = {
        id: dataSet.metricName,
        label: (
          <Text color={Color.BLACK} width={140} lineClamp={1} className={css.textOverflow}>
            {dataSet.metricName}
          </Text>
        ),
        hasCaret: false,
        isExpanded: false,
        nodeData: {
          widget: treeNode.id,
          query: dataSet.timeSeriesQuery
        }
      }
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

export function DashboardWidgetMetricNav(props: DashboardWidgetMetricNavProps): JSX.Element {
  const { className, connectorIdentifier, gcoDashboards, onSelectMetric, showSpinnerOnLoad } = props
  const { projectIdentifier, accountId, orgIdentifier } = useParams<ProjectPathProps>()
  const [selectedMetric, setSelectedMetric] = useState<ITreeNode | undefined>()
  const [selectedDashboard, setSelectedDashboard] = useState(
    gcoDashboards?.filter(dashboard => dashboard && dashboard.path && dashboard.name)[0] || []
  )
  const { showError } = useToaster()
  const [navContent, setNavContent] = useState<ITreeNode[]>(transformDashboardsToTreeNodes(gcoDashboards))
  const { error, loading, data } = useGetStackdriverDashboardDetail({
    queryParams: {
      projectIdentifier,
      orgIdentifier,
      accountId,
      connectorIdentifier,
      path: selectedDashboard?.path || ''
    }
  })

  useEffect(() => {
    const selectedDashIndex = navContent.findIndex(treeNode => treeNode.id === selectedDashboard.name)
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
      const { query, widget } = (metric?.nodeData as any) || {}
      onSelectMetric(metric?.id as string, JSON.stringify(query), widget)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading])

  return (
    <Container width={250} className={cx(css.main, className)}>
      {loading && showSpinnerOnLoad && <PageSpinner />}
      <Tree
        contents={navContent}
        onNodeExpand={(node, nodePath) => {
          if (nodePath.length === 1 && !node.childNodes?.length) {
            navContent.forEach(dashboard => (dashboard.isExpanded = false))
            node.childNodes = LoadingSkeleton
            setSelectedDashboard({ name: node.id as string, path: node.nodeData as string })
          }
          node.isExpanded = true
          setNavContent([...navContent])
        }}
        onNodeCollapse={node => {
          node.isExpanded = false
          setNavContent([...navContent])
        }}
        onNodeClick={(node, nodePath) => {
          if (nodePath.length !== 3) {
            node.isExpanded = !node.isExpanded
            if (nodePath.length === 1 && node.isExpanded && !node.childNodes?.length) {
              node.childNodes = LoadingSkeleton
              setSelectedDashboard({ name: node.id as string, path: node.nodeData as string })
            }
          } else {
            if (selectedMetric) {
              selectedMetric.isSelected = false
            }
            node.isSelected = true
            setSelectedMetric(node)
            const { query, widget } = node?.nodeData as any
            onSelectMetric(node.id as string, JSON.stringify(query), widget)
          }
          setNavContent([...navContent])
        }}
      />
    </Container>
  )
}
