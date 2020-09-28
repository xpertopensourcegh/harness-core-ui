import { omit } from 'lodash-es'
import { Step } from 'modules/common/exports'
import { isCustomGeneratedString } from 'modules/cd/pages/pipeline-studio/ExecutionGraph/ExecutionGraphUtil'

export abstract class PipelineStep<T extends { name?: string; identifier?: string }> extends Step<T> {
  getDefaultValues(initialValues: T): T {
    if (initialValues.identifier && isCustomGeneratedString(initialValues.identifier)) {
      return { ...this.defaultValues, ...omit(initialValues, ['name', 'identifier']) }
    }
    return { ...this.defaultValues, ...initialValues }
  }
}
