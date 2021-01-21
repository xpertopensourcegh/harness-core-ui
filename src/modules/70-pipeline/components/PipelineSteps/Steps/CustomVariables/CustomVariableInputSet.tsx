import React from 'react'
import { Text, FormInput, MultiTypeInputType, getMultiTypeFromValue } from '@wings-software/uicore'
// import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { StepViewType } from '@pipeline/exports'
import MultiTypeSecretInput from '@secrets/components/MutiTypeSecretInput/MultiTypeSecretInput'
import type { Variable } from './AddEditCustomVariable'
import i18n from './CustomVariables.i18n'
import css from './CustomVariables.module.scss'

export interface CustomVariablesData {
  variables: Variable[]
  isPropagating?: boolean
  canAddVariable?: boolean
}

export interface CustomVariableInputSetExtraProps {
  variableNamePrefix?: string
  domId?: string
  template?: CustomVariablesData
  path?: string
}

export interface CustomVariableInputSetProps extends CustomVariableInputSetExtraProps {
  initialValues: CustomVariablesData
  onUpdate?: (data: CustomVariablesData) => void
  stepViewType?: StepViewType
}

const VariableTypes = {
  String: 'String',
  Secret: 'Secret',
  Number: 'Number'
}

export function CustomVariableInputSet(props: CustomVariableInputSetProps): React.ReactElement {
  const { initialValues, template, stepViewType = StepViewType.Edit, path, variableNamePrefix = '', domId } = props
  const basePath = path?.length ? `${path}.` : ''
  return (
    <div className={cx(css.customVariables, 'customVariables')} id={domId}>
      {stepViewType === StepViewType.StageVariable && initialValues.variables.length > 0 && (
        <section className={css.subHeader}>
          <span>{i18n.variablesTableHeaders.name}</span>
          <span>{i18n.variablesTableHeaders.type}</span>
          <span>{i18n.variablesTableHeaders.value}</span>
        </section>
      )}
      {initialValues.variables.map?.((variable, index) => {
        if (getMultiTypeFromValue(template?.variables[index].value) !== MultiTypeInputType.RUNTIME) {
          return
        }
        return (
          <div key={`${variable.name}${index}`} className={css.variableListTable}>
            <Text>{`${variableNamePrefix}${variable.name}`}</Text>

            <Text>{variable.type}</Text>
            <div className={css.valueRow}>
              {variable.type === VariableTypes.Secret ? (
                <MultiTypeSecretInput isMultiType={false} name={`${basePath}variables[${index}].value`} label="" />
              ) : (
                <FormInput.Text className="variableInput" name={`${basePath}variables[${index}].value`} label="" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
