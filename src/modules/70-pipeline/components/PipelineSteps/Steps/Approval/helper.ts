import { getMultiTypeFromValue, MultiSelectOption, MultiTypeInputType } from '@wings-software/uicore'
import { flatMap } from 'lodash-es'
import type { Dispatch, SetStateAction } from 'react'
import { APIStateInterface, ApproverInputsSubmitCallInterface, AsyncStatus, HarnessApprovalData } from './types'

const getEntries = function <T>(object: T, prefix = ''): Array<any> {
  return flatMap(Object.entries(object), ([k, v]: { k: string; v: any }[]) =>
    Object(v) === v ? getEntries(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]
  )
}

export function flatObject(object: object): object {
  return getEntries(object).reduce((o, k) => ((o[k[0]] = k[1]), o), {})
}

/*
Process and convert form data to submit call data
Flatten the usergroups and users objects, and only send the ids
*/
export const processFormData = (data: HarnessApprovalData): HarnessApprovalData => {
  const toReturn = {
    ...data,
    spec: {
      ...data.spec,
      approvers: {
        ...data.spec.approvers,
        minimumCount: Number(data.spec.approvers.minimumCount),
        userGroups:
          getMultiTypeFromValue(data.spec.approvers.userGroups as string) === MultiTypeInputType.RUNTIME
            ? data.spec.approvers.userGroups
            : Array.isArray(data.spec.approvers.userGroups)
            ? (data.spec.approvers.userGroups as MultiSelectOption[]).map((ug: MultiSelectOption) =>
                ug.value?.toString()
              )
            : [],
        users:
          getMultiTypeFromValue(data.spec.approvers.users as string) === MultiTypeInputType.RUNTIME
            ? data.spec.approvers.users
            : Array.isArray(data.spec.approvers.users)
            ? (data.spec.approvers.users as MultiSelectOption[]).map((us: MultiSelectOption) => us.value?.toString())
            : []
      },
      approverInputs:
        getMultiTypeFromValue(data.spec.approverInputs as string) === MultiTypeInputType.RUNTIME
          ? data.spec.approverInputs
          : Array.isArray(data.spec.approverInputs)
          ? (data.spec.approverInputs as ApproverInputsSubmitCallInterface[]).map(
              (input: ApproverInputsSubmitCallInterface) =>
                ({
                  name: input.name,
                  defaultValue: input.defaultValue
                } as ApproverInputsSubmitCallInterface)
            )
          : []
    }
  }
  return toReturn
}

// Converting API call data for formik values, to populate while editing the step
export const processForInitialValues = (data: HarnessApprovalData): HarnessApprovalData => {
  const toReturn = {
    ...data,
    spec: {
      ...data.spec,
      // approvers: {
      //   ...data.spec.approvers,
      //   userGroups:
      //     getMultiTypeFromValue(data.spec.approvers.userGroups as string) === MultiTypeInputType.RUNTIME
      //       ? data.spec.approvers.userGroups
      //       : Array.isArray(data.spec.approvers.userGroups)
      //       ? (data.spec.approvers.userGroups as string[]).map(
      //           (ug: string) => ({ label: `name-${ug}`, value: ug } as MultiSelectOption)
      //         )
      //       : [],
      //   users:
      //     getMultiTypeFromValue(data.spec.approvers.users as string) === MultiTypeInputType.RUNTIME
      //       ? data.spec.approvers.users
      //       : Array.isArray(data.spec.approvers.users)
      //       ? (data.spec.approvers.users as string[]).map(
      //           (us: string) => ({ label: `name-${us}`, value: us } as MultiSelectOption)
      //         )
      //       : []
      // },
      approverInputs:
        getMultiTypeFromValue(data.spec.approverInputs as string) === MultiTypeInputType.RUNTIME
          ? data.spec.approverInputs
          : Array.isArray(data.spec.approverInputs)
          ? (data.spec.approverInputs as ApproverInputsSubmitCallInterface[]).map(
              (input: ApproverInputsSubmitCallInterface) =>
                ({
                  name: input.name,
                  defaultValue: input.defaultValue
                } as ApproverInputsSubmitCallInterface)
            )
          : []
    }
  }

  return toReturn
}

/*
Below methods are consumed in HarnessApproval step.
For users and usergroup API state management
*/
export const INIT_API_STATE: APIStateInterface = {
  options: [],
  apiStatus: AsyncStatus.INIT,
  error: ''
}

export const setSuccessApiState = (
  options: MultiSelectOption[],
  setStateObject: Dispatch<SetStateAction<APIStateInterface>>
) => {
  setStateObject({
    options,
    apiStatus: AsyncStatus.SUCCESS,
    error: ''
  })
}

export const setFetchingApiState = (setStateObject: Dispatch<SetStateAction<APIStateInterface>>) => {
  setStateObject({
    options: [{ label: 'Fetching...', value: '', disabled: true }],
    apiStatus: AsyncStatus.FETCHING,
    error: ''
  })
}

export const setFailureApiState = (error: string, setStateObject: Dispatch<SetStateAction<APIStateInterface>>) => {
  setStateObject({
    options: [],
    apiStatus: AsyncStatus.FAILURE,
    error
  })
}
