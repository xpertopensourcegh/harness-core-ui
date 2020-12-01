import type {
  StageExecutionSummaryDTO,
  ParallelStageExecutionSummaryDTO,
  CDStageExecutionSummaryDTO
} from 'services/cd-ng'

export function isParallelStage(parallel?: StageExecutionSummaryDTO): parallel is ParallelStageExecutionSummaryDTO {
  return !!parallel && Array.isArray(parallel.stageExecutions)
}

export function isCDStage(stage?: StageExecutionSummaryDTO): stage is CDStageExecutionSummaryDTO {
  return !!stage
}
