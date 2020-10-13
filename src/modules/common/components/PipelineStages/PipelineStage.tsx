import React from 'react'
import type { IconName } from '@wings-software/uikit'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'

export interface PipelineStageProps<T = {}> {
  name: string
  type: string
  icon: IconName
  isDisabled: boolean
  isApproval: boolean
  stageProps?: T
  iconsStyle?: React.CSSProperties
  iconsProps?: Omit<IconProps, 'name'>
  minimal?: boolean
}

export abstract class PipelineStage<T = {}> extends React.Component<PipelineStageProps<T>> {}
