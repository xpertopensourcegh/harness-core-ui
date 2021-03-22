import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { FieldArray, FormikProps } from 'formik'
import { Menu } from '@blueprintjs/core'
import {
  Formik,
  MultiTypeInputType,
  Accordion,
  FormInput,
  Button,
  MultiSelectOption,
  Layout,
  Avatar,
  Text
} from '@wings-software/uicore'
import { setFormikRef, StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { useStrings } from 'framework/exports'
import {
  FormMultiTypeDurationField,
  getDurationValidationSchema
} from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'
import {
  getUserGroupListPromise,
  getUsersPromise,
  ResponsePageUserGroupDTO,
  ResponsePageUserSearchDTO,
  UserGroupDTO,
  UserSearchDTO
} from 'services/cd-ng'
import { FormMultiTypeCheckboxField } from '@common/components'
import { FormMultiTypeTextAreaField } from '@common/components/MultiTypeTextArea/MultiTypeTextArea'
import type { AccountPathProps, PipelinePathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import {
  HarnessApprovalStepModeProps,
  HarnessApprovalData,
  APIStateInterface,
  AsyncStatus,
  EntityType,
  ApproverInputsSubmitCallInterface
} from './types'
import { INIT_API_STATE, setFetchingApiState, setSuccessApiState, setFailureApiState } from './helper'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'
import css from './HarnessApproval.module.scss'

/*
functional component as this component doesn't need a state of it's own.
everything is governed from the parent
*/
function HarnessApprovalStepMode(
  props: HarnessApprovalStepModeProps,
  formikRef: StepFormikFowardRef<HarnessApprovalData>
) {
  const { onUpdate } = props
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  const { accountId } = useParams<PipelineType<PipelinePathProps & AccountPathProps>>()
  const [userOptions, setUserOptions] = useState<APIStateInterface>(INIT_API_STATE)
  const [userGroupOptions, setUserGroupOptions] = useState<APIStateInterface>(INIT_API_STATE)
  let userOptionsTimerId: number | null = null

  const [initialValues, setInitialValues] = useState<HarnessApprovalData>(props.initialValues)

  const getOptions = (type: string, searchString = '') => {
    // get the state object for which the API needs to be called
    const apiState = type === EntityType.USER ? setUserOptions : setUserGroupOptions

    // Begin the API lifecycle
    setFetchingApiState(apiState)

    // Get the needed function from services

    const promise: Promise<ResponsePageUserGroupDTO | ResponsePageUserSearchDTO> =
      type === EntityType.USER
        ? getUsersPromise({
            queryParams: { accountIdentifier: accountId, searchString }
          })
        : getUserGroupListPromise({ queryParams: { accountIdentifier: accountId, searchTerm: searchString } })
    promise
      .then(resolvedData => {
        /*
          Resolve the promised data based on the type.
          If the type is 'USER', then we resolve as UserSearchDTO and vice versa for UserGroup.
          This is done because we're using a common function to get users and usergroups
        */
        let options: MultiSelectOption[] = []
        if (type === EntityType.USER) {
          const userData: UserSearchDTO[] = (resolvedData as ResponsePageUserSearchDTO).data?.content || []
          options =
            userData.map((user: UserSearchDTO) => ({
              label: user.name,
              value: user.uuid
            })) || []
          const selectedUserIds: string[] = initialValues.spec.approvers.users as string[]
          const selectedUsers: MultiSelectOption[] = options.filter(option =>
            selectedUserIds.includes(option.value?.toString())
          )
          const updatedInitialValues: HarnessApprovalData = {
            ...initialValues,
            spec: {
              ...initialValues.spec,
              approvers: {
                ...initialValues.spec.approvers,
                users: selectedUsers
              }
            }
          }
          setInitialValues(updatedInitialValues)
        } else {
          const userGroupData: UserGroupDTO[] = (resolvedData as ResponsePageUserGroupDTO).data?.content || []
          options =
            userGroupData.map((userGroup: UserGroupDTO) => ({
              label: userGroup.name || '',
              value: userGroup.identifier || ''
            })) || []
          const selectedUserGroupIds: string[] = initialValues.spec.approvers.userGroups as string[]
          const selectedUserGroups: MultiSelectOption[] = options.filter(option =>
            selectedUserGroupIds.includes(option.value?.toString())
          )
          const updatedInitialValues: HarnessApprovalData = {
            ...initialValues,
            spec: {
              ...initialValues.spec,
              approvers: {
                ...initialValues.spec.approvers,
                userGroups: selectedUserGroups
              }
            }
          }
          setInitialValues(updatedInitialValues)
        }
        setSuccessApiState(options, apiState)
      })
      .catch(error => {
        setFailureApiState(error, apiState)
      })
  }

  function onComponentMount() {
    /*
    Only call the APIs once on every mount i.e. on status INIT
    After first invokation, the status will change to success/inprogress/error
    */
    if (userOptions.apiStatus === AsyncStatus.INIT) {
      getOptions(EntityType.USER)
    }

    if (userGroupOptions.apiStatus === AsyncStatus.INIT) {
      getOptions(EntityType.USERGROUP)
    }
  }

  onComponentMount()

  const setSearchDebounce = (type: EntityType, searchString: string) => {
    if (userOptionsTimerId) {
      clearTimeout(userOptionsTimerId)
    }
    userOptionsTimerId = window.setTimeout(() => {
      getOptions(type, searchString)
    }, 300)
  }

  return (
    <Formik<HarnessApprovalData>
      onSubmit={values => {
        onUpdate?.(values)
      }}
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
        timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString('validation.timeout10SecMinimum')),
        spec: Yup.object().shape({
          approvers: Yup.object().shape({
            // userGroups: Yup.array().when(['users'], {
            //   is: users => isEmpty(users),
            //   then: Yup.array().required(getString('approvalStep.validation.usersOrUserGroups'))
            // }),
            // users: Yup.array().when(['userGroups'], {
            //   is: userGroups => isEmpty(userGroups),
            //   then: Yup.array().required(getString('approvalStep.validation.usersOrUserGroups'))
            // }),
            minimumCount: Yup.number()
              .min(1, getString('approvalStep.validation.minimumCountOne'))
              .required(getString('approvalStep.validation.minimumCountRequired'))
          })
        })
      })}
    >
      {(formik: FormikProps<HarnessApprovalData>) => {
        /*
        this is required - so that validatios work while switching basic to advanced forms.
        i.e. if the current form is invalid, we should not allow the switch to advanced tab
        */
        setFormikRef(formikRef, formik)

        return (
          <React.Fragment>
            <FormInput.InputWithIdentifier inputLabel={getString('name')} />
            <Accordion activeId="step-1" className={stepCss.accordion}>
              <Accordion.Panel
                id="step-1"
                summary={getString('approvalStep.message')}
                details={
                  <div>
                    <FormMultiTypeTextAreaField
                      name="spec.approvalMessage"
                      label={getString('message')}
                      className={css.approvalMessage}
                      multiTypeTextArea={{ enableConfigureOptions: false, expressions }}
                      placeholder="Please add relevant information for this step"
                    />
                    <FormMultiTypeCheckboxField
                      className={css.execHistoryCheckbox}
                      multiTypeTextbox={{ expressions }}
                      name="spec.includePipelineExecutionHistory"
                      label={getString('approvalStep.includePipelineExecutionHistory')}
                    />
                  </div>
                }
              />
              <Accordion.Panel
                id="step-2"
                summary={getString('approvalStep.approvers')}
                details={
                  <div>
                    <FormInput.MultiSelectTypeInput
                      className={css.multiSelect}
                      name="spec.approvers.users"
                      placeholder={`${userOptions.apiStatus === AsyncStatus.FETCHING ? 'Fetching...' : 'Add Users'}`}
                      label={getString('users')}
                      selectItems={userOptions.options}
                      multiSelectTypeInputProps={{
                        multiSelectProps: {
                          tagInputProps: {
                            placeholder: `${
                              userOptions.apiStatus === AsyncStatus.FETCHING ? 'Fetching...' : 'Add Users'
                            }`
                          },
                          name: 'spec.approvers.users',
                          items: userOptions.options,
                          onQueryChange: (str, ev) => {
                            // Event propagation to stop the UI side filtering
                            // Otherwise as we search the dropdown keeps disappearing
                            ev?.stopPropagation()
                            setSearchDebounce(EntityType.USER, str)
                          },
                          // eslint-disable-next-line react/display-name
                          tagRenderer: item => (
                            <Layout.Horizontal key={item.label?.toString()} spacing="small">
                              <Avatar email={item.label?.toString()} size="xsmall" hoverCard={false} />
                              <Text>{item.label}</Text>
                            </Layout.Horizontal>
                          ),
                          // eslint-disable-next-line react/display-name
                          itemRender: (item, { handleClick }) => (
                            <div key={item.label?.toString()}>
                              <Menu.Item
                                text={
                                  <Layout.Horizontal spacing="small" className={css.align}>
                                    <Avatar email={item.label?.toString()} size="small" hoverCard={false} />
                                    <Text>{item.label}</Text>
                                  </Layout.Horizontal>
                                }
                                onClick={handleClick}
                              />
                            </div>
                          )
                        }
                      }}
                    />
                    <FormInput.MultiSelectTypeInput
                      className={css.multiSelect}
                      name="spec.approvers.userGroups"
                      placeholder={`${
                        userGroupOptions.apiStatus === AsyncStatus.FETCHING ? 'Fetching...' : 'Add Groups'
                      }`}
                      label={getString('approvalStep.userGroups')}
                      selectItems={userGroupOptions.options}
                      multiSelectTypeInputProps={{
                        multiSelectProps: {
                          tagInputProps: {
                            placeholder: `${
                              userGroupOptions.apiStatus === AsyncStatus.FETCHING ? 'Fetching...' : 'Add Groups'
                            }`
                          },
                          name: 'spec.approvers.userGroups',
                          items: userGroupOptions.options,
                          onQueryChange: (str, ev) => {
                            // Event propagation to stop the UI side filtering
                            // Otherwise as we search the dropdown keeps disappearing
                            ev?.stopPropagation()
                            setSearchDebounce(EntityType.USERGROUP, str)
                          },
                          // eslint-disable-next-line react/display-name
                          tagRenderer: item => (
                            <Layout.Horizontal key={item.label.toString()} spacing="small">
                              <Avatar email={item.label.toString()} size="xsmall" hoverCard={false} />
                              <Text>{item.label}</Text>
                            </Layout.Horizontal>
                          ),
                          // eslint-disable-next-line react/display-name
                          itemRender: (item, { handleClick }) => (
                            <div key={item.label.toString()}>
                              <Menu.Item
                                text={
                                  <Layout.Horizontal spacing="small" className={css.align}>
                                    <Avatar email={item.label.toString()} size="small" hoverCard={false} />
                                    <Text>{item.label}</Text>
                                  </Layout.Horizontal>
                                }
                                onClick={handleClick}
                              />
                            </div>
                          )
                        }
                      }}
                    />
                    <FormInput.MultiTextInput
                      name="spec.approvers.minimumCount"
                      label={getString('approvalStep.minimumCount')}
                      multiTextInputProps={{
                        textProps: {
                          type: 'number'
                        }
                      }}
                    />
                    <FormMultiTypeCheckboxField
                      className={css.execHistoryCheckbox}
                      multiTypeTextbox={{ expressions }}
                      name="spec.approvers.disallowPipelineExecutor"
                      label={getString('approvalStep.disallowPipelineExecutor')}
                    />
                  </div>
                }
              />
              <Accordion.Panel
                id="step-3"
                summary={getString('approvalStep.approverInputs')}
                details={
                  <div className={stepCss.formGroup}>
                    <MultiTypeFieldSelector
                      name="spec.approverInputs"
                      label="Inputs"
                      defaultValueToReset={[{ name: '', type: 'String', defaultValue: '' }]}
                    >
                      <FieldArray
                        name="spec.approverInputs"
                        render={({ push, remove }) => {
                          return (
                            <div>
                              <div className={css.headerRow}>
                                <span className={css.label}>Variable name</span>
                                <span className={css.label}>Default value</span>
                              </div>
                              {(formik.values.spec.approverInputs as ApproverInputsSubmitCallInterface[]).map(
                                (_unused: ApproverInputsSubmitCallInterface, i: number) => (
                                  <div className={css.headerRow} key={i}>
                                    <FormInput.Text name={`spec.approverInputs[${i}].name`} />
                                    <FormInput.MultiTextInput
                                      name={`spec.approverInputs[${i}].defaultValue`}
                                      label=""
                                      multiTextInputProps={{
                                        allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION],
                                        expressions
                                      }}
                                    />
                                    <Button
                                      minimal
                                      icon="trash"
                                      data-testid={`remove-approverInputs-${i}`}
                                      onClick={() => remove(i)}
                                    />
                                  </div>
                                )
                              )}
                              <Button
                                icon="plus"
                                minimal
                                intent="primary"
                                data-testid="add-approverInput"
                                onClick={() => push({ key: '', value: '' })}
                              >
                                Add
                              </Button>
                            </div>
                          )
                        }}
                      />
                    </MultiTypeFieldSelector>
                  </div>
                }
              />
              <Accordion.Panel
                id="step-4"
                summary={getString('pipelineSteps.timeoutLabel')}
                details={
                  <div>
                    <FormMultiTypeDurationField name="timeout" label={getString('pipelineSteps.timeoutLabel')} />
                  </div>
                }
              />
            </Accordion>
          </React.Fragment>
        )
      }}
    </Formik>
  )
}

const HarnessApprovalStepModeWithRef = React.forwardRef(HarnessApprovalStepMode)
export default HarnessApprovalStepModeWithRef
