import React from 'react'
import { Button } from '@wings-software/uicore'
import { FormikProps, FieldArray } from 'formik'
import { v4 as uuid } from 'uuid'
import { isEmpty, get } from 'lodash-es'

import { String, useStrings } from 'framework/exports'
import type { Values } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'

import FailureTypeMultiSelect from './FailureTypeMultiSelect'
import { allowedStrategiesAsPerStep } from './StrategySelection/StrategyConfig'
import StrategySelection from './StrategySelection/StrategySelection'
import { Modes } from '../common'
import css from './FailureStrategyPanel.module.scss'

/**
 * https://harness.atlassian.net/wiki/spaces/CDNG/pages/865403111/Failure+Strategy+-+CD+Next+Gen
 *
 * https://harness.atlassian.net/wiki/spaces/CDNG/pages/1046806671/NG+Failure+Strategies+Backend
 */

export interface FailureStrategyPanelProps {
  formikProps: FormikProps<Values>
  mode: Modes
}

export default function FailureStrategyPanel(props: FailureStrategyPanelProps): React.ReactElement {
  const {
    formikProps: { values: formValues, submitForm, errors },
    mode
  } = props
  const [selectedStategyNum, setSelectedStategyNum] = React.useState(0)
  const hasFailureStrategies = Array.isArray(formValues.failureStrategies) && formValues.failureStrategies.length > 0
  const { getString } = useStrings()
  const uids = React.useRef<string[]>([])
  const isDefaultStageStrategy = mode === Modes.STAGE && selectedStategyNum === 0

  async function handleTabChange(n: number): Promise<void> {
    await submitForm()

    // only change tab if current tab has no errors
    if (isEmpty(get(errors, `failureStrategies[${selectedStategyNum}]`))) {
      setSelectedStategyNum(n)
    }
  }

  React.useEffect(() => {
    /* istanbul ignore else */
    if (Array.isArray(formValues.failureStrategies) && selectedStategyNum >= formValues.failureStrategies.length) {
      setSelectedStategyNum(Math.max(0, formValues.failureStrategies.length - 1))
    }
  }, [formValues.failureStrategies, selectedStategyNum])

  return (
    <div className={css.main}>
      <String className={css.helpText} stringID="failureStrategy.helpText" />
      <div className={css.header}>
        <FieldArray name="failureStrategies">
          {({ push, remove }) => {
            function handleAdd(): void {
              uids.current.push(uuid())
              push({})
            }

            function handleRemove(): void {
              uids.current.splice(selectedStategyNum, 1)
              remove(selectedStategyNum)
            }

            return (
              <React.Fragment>
                <div className={css.tabs}>
                  {hasFailureStrategies ? (
                    <ul className={css.stepList}>
                      {(formValues.failureStrategies || []).map((_, i) => {
                        // generated uuid if they are not present
                        if (!uids.current[i]) {
                          uids.current[i] = uuid()
                        }

                        const key = uids.current[i]

                        return (
                          <li key={key} className={css.stepListItem}>
                            <Button
                              intent={i === selectedStategyNum ? 'primary' : 'none'}
                              data-selected={i === selectedStategyNum}
                              onClick={() => handleTabChange(i)}
                              className={css.stepListBtn}
                              data-testid={`failure-strategy-step-${i}`}
                            >
                              {i + 1}
                            </Button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                  <Button
                    intent="primary"
                    minimal
                    small
                    icon="plus"
                    iconProps={{ size: 12 }}
                    data-testid="add-failure-strategy"
                    onClick={handleAdd}
                  >
                    <String stringID="add" />
                  </Button>
                </div>
                {hasFailureStrategies && !isDefaultStageStrategy ? (
                  <Button
                    icon="trash"
                    minimal
                    small
                    onClick={handleRemove}
                    iconProps={{ size: 12 }}
                    data-testid="remove-failure-strategy"
                  />
                ) : null}
              </React.Fragment>
            )
          }}
        </FieldArray>
      </div>
      {hasFailureStrategies ? (
        <React.Fragment>
          {isDefaultStageStrategy ? (
            <String tagName="div" className={css.defaultStageText} stringID="failureStrategy.defaultStageText" />
          ) : (
            <FailureTypeMultiSelect
              name={`failureStrategies[${selectedStategyNum}].onFailure.errors`}
              label={getString('failureTypeSelectLabel')}
            />
          )}

          <StrategySelection
            name={`failureStrategies[${selectedStategyNum}].onFailure.action`}
            label={getString('performAction')}
            allowedStrategies={allowedStrategiesAsPerStep[mode]}
          />
        </React.Fragment>
      ) : null}
    </div>
  )
}
