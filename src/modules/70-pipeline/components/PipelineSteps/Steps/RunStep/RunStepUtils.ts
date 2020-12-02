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
    description: data.description,
    type: data.type,
    spec: {
      image: data.spec.image,
      connectorRef: data.spec.connectorRef,
      environment: environment,
      command: data.spec.command?.join('\r\n'),
      output: data.spec.output,
      limitMemory: data.spec?.resources?.limit?.memory, //?.match(/\d+/g)?.join(''),
      limitMemoryUnits: 'Mi', //?.match(/[A-Za-z]+$/)?.join('') || LimitMemoryUnits.Mi,
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

  let connectorRef
  if (data.spec.connectorRef) {
    connectorRef = data.spec.connectorRef?.value || data.spec.connectorRef
  }

  const schemaValues: RunStepData = {
    identifier: data.identifier,
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    type: data.type,
    spec: {
      image: data.spec.image,
      ...(connectorRef && { connectorRef }),
      ...(!isEmpty(environment) && { environment }),
      ...(!isEmpty(data.spec.command) && { command: data.spec.command.split(/\r?\n/g).filter((c: string) => !!c) }),
      ...(!isEmpty(data.spec.output) && { output: data.spec.output.filter((c: string) => !!c) }),
      ...((data.spec.limitMemory || data.spec.limitCPU) && {
        resources: {
          limit: {
            ...(data.spec.limitMemory && { memory: parseInt(data.spec.limitMemory, 10) }),
            ...(data.spec.limitCPU && { cpu: parseInt(data.spec.limitCPU, 10) })
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
