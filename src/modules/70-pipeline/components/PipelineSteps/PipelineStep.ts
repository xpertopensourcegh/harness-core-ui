import { cloneDeep, defaultsDeep } from 'lodash-es'

import { Step, StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { isCustomGeneratedString } from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraphUtil'
export type { StepProps } from '@pipeline/components/AbstractSteps/Step'

export abstract class PipelineStep<T extends { name?: string; identifier?: string }> extends Step<T> {
  getDefaultValues(initialValues: T, viewType: StepViewType): T {
    if (initialValues.identifier && isCustomGeneratedString(initialValues.identifier)) {
      const values = cloneDeep(initialValues)
      delete values.name
      delete values.identifier
      return defaultsDeep(values, this.defaultValues)
    }
    if (viewType === StepViewType.InputSet || viewType === StepViewType.DeploymentForm) {
      return {
        ...initialValues
      }
    }
    return defaultsDeep(cloneDeep(initialValues), this.defaultValues)
  }
  processFormData(values: T): T {
    return values
  }
}
