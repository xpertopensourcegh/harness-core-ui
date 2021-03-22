import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import { FormInput, getMultiTypeFromValue, MultiSelectOption, MultiTypeInputType } from '@wings-software/uicore'
import type { AccountPathProps, PipelinePathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useStrings } from 'framework/exports'
import Map from '@common/components/Map/Map'
import {
  getUserGroupListPromise,
  GetUserGroupListQueryParams,
  ResponsePageUserGroupDTO,
  UserGroupDTO
} from 'services/cd-ng'
import { APIStateInterface, AsyncStatus, HarnessApprovalDeploymentModeProps } from './types'
import { INIT_API_STATE, setFailureApiState, setFetchingApiState, setSuccessApiState } from './helper'
import css from './HarnessApproval.module.scss'

/*
Used for iput sets and deployment form
Provide values for all runtime fields in approval step
Open the same form in readonly view while viewing already run executions
*/
export default function HarnessApprovalDeploymentMode(props: HarnessApprovalDeploymentModeProps): JSX.Element {
  const { inputSetData, onUpdate, initialValues } = props
  const template = inputSetData?.template
  const path = inputSetData?.path
  const readonly = inputSetData?.readonly
  const { getString } = useStrings()

  const { accountId } = useParams<PipelineType<PipelinePathProps & AccountPathProps>>()
  const [userGroupOptions, setUserGroupOptions] = useState<APIStateInterface>(INIT_API_STATE)
  let userOptionsTimerId: number | null = null

  const getOptions = (searchString = '') => {
    // Begin the API lifecycle
    setFetchingApiState(setUserGroupOptions)

    const queryParams: GetUserGroupListQueryParams = { accountIdentifier: accountId }
    if (searchString) {
      queryParams.searchTerm = searchString
    }

    const promise: Promise<ResponsePageUserGroupDTO> = getUserGroupListPromise({
      queryParams
    })
    promise
      .then(resolvedData => {
        /*
          Resolve the promised data based for the user groups.
        */
        let options: MultiSelectOption[] = []
        const userGroupData: UserGroupDTO[] = (resolvedData as ResponsePageUserGroupDTO).data?.content || []
        options =
          userGroupData.map((userGroup: UserGroupDTO) => ({
            label: userGroup.name || '',
            value: userGroup.identifier || ''
          })) || []

        setSuccessApiState(options, setUserGroupOptions)
      })
      .catch(error => {
        setFailureApiState(error, setUserGroupOptions)
      })
  }

  function onComponentMount() {
    /*
    Only call the APIs once on every mount i.e. on status INIT
    After first invokation, the status will change to success/inprogress/error
    */

    if (userGroupOptions.apiStatus === AsyncStatus.INIT) {
      getOptions()
    }
  }

  onComponentMount()

  const setSearchDebounce = (searchString: string) => {
    if (userOptionsTimerId) {
      clearTimeout(userOptionsTimerId)
    }
    userOptionsTimerId = window.setTimeout(() => {
      getOptions(searchString)
    }, 300)
  }

  return (
    <React.Fragment>
      {getMultiTypeFromValue(template?.spec?.approvalMessage) === MultiTypeInputType.RUNTIME ? (
        <FormInput.TextArea
          className={css.approvalMessage}
          label={getString('approvalStep.message')}
          name="spec.approvalMessage"
          disabled={readonly}
        />
      ) : null}
      {getMultiTypeFromValue(template?.spec?.includePipelineExecutionHistory) === MultiTypeInputType.RUNTIME ? (
        <FormInput.CheckBox
          className={css.execHistoryCheckbox}
          label={getString('approvalStep.includePipelineExecutionHistory')}
          name="spec.includePipelineExecutionHistory"
          disabled={readonly}
        />
      ) : null}

      {typeof template?.spec?.approvers.userGroups === 'string' &&
      getMultiTypeFromValue(template?.spec?.approvers.userGroups) === MultiTypeInputType.RUNTIME ? (
        <FormInput.MultiSelect
          label={getString('approvalStep.userGroups')}
          name="spec.approvers.userGroups"
          style={{ resize: 'vertical' }}
          placeholder="Add Groups"
          items={userGroupOptions.options}
          onChange={selectedUGs =>
            onUpdate?.({
              ...initialValues,
              spec: {
                ...initialValues.spec,
                approvers: {
                  ...initialValues.spec.approvers,
                  userGroups: selectedUGs?.map(selectedUG => selectedUG.value?.toString())
                }
              }
            })
          }
          disabled={readonly}
          multiSelectProps={{
            onQueryChange: searchString => {
              setSearchDebounce(searchString)
            }
          }}
        />
      ) : null}

      {typeof template?.spec?.approvers.minimumCount === 'string' &&
      getMultiTypeFromValue(template?.spec?.approvers.minimumCount) === MultiTypeInputType.RUNTIME ? (
        <FormInput.Text
          label={getString('approvalStep.minimumCount')}
          name="spec.approvers.minimumCount"
          disabled={readonly}
        />
      ) : null}

      {getMultiTypeFromValue(template?.spec?.approvers.disallowPipelineExecutor) === MultiTypeInputType.RUNTIME ? (
        <FormInput.CheckBox
          className={css.execHistoryCheckbox}
          label={getString('approvalStep.disallowPipelineExecutor')}
          name="spec.approvers.disallowPipelineExecutor"
          disabled={readonly}
        />
      ) : null}

      {typeof template?.spec.approverInputs === 'string' &&
      getMultiTypeFromValue(template?.spec.approverInputs) === MultiTypeInputType.RUNTIME ? (
        <Map
          name={`${isEmpty(path) ? '' : `${path}.`}spec.approverInputs`}
          label={getString('approvalStep.approverInputs')}
          disabled={readonly}
          style={{ marginBottom: 'var(--spacing-small)' }}
          valueLabel="Defaault value"
          keyLabel="Variable name"
        />
      ) : null}

      {getMultiTypeFromValue(template?.timeout) === MultiTypeInputType.RUNTIME ? (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name="timeout"
          disabled={readonly}
        />
      ) : null}
    </React.Fragment>
  )
}
