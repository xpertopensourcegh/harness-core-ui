import React from 'react'
import { Button } from '@wings-software/uikit'
import { FormikProps, FieldArray } from 'formik'
import { v4 as uuid } from 'uuid'

import { String, useStrings } from 'framework/exports'
import type { Values } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'

import FailureTypeMultiSelect from './FailureTypeMultiSelect'
import StrategySelection from './StrategySelection/StrategySelection'
import css from './FailureStrategyPanel.module.scss'

/**
 * https://harness.atlassian.net/wiki/spaces/CDNG/pages/865403111/Failure+Strategy+-+CD+Next+Gen
 *
 * https://harness.atlassian.net/wiki/spaces/CDNG/pages/1046806671/NG+Failure+Strategies+Backend
 */

export interface FailureStrategyPanelProps {
  formikProps: FormikProps<Values>
}

export default function FailureStrategyPanel(props: FailureStrategyPanelProps): React.ReactElement {
  const {
    formikProps: { values: formValues }
  } = props
  const [selectedStategyNum, setSelectedStategyNum] = React.useState(0)
  const hasFailureStrategies = Array.isArray(formValues.failureStrategies) && formValues.failureStrategies.length > 0
  const { getString } = useStrings()

  React.useEffect(() => {
    if (Array.isArray(formValues.failureStrategies) && selectedStategyNum >= formValues.failureStrategies.length) {
      setSelectedStategyNum(Math.max(0, formValues.failureStrategies.length - 1))
    }
  }, [formValues.failureStrategies, selectedStategyNum])

  return (
    <div className={css.main}>
      <String className={css.helpText} stringID="failureStrategyHelpText" />
      <div className={css.header}>
        <FieldArray name="failureStrategies">
          {({ push, remove }) => {
            return (
              <React.Fragment>
                <div className={css.tabs}>
                  {hasFailureStrategies ? (
                    <ul className={css.stepList}>
                      {formValues.failureStrategies.map(({ id }, i) => {
                        return (
                          <li key={id} className={css.stepListItem}>
                            <Button
                              intent={i === selectedStategyNum ? 'primary' : 'none'}
                              data-selected={i === selectedStategyNum}
                              onClick={() => setSelectedStategyNum(i)}
                              className={css.stepListBtn}
                            >
                              {i + 1}
                            </Button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                  <Button intent="primary" minimal small icon="plus" iconProps={{ size: 12 }}>
                    <String stringID="add" onClick={() => push({ id: uuid() })} />
                  </Button>
                </div>
                {hasFailureStrategies ? (
                  <Button
                    icon="trash"
                    minimal
                    small
                    onClick={() => remove(selectedStategyNum)}
                    iconProps={{ size: 12 }}
                  />
                ) : null}
              </React.Fragment>
            )
          }}
        </FieldArray>
      </div>
      <FailureTypeMultiSelect
        name={`failureStrategies[${selectedStategyNum}].onFailure.errors`}
        label={getString('failureTypeSelectLabel')}
      />
      <StrategySelection
        name={`failureStrategies[${selectedStategyNum}].onFailure.action`}
        label={getString('performAction')}
      />
    </div>
  )
}
