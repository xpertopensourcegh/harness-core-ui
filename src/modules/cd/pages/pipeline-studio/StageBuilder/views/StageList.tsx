import React from 'react'
import { IconName, Icon, Layout, Text } from '@wings-software/uikit'
import type { StageElementWrapper } from 'services/cd-ng'
import { MapStepTypeToIcon, getTypeOfStage } from '../StageBuilderUtil'

interface StageListProps {
  stages: StageElementWrapper[]
  selectedStageId?: string
  onClick?: (stageId: string) => void
}

export const StageList: React.FC<StageListProps> = ({ stages, selectedStageId, onClick }): JSX.Element => {
  const list: Array<{ name: string; icon: IconName; identifier: string }> = []
  stages.forEach((node: StageElementWrapper) => {
    if (node.stage.identifier === selectedStageId) {
      list.unshift({
        name: node.stage.name,
        identifier: node.stage.identifier,
        icon: MapStepTypeToIcon[getTypeOfStage(node.stage).type]
      })
    } else {
      list.push({
        name: node.stage.name,
        identifier: node.stage.identifier,
        icon: MapStepTypeToIcon[getTypeOfStage(node.stage).type]
      })
    }
  })
  return (
    <>
      {list.map(node => (
        <Layout.Horizontal
          style={{ cursor: 'pointer' }}
          spacing="small"
          padding="small"
          key={node.identifier}
          onClick={e => {
            e.stopPropagation()
            onClick?.(node.identifier)
          }}
        >
          <Icon name={node.icon} />
          <Text color="white">{node.name}</Text>
        </Layout.Horizontal>
      ))}
    </>
  )
}
