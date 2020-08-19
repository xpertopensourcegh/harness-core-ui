import React from 'react'
import { Card, Text, Color, Container, Button } from '@wings-software/uikit'
import type { CDPipelineSummaryResponseDTO } from 'services/cd-ng'
import i18n from './PipelineCard.i18n'

export interface PipelineCardProps {
  pipeline: CDPipelineSummaryResponseDTO
  onClick: (pipelineIdentifier?: string) => void
}

export const PipelineCard: React.FC<PipelineCardProps> = ({ pipeline, onClick }) => (
  <Card interactive onClick={() => onClick(pipeline.identifier)}>
    <Text font="medium" color={Color.BLACK}>
      {pipeline.name}
    </Text>
    <Text font="small" padding={{ top: 'xsmall' }}>
      {pipeline.description}
    </Text>
    <Container
      margin={{ top: 'medium', bottom: 'large' }}
      padding={{ top: 'medium', bottom: 'large' }}
      border={{ top: true, bottom: true, color: Color.GREY_250 }}
    >
      <Button intent="primary" text={i18n.runPipeline} onClick={e => e.stopPropagation()} />
    </Container>
  </Card>
)
