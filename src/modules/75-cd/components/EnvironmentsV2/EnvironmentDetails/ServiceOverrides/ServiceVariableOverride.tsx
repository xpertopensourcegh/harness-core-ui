/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  ButtonSize,
  ButtonVariation,
  Dialog,
  Formik,
  FormInput,
  getMultiTypeFromValue,
  Layout,
  SelectOption
} from '@harness/uicore'
import { Form } from 'formik'
import { useModalHook } from '@harness/use-modal'
import type { IDialogProps } from '@blueprintjs/core'
import { defaultTo } from 'lodash-es'
import MultiTypeSecretInput from '@secrets/components/MutiTypeSecretInput/MultiTypeSecretInput'
import { useStrings } from 'framework/strings'
import RbacButton from '@rbac/components/Button/Button'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { getVariableTypeOptions, VariableType } from './ServiceOverridesUtils'
import type { VariableOverride } from './ServiceOverridesInterface'
import ServiceVariablesOverridesList from './ServiceVariablesOverrides/ServiceVariablesOverridesList'

interface ServiceVariableOverrideProps {
  variablesOptions: SelectOption[]
  variableOverrides: VariableOverride[]
  isReadonly: boolean
  handleVariableSubmit: (val: VariableOverride, variableIndex: number) => void
  onServiceVarDelete: (index: number) => void
}

const DIALOG_PROPS: IDialogProps = {
  isOpen: true,
  enforceFocus: false,
  canEscapeKeyClose: false,
  canOutsideClickClose: false
}

function ServiceVariableOverride({
  variablesOptions,
  variableOverrides,
  handleVariableSubmit,
  isReadonly,
  onServiceVarDelete
}: ServiceVariableOverrideProps): React.ReactElement {
  const { getString } = useStrings()
  const [variableIndex, setEditIndex] = useState(0)

  const variableListItems = useMemo(() => {
    const serviceOverideVars = variableOverrides.map(varOverride => varOverride.name)
    const serviceServiceVars = variablesOptions.map(option => option.value)
    const finalList = new Set([...serviceOverideVars, ...serviceServiceVars] as string[])

    return Array.from(finalList).map(list => ({
      label: defaultTo(list, ''),
      value: defaultTo(list, '')
    }))
  }, [variableOverrides, variablesOptions])

  const createNewVariableOverride = (): void => {
    setEditIndex(variableOverrides.length)
    showModal()
  }

  const handleSubmit = (variableObj: VariableOverride): void => {
    hideModal()
    const variableOldIndex = variableOverrides.findIndex(override => override.name === variableObj.name)
    handleVariableSubmit(variableObj, variableOldIndex !== -1 ? variableOldIndex : variableIndex)
  }

  const onServiceVarEdit = useCallback(
    (index: number): void => {
      setEditIndex(index)
      showModal()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const getInitialValues = (): VariableOverride => {
    const defaultOverrideValues = variableOverrides[variableIndex]
    return defaultTo(defaultOverrideValues, {
      name: '',
      type: VariableType.String,
      value: ''
    })
  }

  const [showModal, hideModal] = useModalHook(() => {
    const onClose = (): void => {
      hideModal()
    }

    return (
      <Dialog title={getString('common.addVariable')} onClose={onClose} {...DIALOG_PROPS}>
        <Formik
          initialValues={getInitialValues()}
          formName="serviceVariableOverride"
          onSubmit={formData => handleSubmit(formData)}
        >
          {formik => {
            return (
              <Form>
                <FormInput.Select
                  name="name"
                  selectProps={{
                    allowCreatingNewItems: true
                  }}
                  items={variableListItems}
                  label={getString('variableNameLabel')}
                  placeholder={getString('common.selectName', { name: getString('variableLabel') })}
                />
                <FormInput.Select
                  name="type"
                  items={getVariableTypeOptions(getString)}
                  label={getString('typeLabel')}
                  placeholder={getString('common.selectName', { name: getString('service') })}
                  onChange={() => {
                    formik.setFieldValue('value', '')
                  }}
                />
                {formik.values?.type === VariableType.Secret ? (
                  <MultiTypeSecretInput name="value" label={getString('cd.overrideValue')} isMultiType />
                ) : (
                  <FormInput.MultiTextInput
                    name="value"
                    className="variableInput"
                    label={getString('cd.overrideValue')}
                    multiTextInputProps={{
                      defaultValueToReset: '',
                      textProps: {
                        type: formik.values?.type === VariableType.Number ? 'number' : 'text'
                      },
                      multitypeInputValue: getMultiTypeFromValue(formik.values?.value)
                    }}
                  />
                )}
                <Layout.Horizontal spacing="medium" margin={{ top: 'huge' }}>
                  <Button
                    variation={ButtonVariation.SECONDARY}
                    text={getString('back')}
                    icon="chevron-left"
                    onClick={onClose}
                  />
                  <Button
                    variation={ButtonVariation.PRIMARY}
                    type="submit"
                    text={getString('submit')}
                    rightIcon="chevron-right"
                  />
                </Layout.Horizontal>
              </Form>
            )
          }}
        </Formik>
      </Dialog>
    )
  }, [variableIndex, variableListItems])

  return (
    <Layout.Vertical flex={{ alignItems: 'flex-start' }}>
      <ServiceVariablesOverridesList
        variableOverrides={variableOverrides}
        isReadonly={isReadonly}
        onServiceVarEdit={onServiceVarEdit}
        onServiceVarDelete={onServiceVarDelete}
      />

      <RbacButton
        text={getString('common.plusNewName', { name: getString('common.override') })}
        size={ButtonSize.SMALL}
        variation={ButtonVariation.LINK}
        permission={{
          resource: {
            resourceType: ResourceType.ENVIRONMENT
          },
          permission: PermissionIdentifier.EDIT_ENVIRONMENT
        }}
        onClick={createNewVariableOverride}
      />
    </Layout.Vertical>
  )
}

export default ServiceVariableOverride
