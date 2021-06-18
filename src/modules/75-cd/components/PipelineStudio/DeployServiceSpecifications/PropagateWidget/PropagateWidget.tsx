import React from 'react'
import cx from 'classnames'
import { Color, Icon, Select, SelectOption, Text, Layout } from '@wings-software/uicore'
import { FormGroup, Intent } from '@blueprintjs/core'
import { isEmpty, noop } from 'lodash-es'
import { Formik, FormikProps } from 'formik'
import { useStrings } from 'framework/strings'
import { StageErrorContext } from '@pipeline/context/StageErrorContext'
import { DeployTabs } from '@cd/components/PipelineStudio/DeployStageSetupShell/DeployStageSetupShellUtils'
import css from './PropagateWidget.module.scss'

export const setupMode = {
  PROPAGATE: 'PROPAGATE',
  DIFFERENT: 'DIFFERENT'
}

export interface PropagateWidgetProps {
  setupModeType: string
  isReadonly: boolean
  previousStageList: {
    label: string
    value: string
  }[]
  selectedPropagatedState: SelectOption | undefined
  initWithServiceDefinition: () => void
  setSetupMode: (setupModeType: string) => void
  setSelectedPropagatedState: (item: SelectOption) => void
}

export default function PropagateWidget(props: PropagateWidgetProps): JSX.Element {
  const {
    setupModeType,
    isReadonly,
    previousStageList,
    selectedPropagatedState,
    initWithServiceDefinition,
    setSetupMode,
    setSelectedPropagatedState
  } = props
  const { getString } = useStrings()
  const formikRef = React.useRef<FormikProps<unknown> | null>(null)
  const { subscribeForm, unSubscribeForm } = React.useContext(StageErrorContext)

  React.useEffect(() => {
    subscribeForm({ tab: DeployTabs.SERVICE, form: formikRef })
    return () => unSubscribeForm({ tab: DeployTabs.SERVICE, form: formikRef })
  }, [])

  return (
    <Formik<{ setupModeType: string; selectedPropagatedState: SelectOption | undefined }>
      onSubmit={noop}
      validate={values => {
        const errors: { [key: string]: string } = {}
        if (values.setupModeType === setupMode.PROPAGATE && isEmpty(values.selectedPropagatedState?.value)) {
          errors.selectedPropagatedState = getString('cd.pipelineSteps.serviceTab.propateStage')
        }
        return errors
      }}
      initialValues={{
        setupModeType: setupModeType,
        selectedPropagatedState: selectedPropagatedState
      }}
      enableReinitialize
    >
      {formik => {
        window.dispatchEvent(new CustomEvent('UPDATE_ERRORS_STRIP', { detail: DeployTabs.SERVICE }))
        formikRef.current = formik
        const { values, errors } = formik
        return (
          <Layout.Horizontal
            padding={{ top: 'xlarge', right: 'xxlarge', bottom: 'xlarge', left: 'xxlarge' }}
            spacing={'xxlarge'}
          >
            <section
              onClick={() => !isReadonly && setSetupMode(setupMode.PROPAGATE)}
              className={cx(
                css.stageSelectionGrid,
                { [css.selected]: values.setupModeType === setupMode.PROPAGATE },
                { [css.error]: errors.selectedPropagatedState }
              )}
            >
              <Icon className={css.checkedSectionIcon} color={Color.PRIMARY_7} name="tick-circle" />
              <Layout.Vertical spacing={'medium'}>
                <Text className={css.cardTitle} color={Color.BLACK}>
                  {getString('pipelineSteps.build.infraSpecifications.propagate')}
                </Text>
                <FormGroup
                  className={css.selectStateForm}
                  intent={isEmpty(errors.selectedPropagatedState) ? Intent.NONE : Intent.DANGER}
                  helperText={errors.selectedPropagatedState ?? ''}
                >
                  <Select
                    inputProps={{ placeholder: getString('pipeline.selectStagePlaceholder') }}
                    disabled={values.setupModeType === setupMode.DIFFERENT || isReadonly}
                    items={previousStageList}
                    value={values.selectedPropagatedState}
                    onChange={setSelectedPropagatedState}
                  />
                </FormGroup>
              </Layout.Vertical>
            </section>
            <section
              onClick={() => !isReadonly && initWithServiceDefinition()}
              className={cx(css.stageSelectionGrid, { [css.selected]: values.setupModeType === setupMode.DIFFERENT })}
            >
              <Icon className={css.checkedSectionIcon} color={Color.PRIMARY_7} name="tick-circle" />
              <Text className={css.cardTitle} color={Color.BLACK}>
                {getString('pipelineSteps.build.infraSpecifications.newConfiguration')}
              </Text>
            </section>
          </Layout.Horizontal>
        )
      }}
    </Formik>
  )
}
