import React, { Dispatch, SetStateAction } from 'react'
import {
  Color,
  Formik,
  FormikForm as Form,
  FormInput,
  StepProps,
  Text,
  Layout,
  SelectOption,
  Container,
  Button,
  ModalErrorHandler,
  FlexExpander
} from '@wings-software/uicore'
import type { FeatureFlagRequestRequestBody } from 'services/cf'
import { FlagTypeVariations } from '../CreateFlagDialog/FlagDialogUtils'
import InputDescOptional from './common/InputDescOptional'
import i18n from './FlagWizard.i18n'
import css from './FlagElemVariations.module.scss'

interface FlagElemVariationsProps {
  toggleFlagType: (newFlag: string) => void
  flagTypeOptions: SelectOption[]
  onWizardStepSubmit: (data: FeatureFlagRequestRequestBody) => void
  projectIdentifier?: string | number | null | undefined
  // FIXME: Check for the right type
  setModalErrorHandler: Dispatch<SetStateAction<any>>
  isLoadingCreateFeatureFlag: boolean
}

interface FeatureErrors {
  defaultOnVariation?: 'Required'
  defaultOffVariation?: 'Required'
}
const ON = 'On'
const OFF = 'Off'
const TRUE = 'true'
const FALSE = 'false'

// FIXME: Change any for StepProps
const FlagElemBoolean: React.FC<StepProps<any> & FlagElemVariationsProps> = props => {
  const {
    toggleFlagType,
    flagTypeOptions,
    prevStepData,
    previousStep,
    nextStep,
    onWizardStepSubmit,
    projectIdentifier,
    setModalErrorHandler,
    isLoadingCreateFeatureFlag
  } = props

  const handleNewFlagType = (newFlagTypeVal: string): void => {
    toggleFlagType(newFlagTypeVal)
  }

  const selectValueTrue = { label: ON, value: TRUE }
  const selectValueFalse = { label: OFF, value: FALSE }

  const flagBooleanRules = [selectValueTrue, selectValueFalse]

  const onClickBack = (): void => {
    previousStep?.({ ...prevStepData })
  }

  // TODO: WIP; possible solution is to use yup.addMethod
  const validateForm = (values: any): any => {
    const errors: FeatureErrors = {}

    if (values.defaultOnVariation.length === 0) {
      errors.defaultOnVariation = 'Required'
    }
    if (values.defaultOffVariation.length === 0) {
      errors.defaultOffVariation = 'Required'
    }

    return errors
  }

  return (
    <>
      <Formik
        initialValues={{
          kind: FlagTypeVariations.booleanFlag,
          variations: [
            { identifier: TRUE, name: ON, description: '', value: TRUE },
            { identifier: FALSE, name: OFF, description: '', value: FALSE }
          ],
          defaultOnVariation: TRUE,
          defaultOffVariation: FALSE,
          ...prevStepData
        }}
        // TODO: WIP
        validate={validateForm}
        onSubmit={vals => {
          const data: FeatureFlagRequestRequestBody = { ...prevStepData, ...vals, project: projectIdentifier }
          onWizardStepSubmit(data)
        }}
      >
        {() => (
          <Form>
            <Container flex height="100%" style={{ flexDirection: 'column', alignItems: 'baseline' }}>
              <Container style={{ flexGrow: 1, overflow: 'auto' }} width="100%">
                <ModalErrorHandler bind={setModalErrorHandler} />
                <Text style={{ fontSize: '18px', color: Color.GREY_700 }} margin={{ bottom: 'xlarge' }}>
                  {i18n.varSettingsFlag.variationSettingsHeading}
                </Text>
                <Layout.Vertical>
                  <FormInput.Select
                    name="kind"
                    label={i18n.varSettingsFlag.flagType}
                    items={flagTypeOptions}
                    onChange={newFlagType => handleNewFlagType(newFlagType.value as string)}
                    className={css.inputSelectFlagType}
                  />
                  <Layout.Horizontal>
                    <Container width="35%" margin={{ right: 'medium' }}>
                      <FormInput.Text disabled name="variations[0].name" label={i18n.trueFlag} />
                    </Container>
                    <Container width="65%" className={css.collapseContainer}>
                      <InputDescOptional
                        text={i18n.descOptional}
                        inputName="variations[0].description"
                        inputPlaceholder={''}
                      />
                    </Container>
                  </Layout.Horizontal>
                  <Layout.Horizontal>
                    <Container width="35%" margin={{ right: 'medium' }}>
                      <FormInput.Text disabled name="variations[1].name" label={i18n.falseFlag} />
                    </Container>
                    <Container width="65%" className={css.collapseContainer}>
                      <InputDescOptional
                        text={i18n.descOptional}
                        inputName="variations[1].description"
                        inputPlaceholder={''}
                      />
                    </Container>
                  </Layout.Horizontal>
                  {/* TODO: WIP */}
                  {/* {formikProps.errors.variations ? <Text intent="danger">{formikProps.errors.variations}</Text> : null} */}

                  <Container margin={{ bottom: 'xlarge' }}>
                    <Text color={Color.BLACK} inline>
                      {i18n.varSettingsFlag.defaultRules}
                    </Text>

                    <Layout.Vertical margin={{ top: 'medium' }}>
                      <Container>
                        <Layout.Horizontal>
                          <Text width="25%" className={css.serveTextAlign}>
                            {i18n.varSettingsFlag.flagOn}
                          </Text>
                          <FormInput.Select name="defaultOnVariation" items={flagBooleanRules} />
                        </Layout.Horizontal>
                      </Container>
                      <Container>
                        <Layout.Horizontal>
                          <Text width="25%" className={css.serveTextAlign}>
                            {i18n.varSettingsFlag.flagOff}
                          </Text>
                          <FormInput.Select name="defaultOffVariation" items={flagBooleanRules} />
                        </Layout.Horizontal>
                      </Container>
                    </Layout.Vertical>
                  </Container>
                </Layout.Vertical>
              </Container>

              <Layout.Horizontal spacing="small" margin={{ top: 'large' }} width="100%">
                <Button text={i18n.back} onClick={onClickBack} />
                <Button
                  type="submit"
                  intent="primary"
                  text={i18n.varSettingsFlag.saveAndClose}
                  disabled={isLoadingCreateFeatureFlag}
                  loading={isLoadingCreateFeatureFlag}
                />
                <FlexExpander />
                <Button
                  type="button"
                  text={i18n.varSettingsFlag.testFlagOption}
                  rightIcon="chevron-right"
                  minimal
                  className={css.testFfBtn}
                  onClick={() => {
                    nextStep?.({ ...prevStepData })
                  }}
                />
              </Layout.Horizontal>
            </Container>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FlagElemBoolean
