import { Layout } from '@wings-software/uikit'
import React from 'react'
import type { NGPipelineSummaryResponse } from 'services/cd-ng'
import { PipelineCard } from './PipelineCard/PipelineCard'

interface PipelineGridViewProps {
  pipelineList: NGPipelineSummaryResponse[]
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

export const PipelineGridView: React.FC<PipelineGridViewProps> = ({
  pipelineList,
  goToPipelineDetail,
  goToPipelineStudio,
  refetchPipeline
}): JSX.Element => {
  return (
    <Layout.Masonry
      center
      gutter={30}
      width={900}
      items={pipelineList}
      renderItem={(item: NGPipelineSummaryResponse) => (
        <PipelineCard
          pipeline={item}
          goToPipelineDetail={goToPipelineDetail}
          goToPipelineStudio={goToPipelineStudio}
          refetchPipeline={refetchPipeline}
        />
      )}
      keyOf={(item: NGPipelineSummaryResponse) => item.identifier}
    />
  )
}
