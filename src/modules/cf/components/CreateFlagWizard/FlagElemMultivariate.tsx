import React, { useState, Dispatch, SetStateAction, useCallback } from 'react'
import {
  Color,
  Formik,
  FormikForm as Form,
  FormInput,
  StepProps,
  Text,
  Layout,
  Select,
  SelectOption,
  Button,
  Container,
  ModalErrorHandler,
  FlexExpander
} from '@wings-software/uicore'
import { FieldArray } from 'formik'
import type { FeatureFlagRequestRequestBody } from 'services/cf'
import { FlagTypeVariationsSelect } from '../CreateFlagDialog/FlagDialogUtils'
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

interface FlagMultivariateSelectOptions {
  id: string
  label: string
  value: string
}

const flagVariationOptions = [
  { label: i18n.varSettingsFlag.stringType.toUpperCase(), value: FlagTypeVariationsSelect.string },
  { label: i18n.varSettingsFlag.jsonType.toUpperCase(), value: FlagTypeVariationsSelect.json },
  { label: i18n.varSettingsFlag.numberType.toUpperCase(), value: FlagTypeVariationsSelect.number }
]

// FIXME: Change any for StepProps
const FlagElemMultivariate: React.FC<StepProps<any> & FlagElemVariationsProps> = props => {
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

  const [flagMultiRules, setFlagMultiRules] = useState<FlagMultivariateSelectOptions[]>([
    { id: 'variations.0.identifier', label: 'Variation 1', value: '1' },
    { id: 'variations.1.identifier', label: 'Variation 2', value: '2' }
  ])

  const handleNewFlagType = (newFlagTypeVal: string): void => {
    toggleFlagType(newFlagTypeVal)
  }

  /**
   * Since we are dynamically creating new fields, on top of the two that already exists
   * i.e. see 'flagMultiRules' length,
   * we are tracking each individual field with Formik name 'variations.<number>.identifier'
   * and it's label it based on the length of an array from 'flagMultiRules',
   * we are putting dummy values because of weird key render bug
   */
  const addNewFlagMultiRules = (): void => {
    const copiedMultiFlagRules = [...flagMultiRules]
    const multiRulesLength = copiedMultiFlagRules.length
    const newFlagMultivariateOption = {
      id: `variations.${multiRulesLength}.identifier`,
      label: `Variation ${multiRulesLength + 1}`,
      value: `${multiRulesLength + 1}`
    }
    setFlagMultiRules(prevState => [...prevState, newFlagMultivariateOption])
  }

  const onDefaultMultiChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const targetElem = e.target
    const copiedMultiFlagRules = [...flagMultiRules]
    const newItemsMultiFlagRules = copiedMultiFlagRules.map(elem => {
      if (elem.id === targetElem.name) {
        return { ...elem, value: targetElem.value, label: targetElem.value }
      }
      return elem
    })
    setFlagMultiRules(newItemsMultiFlagRules)
  }

  const onClickBack = (): void => {
    previousStep?.({ ...prevStepData })
  }

  const kindToSelectValue = useCallback(kind => {
    switch (kind) {
      case FlagTypeVariationsSelect.number:
        return flagVariationOptions[2]
      case FlagTypeVariationsSelect.json:
        return flagVariationOptions[1]
      default:
        return flagVariationOptions[0]
    }
  }, [])

  return (
    <>
      <Formik
        initialValues={{
          kind: FlagTypeVariationsSelect.string,
          variations: [
            { identifier: '', name: '', description: '', value: '' },
            { identifier: '', name: '', description: '', value: '' }
          ],
          defaultOnVariation: '',
          defaultOffVariation: '',
          ...prevStepData
        }}
        onSubmit={vals => {
          const data: FeatureFlagRequestRequestBody = { ...prevStepData, ...vals, project: projectIdentifier }
          onWizardStepSubmit(data)
        }}
      >
        {formikProps => (
          <Form>
            <Container flex height="100%" style={{ flexDirection: 'column', alignItems: 'baseline' }}>
              <Container style={{ flexGrow: 1, overflow: 'auto' }} width="100%">
                <ModalErrorHandler bind={setModalErrorHandler} />
                <Text style={{ fontSize: '18px', color: Color.GREY_700 }} margin={{ bottom: 'xlarge' }}>
                  {i18n.varSettingsFlag.variationSettingsHeading}
                </Text>
                <Layout.Vertical>
                  <Layout.Horizontal>
                    <FormInput.Select
                      name="kind"
                      label={i18n.varSettingsFlag.flagType}
                      items={flagTypeOptions}
                      onChange={newFlagType => handleNewFlagType(newFlagType.value as string)}
                      style={{ width: '35%' }}
                    />
                    <Select
                      value={kindToSelectValue(formikProps.values.kind)}
                      items={flagVariationOptions}
                      className={css.spacingSelectVariation}
                      onChange={kindVariation => {
                        formikProps.setFieldValue('kind', kindVariation.value)
                      }}
                    />
                  </Layout.Horizontal>

                  <Container>
                    <FieldArray name="variations">
                      {arrayProps => {
                        return (
                          <>
                            {formikProps.values?.variations?.map((_: HTMLElement, index: number) => (
                              <Layout.Horizontal key={`flagElem-${index}`}>
                                <FormInput.Text
                                  name={`variations.${index}.identifier`}
                                  label={`${i18n.varSettingsFlag.variation} ${index + 1}`}
                                  style={{ width: '35%' }}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    onDefaultMultiChange(e)
                                    formikProps.setFieldValue(`variations.${index}.value`, e.target.value)
                                  }}
                                />
                                <FormInput.Text
                                  name={`variations.${index}.name`}
                                  label={i18n.nameOptional}
                                  placeholder={i18n.name}
                                  className={css.spacingElemVariation}
                                />
                                <InputDescOptional
                                  text={i18n.descOptional}
                                  inputName={`variations.${index}.description`}
                                  inputPlaceholder={i18n.varSettingsFlag.descVariationsPlaceholder}
                                />
                              </Layout.Horizontal>
                            ))}
                            <Button
                              minimal
                              intent="primary"
                              icon="small-plus"
                              text={i18n.varSettingsFlag.variation}
                              margin={{ bottom: 'large' }}
                              style={{ paddingLeft: 0 }}
                              onClick={() => {
                                arrayProps.push({ identifier: '', name: '', description: '', value: '' })
                                addNewFlagMultiRules()
                              }}
                            />
                          </>
                        )
                      }}
                    </FieldArray>
                  </Container>

                  <Container margin={{ bottom: 'large' }}>
                    <Text
                      color={Color.BLACK}
                      inline
                      tooltip={i18n.varSettingsFlag.defaultRulesTooltip}
                      rightIconProps={{ size: 10, color: Color.BLUE_500 }}
                      rightIcon="info-sign"
                    >
                      {i18n.varSettingsFlag.defaultRules}
                    </Text>
                    <Layout.Vertical margin={{ top: 'medium' }}>
                      <Container>
                        <Layout.Horizontal>
                          <Text width="150px" className={css.serveTextAlign}>
                            {i18n.varSettingsFlag.flagOn}
                          </Text>
                          <FormInput.Select name="defaultOnVariation" items={flagMultiRules} />
                        </Layout.Horizontal>
                      </Container>
                      <Container>
                        <Layout.Horizontal>
                          <Text width="150px" className={css.serveTextAlign}>
                            {i18n.varSettingsFlag.flagOff}
                          </Text>
                          <FormInput.Select name="defaultOffVariation" items={flagMultiRules} />
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
                  type="submit"
                  text={i18n.varSettingsFlag.testFlagOption}
                  onClick={() => {
                    nextStep?.({ ...prevStepData })
                  }}
                  rightIcon="chevron-right"
                  minimal
                  className={css.testFfBtn}
                />
              </Layout.Horizontal>
            </Container>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FlagElemMultivariate
