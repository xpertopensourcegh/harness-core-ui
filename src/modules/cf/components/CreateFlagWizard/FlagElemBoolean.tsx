import React, { useState, Dispatch, SetStateAction } from 'react'
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
  ModalErrorHandler
} from '@wings-software/uikit'
import cx from 'classnames'
import type { FeatureFlag } from 'services/cf'
import { FlagTypeVariations } from '../CreateFlagDialog/FlagDialogUtils'
import InputDescOptional from './common/InputDescOptional'
import i18n from './FlagWizard.i18n'
import css from './FlagElemVariations.module.scss'

interface FlagElemVariationsProps {
  toggleFlagType: (newFlag: string) => void
  testFlagClicked: boolean
  onTestFlag: () => void
  flagTypeOptions: SelectOption[]
  onWizardStepSubmit: (data: FeatureFlag) => void
  projectIdentifier?: string | number | null | undefined
  // FIXME: Check for the right type
  setModalErrorHandler: Dispatch<SetStateAction<any>>
  isLoadingCreateFeatureFlag: boolean
}

// FIXME: Change any for StepProps
const FlagElemBoolean: React.FC<StepProps<any> & FlagElemVariationsProps> = props => {
  const {
    toggleFlagType,
    testFlagClicked,
    onTestFlag,
    flagTypeOptions,
    prevStepData,
    previousStep,
    nextStep,
    onWizardStepSubmit,
    projectIdentifier,
    setModalErrorHandler,
    isLoadingCreateFeatureFlag
  } = props

  const [trueFlagOption, setTrueFlagOption] = useState('true')
  const [falseFlagOption, setFalseFlagOption] = useState('false')

  const handleNewFlagType = (newFlagTypeVal: string): void => {
    toggleFlagType(newFlagTypeVal)
  }

  const onTrueFlagChange = (valInput: string): void => {
    setTrueFlagOption(valInput)
  }

  const onFalseFlagChange = (valInput: string): void => {
    setFalseFlagOption(valInput)
  }

  const flagBooleanRules = [
    { label: trueFlagOption, value: trueFlagOption },
    { label: falseFlagOption, value: falseFlagOption }
  ]

  const onClickBack = (): void => {
    previousStep?.({ ...prevStepData })
  }

  return (
    <>
      <Formik
        initialValues={{
          kind: FlagTypeVariations.booleanFlag,
          variations: [
            { identifier: 'true', name: '', description: '', value: true },
            { identifier: 'false', name: '', description: '', value: false }
          ],
          defaultOnVariation: '',
          defaultOffVariation: '',
          ...prevStepData
        }}
        onSubmit={vals => {
          if (testFlagClicked) {
            // When user clicks on third optional step, load it's component
            return nextStep?.({ ...prevStepData, ...vals })
          }
          const data: FeatureFlag = { ...prevStepData, ...vals, project: projectIdentifier }
          onWizardStepSubmit(data)
        }}
      >
        {() => (
          <Form>
            <ModalErrorHandler bind={setModalErrorHandler} />
            <Text color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }} margin={{ bottom: 'medium' }}>
              {i18n.varSettingsFlag.variationSettingsHeading.toUpperCase()}
            </Text>
            <Layout.Vertical>
              <FormInput.Select
                name="kind"
                label={i18n.varSettingsFlag.flagType}
                items={flagTypeOptions}
                // FIXME: Change type casting
                onChange={newFlagType => handleNewFlagType(String(newFlagType.value))}
                className={css.inputSelectFlagType}
              />
              <Container margin={{ bottom: 'large' }}>
                <Layout.Horizontal>
                  <Container width="35%" margin={{ right: 'medium' }}>
                    <FormInput.Text
                      name="variations[0].identifier"
                      label={i18n.trueFlag}
                      onChange={e => {
                        const element = e.currentTarget as HTMLInputElement
                        const elementValue = element.value
                        onTrueFlagChange(elementValue)
                      }}
                    />
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
                    <FormInput.Text
                      name="variations[1].identifier"
                      label={i18n.falseFlag}
                      onChange={e => {
                        const element = e.currentTarget as HTMLInputElement
                        const elementValue = element.value
                        onFalseFlagChange(elementValue)
                      }}
                    />
                  </Container>
                  <Container width="65%" className={css.collapseContainer}>
                    <InputDescOptional
                      text={i18n.descOptional}
                      inputName="variations[1].description"
                      inputPlaceholder={''}
                    />
                  </Container>
                </Layout.Horizontal>
              </Container>

              <Container margin={{ bottom: 'xlarge' }}>
                <Text color={Color.BLACK} inline>
                  {i18n.varSettingsFlag.defaultRules}
                </Text>
                <Text
                  inline
                  margin={{ left: 'xsmall' }}
                  tooltip={i18n.varSettingsFlag.defaultRulesTooltip}
                  color={Color.BLACK}
                  icon="info-sign"
                  iconProps={{ size: 10, color: Color.BLUE_500 }}
                  tooltipProps={{
                    isDark: true,
                    portalClassName: css.tooltipMultiFlag
                  }}
                />
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

              {/* TODO: Pull this out into separate component, look into FlagElemMultivariate.tsx as well */}
              <Layout.Horizontal className={cx(css.btnsGroup, css.btnsGroupBoolean)}>
                <Button text={i18n.back} onClick={onClickBack} margin={{ right: 'small' }} />
                <Button
                  type="submit"
                  text={i18n.varSettingsFlag.saveAndClose}
                  disabled={isLoadingCreateFeatureFlag}
                  loading={isLoadingCreateFeatureFlag}
                />
                <Button
                  type="submit"
                  text={i18n.varSettingsFlag.testFlagOption.toUpperCase()}
                  onClick={onTestFlag}
                  rightIcon="chevron-right"
                  minimal
                  className={css.testFfBtn}
                />
              </Layout.Horizontal>
            </Layout.Vertical>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FlagElemBoolean
