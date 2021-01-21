import type { VariableMergeServiceResponse } from 'services/pipeline-ng'
import type { NgPipeline } from 'services/cd-ng'

export interface PipelineVariablesData {
  variablesPipeline: NgPipeline
  metadataMap: Required<VariableMergeServiceResponse>['metadataMap']
}
