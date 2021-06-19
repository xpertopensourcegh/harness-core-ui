import { isEmpty } from 'lodash-es'
import type { InputSetDTO } from '@pipeline/components/InputSetForm/InputSetForm'
import type { GraphLayoutNode } from 'services/pipeline-ng'

export enum StageType {
  DEPLOY = 'Deployment',
  BUILD = 'CI',
  FEATURE = 'Feature',
  PIPELINE = 'Pipeline',
  APPROVAL = 'Approval',
  CUSTOM = 'Custom'
}

export const changeEmptyValuesToRunTimeInput = (inputset: any): InputSetDTO => {
  Object.keys(inputset).map(key => {
    if (typeof inputset[key] === 'object') {
      changeEmptyValuesToRunTimeInput(inputset[key])
    } else if (inputset[key] === '') {
      inputset[key] = '<+input>'
    }
  })
  return inputset
}

export function isCDStage(node?: GraphLayoutNode): boolean {
  return node?.nodeType === StageType.DEPLOY || node?.module === 'cd' || !isEmpty(node?.moduleInfo?.cd)
}

export function isCIStage(node?: GraphLayoutNode): boolean {
  return node?.nodeType === StageType.BUILD || node?.module === 'ci' || !isEmpty(node?.moduleInfo?.ci)
}
