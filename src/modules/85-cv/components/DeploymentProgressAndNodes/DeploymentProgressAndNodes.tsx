import React, { useMemo, useState } from 'react'
import { Container, Text } from '@wings-software/uikit'
import moment from 'moment'
import cx from 'classnames'
import type { DeploymentVerificationJobInstanceSummary } from 'services/cv'
import TestsSummaryView from '@cv/pages/dashboard/deployment-drilldown/TestsSummaryView'
import BlueGreenVerificationChart, { NodeData } from '@cv/pages/services/BlueGreenVerificationChart'
import type { InstancePhase } from '@cv/pages/dashboard/deployment-drilldown/DeploymentDrilldownSideNav'
import CVProgressBar from '../CVProgressBar/CVProgressBar'
import i18n from './DeploymentProgressAndNodes.i18n'
import css from './DeploymentProgressAndNodes.module.scss'

export interface DeploymentProgressAndNodesProps {
  deploymentSummary?: DeploymentVerificationJobInstanceSummary
  onSelectNode?: (node: NodeData) => void
  instancePhase?: InstancePhase
  className?: string
}

export function DeploymentProgressAndNodes(props: DeploymentProgressAndNodesProps): JSX.Element {
  const { deploymentSummary, onSelectNode, instancePhase, className } = props
  const [selectedNode, setSelectedNode] = useState<NodeData | undefined>()
  const deploymentNodesData = useMemo(() => {
    if (!!instancePhase && deploymentSummary?.additionalInfo?.type === 'CANARY') {
      const {
        primary: before = [],
        canary: after = [],
        trafficSplitPercentage
      } = deploymentSummary.additionalInfo as any
      return {
        before,
        after,
        percentageBefore: Math.round(trafficSplitPercentage?.preDeploymentPercentage),
        percentageAfter: Math.round(trafficSplitPercentage?.postDeploymentPercentage)
      }
    }
  }, [deploymentSummary])
  const baselineSummaryData = useMemo(() => {
    if (deploymentSummary && deploymentSummary.additionalInfo && deploymentSummary.additionalInfo.type === 'TEST') {
      const {
        baselineDeploymentTag,
        baselineStartTime,
        currentDeploymentTag,
        currentStartTime
      } = deploymentSummary.additionalInfo as any
      return {
        baselineTestName: baselineDeploymentTag,
        baselineTestDate: baselineStartTime,
        currentTestName: currentDeploymentTag,
        currentTestDate: currentStartTime
      }
    }
  }, [deploymentSummary])

  return (
    <Container className={cx(css.main, className)}>
      <CVProgressBar
        stripes={false}
        value={(deploymentSummary?.progressPercentage ?? 0) / 100}
        intent={
          (deploymentSummary?.status === 'IN_PROGRESS' && 'primary') ||
          ((deploymentSummary?.status as string) === 'SUCCESS' && 'success') ||
          (deploymentSummary?.status === 'ERROR' && 'danger') ||
          undefined
        }
      />
      {deploymentSummary && (
        <>
          <Text font={{ size: 'small' }} data-name={i18n.startedOnText}>
            {i18n.startedOnText}: {moment(deploymentSummary.startTime).format('MMM D, YYYY h:mm A')}
          </Text>
          <Text font={{ size: 'small' }} data-name={i18n.durationText}>
            {i18n.durationText}: {moment.duration(deploymentSummary.durationMs, 'ms').humanize()}
          </Text>
        </>
      )}
      {deploymentNodesData && (
        <BlueGreenVerificationChart
          {...deploymentNodesData}
          selectedNode={selectedNode}
          onSelectNode={(node: NodeData) => {
            setSelectedNode(node)
            onSelectNode?.(node)
          }}
        />
      )}
      {baselineSummaryData && <TestsSummaryView {...baselineSummaryData} />}
    </Container>
  )
}
