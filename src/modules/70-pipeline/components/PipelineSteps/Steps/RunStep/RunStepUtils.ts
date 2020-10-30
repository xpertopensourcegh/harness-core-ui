import { isEmpty } from 'lodash-es'
import type { RunStepData, RunStepDataUI } from './RunStep'

export function convertToUIModel(data: RunStepData): RunStepDataUI {
  const environment = Object.keys(data.spec.environment || {}).map(key => ({
    key: key,
    value: data.spec.environment![key]
  }))

  if (environment.length === 0) {
    environment.push({ key: '', value: '' })
  }

  return {
    identifier: data.identifier,
    name: data.name,
    type: data.type,
    spec: {
      image: data.spec.image,
      connectorRef: data.spec.connectorRef,
      environment: environment,
      command: data.spec.command,
      output: data.spec.output,
      limitMemory: data.spec?.resources?.limit?.memory, //?.match(/\d+/g)?.join(''),
      limitMemoryUnits: data.spec?.resources?.limit?.memory, //?.match(/[A-Za-z]+$/)?.join('') || LimitMemoryUnits.Mi,
      limitCPU: data.spec?.resources?.limit?.cpu
    }
  }
}

export function convertFromUIModel(data: RunStepDataUI): RunStepData {
  const environment: { [key: string]: string } = {}
  data.spec.environment.forEach((pair: { key: string; value: string }) => {
    // skip empty
    if (pair.key) {
      environment[pair.key] = pair.value
    }
  })

  const schemaValues: RunStepData = {
    identifier: data.identifier,
    name: data.name,
    type: data.type,
    spec: {
      image: data.spec.image,
      ...(!isEmpty(data.spec.connectorRef) && { connectorRef: data.spec.connectorRef }),
      ...(!isEmpty(environment) && { environment }),
      ...(!isEmpty(data.spec.command) && { command: data.spec.command }),
      ...(!isEmpty(data.spec.output) && { output: data.spec.output }),

      ...((!isEmpty(data.spec.limitMemory) || !isEmpty(data.spec.limitCPU)) && {
        resources: {
          limit: {
            ...(!isEmpty(data.spec.limitMemory) && { memory: parseInt(data.spec.limitMemory, 10) }),
            ...(!isEmpty(data.spec.limitCPU) && { cpu: parseInt(data.spec.limitCPU, 10) })
          }
        }
      })
    }
  }

  // TODO: TBD
  //if (data.spec.limitMemory && data.spec.limitMemoryUnits) {
  //  schemaValues.spec.resources.limit.memory = data.spec.limitMemory + data.spec.limitMemoryUnits
  //}

  return schemaValues
}
