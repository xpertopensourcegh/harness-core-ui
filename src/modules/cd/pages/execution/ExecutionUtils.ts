import type { ResponsePipelineExecutionDetail, StageExecutionSummaryDTO } from 'services/cd-ng'

export function getPipelineStagesMap(res: ResponsePipelineExecutionDetail): Map<string, StageExecutionSummaryDTO> {
  const map = new Map<string, StageExecutionSummaryDTO>()

  function recursiveSetInMap(stages: StageExecutionSummaryDTO[]): void {
    stages.forEach(({ stage, parallel }) => {
      if (parallel && Array.isArray(parallel.stageExecutions)) {
        recursiveSetInMap(parallel.stageExecutions)
        return
      }

      map.set(stage.stageIdentifier, stage)
    })
  }

  recursiveSetInMap(res?.data?.pipelineExecution?.stageExecutionSummaryElements || [])

  return map
}
