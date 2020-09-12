import { Layout } from '@wings-software/uikit'
import React from 'react'
import type { CDPipelineSummaryResponseDTO } from 'services/cd-ng'
import { PipelineCard } from './PipelineCard/PipelineCard'

interface PipelineGridViewProps {
  pipelineList: CDPipelineSummaryResponseDTO[]
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  runPipeline: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

export const PipelineGridView: React.FC<PipelineGridViewProps> = ({
  pipelineList,
  goToPipelineDetail,
  goToPipelineStudio,
  runPipeline,
  refetchPipeline
}): JSX.Element => {
  return (
    <Layout.Masonry
      center
      gutter={30}
      width={900}
      items={pipelineList}
      renderItem={(item: CDPipelineSummaryResponseDTO) => (
        <PipelineCard
          pipeline={item}
          goToPipelineDetail={goToPipelineDetail}
          goToPipelineStudio={goToPipelineStudio}
          runPipeline={runPipeline}
          refetchPipeline={refetchPipeline}
        />
      )}
      keyOf={(item: CDPipelineSummaryResponseDTO) => item.identifier}
    />
  )
}
