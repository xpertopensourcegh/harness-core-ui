import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Container,
  FlexExpander,
  Formik,
  FormInput,
  Layout,
  MultiTypeInputType,
  SelectOption,
  Text,
  PageError
} from '@wings-software/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { Link, useParams } from 'react-router-dom'
import { get } from 'lodash-es'
import type { StepFormikFowardRef, StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { CF_DEFAULT_PAGE_SIZE, getErrorMessage } from '@cf/utils/CFUtils'
import { useGetAllFeatures, useGetAllSegments, useGetAllTargetAttributes } from 'services/cf'
import { useStrings } from 'framework/strings'
import { useEnvironmentSelectV2 } from '@cf/hooks/useEnvironmentSelectV2'
import routes from '@common/RouteDefinitions'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import type { StringsMap } from 'stringTypes'
import type { FlagConfigurationStepData, FlagConfigurationStepFormData } from './types'
import FlagChanges from './FlagChanges/FlagChanges'

/**
 * Spec: https://harness.atlassian.net/wiki/spaces/FFM/pages/1446084831/APIs+for+creating+and+executing+Pipelines
 */

export interface FlagConfigurationStepProps {
  initialValues: FlagConfigurationStepFormData
  isNewStep?: boolean
  isDisabled?: boolean
  onUpdate?: (data: FlagConfigurationStepFormData) => void
  stepViewType?: StepViewType
  readonly: boolean
}

export function FlagConfigurationStepWidget(
  props: FlagConfigurationStepProps,
  formikRef: StepFormikFowardRef<FlagConfigurationStepData>
): React.ReactElement {
  const { getString } = useStrings()
  const { initialValues, onUpdate, isNewStep, isDisabled } = props
  const stepString = (key: string): string => getString(`cf.pipeline.flagConfiguration.${key}` as keyof StringsMap)
  const [environmentIdentifier, setEnvironmentIdentifier] = useState(initialValues.spec.environment)
  const {
    environments,
    loading: loadingEnvironments,
    error: errorEnvironments,
    refetch: refetchEnvironments
  } = useEnvironmentSelectV2({
    selectedEnvironmentIdentifier: initialValues.spec.environment,
    onChange: opt => {
      setEnvironmentIdentifier(opt.value as string)
    }
  })
  const { accountId, orgIdentifier, projectIdentifier } = useParams<Record<string, string>>()
  const queryParams = useMemo(
    () => ({
      account: accountId,
      accountIdentifier: accountId,
      org: orgIdentifier,
      project: projectIdentifier,
      environment: environmentIdentifier,
      pageSize: CF_DEFAULT_PAGE_SIZE,
      identifier: initialValues.spec.featureFlag
    }),
    [accountId, orgIdentifier, projectIdentifier, environmentIdentifier, initialValues.spec.featureFlag]
  )
  const {
    data: featuresData,
    loading: loadingFeatures,
    error: errorFeatures,
    refetch: refetchFeatures
  } = useGetAllFeatures({
    queryParams
  })
  const {
    data: targetGroupsData,
    loading: loadingTargetGroups,
    error: errorTargetGroups,
    refetch: refetchTargetGroups
  } = useGetAllSegments({ queryParams: { ...queryParams, identifier: undefined } })

  const {
    data: targetAttributesData,
    loading: loadingTargetAttributes,
    error: errorTargetAttributes,
    refetch: refetchTargetAttributes
  } = useGetAllTargetAttributes({ queryParams: { ...queryParams } })

  const formik = useRef<FormikProps<FlagConfigurationStepFormData> | null>(null)
  const [loadingFromFocus, setLoadingFromFocus] = useState(false)

  useEffect(() => {
    if (initialValues?.spec?.environment && environments?.length) {
      const selectedEnvironment = environments.find(env => env.identifier === initialValues.spec.environment)

      if (selectedEnvironment) {
        formik.current?.setFieldValue('spec.environment', {
          label: selectedEnvironment.name,
          value: selectedEnvironment.identifier
        })
      }
    }

    if (initialValues?.spec?.featureFlag && featuresData?.features?.length) {
      const selectedFeature = featuresData.features.find(
        feature => feature.identifier === initialValues.spec.featureFlag
      )

      if (selectedFeature) {
        formik.current?.setFieldValue('spec.featureFlag', {
          label: selectedFeature.name,
          value: selectedFeature.identifier
        })
      }
    }
  }, [environments, featuresData, initialValues, formik])

  const scheduleSearchByFlagNameTimeoutRef = useRef(0)
  const scheduleSearchByFlagName = useCallback(
    name => {
      clearTimeout(scheduleSearchByFlagNameTimeoutRef.current)
      scheduleSearchByFlagNameTimeoutRef.current = window.setTimeout(() => {
        setLoadingFromFocus(true)
        refetchFeatures({ queryParams: { ...queryParams, name, identifier: undefined } }).finally(() => {
          setLoadingFromFocus(false)
        })
      }, 250)
    },
    [queryParams, refetchFeatures]
  )

  const loading =
    !loadingFromFocus && (loadingEnvironments || loadingFeatures || loadingTargetGroups || loadingTargetAttributes)
  const error = errorEnvironments || errorFeatures || errorTargetGroups || errorTargetAttributes

  if (loading) {
    return (
      <Container height="100%" width="100%" padding={{ top: 'huge' }}>
        <ContainerSpinner />
      </Container>
    )
  }

  if (error) {
    return (
      <Container padding={{ top: 'huge' }}>
        <PageError
          message={getErrorMessage(error)}
          width={450}
          onClick={() => {
            refetchFeatures()
            refetchEnvironments()
            refetchTargetGroups()
            refetchTargetAttributes()
          }}
        />
      </Container>
    )
  }

  return (
    <Formik<FlagConfigurationStepFormData>
      formName="FeatureFlagConfigurationForm"
      onSubmit={values => {
        onUpdate?.(values)
      }}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
        spec: Yup.object().shape({
          environment: Yup.string().required(stepString('environmentRequired')),
          featureFlag: Yup.mixed().required(stepString('flagRequired'))
        })
      })}
    >
      {(_formik: FormikProps<FlagConfigurationStepFormData>) => {
        setFormikRef(formikRef, _formik) // this is required
        formik.current = _formik

        const formEnvironmentIdentifier = get(_formik.values, 'spec.environment.value')
        const formFeatureFlagIdentifier = get(_formik.values, 'spec.featureFlag.value')

        const currentFeature = featuresData?.features?.find(
          ({ identifier }) => identifier === formFeatureFlagIdentifier
        )

        return (
          <Layout.Vertical padding={{ right: 'xlarge' }}>
            <FormInput.InputWithIdentifier
              isIdentifierEditable={isNewStep && !isDisabled}
              inputLabel={stepString('stepName')}
              inputGroupProps={{ disabled: isDisabled }}
            />
            <FormInput.MultiTypeInput
              name="spec.environment"
              selectItems={
                environments?.map<SelectOption>(env => ({
                  label: env.name as string,
                  value: env.identifier as string
                })) || []
              }
              label={stepString('selectEnvironment')}
              disabled={isDisabled}
              multiTypeInputProps={{
                disabled: isDisabled,
                allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]
              }}
            />
            <FormInput.MultiTypeInput
              name="spec.featureFlag"
              selectItems={
                featuresData?.features?.map(({ identifier: value, name: label }) => ({ value, label })) || []
              }
              label={
                (
                  <Container flex>
                    <Text>{stepString('selectFlag')}</Text>
                    <FlexExpander />
                    {!!formFeatureFlagIdentifier && (
                      <Link
                        to={
                          routes.toCFFeatureFlagsDetail({
                            accountId,
                            orgIdentifier: orgIdentifier as string,
                            projectIdentifier: projectIdentifier as string,
                            featureFlagIdentifier: formFeatureFlagIdentifier
                          }) + `${formEnvironmentIdentifier ? `?activeEnvironment=${formEnvironmentIdentifier}` : ''}`
                        }
                        target="_blank"
                        style={{ fontSize: 'var(--font-size-small)' }}
                      >
                        {stepString('viewDetail')}
                      </Link>
                    )}
                  </Container>
                ) as unknown as string
              }
              disabled={isDisabled}
              multiTypeInputProps={{
                disabled: isDisabled,
                allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME],
                onInput: event => {
                  scheduleSearchByFlagName(get(event, 'target.value'))
                },
                onFocus: async () => {
                  if (formFeatureFlagIdentifier) {
                    setLoadingFromFocus(true)
                    await refetchFeatures({ queryParams: { ...queryParams, identifier: undefined } })
                    setLoadingFromFocus(false)
                  }
                }
              }}
            />

            <FlagChanges
              targetGroups={targetGroupsData?.segments || []}
              variations={currentFeature?.variations || []}
              spec={initialValues.spec}
              clearField={(fieldName: string) => _formik.setFieldValue(fieldName, undefined)}
              fieldValues={_formik.values}
              targetAttributes={targetAttributesData || []}
            />
          </Layout.Vertical>
        )
      }}
    </Formik>
  )
}

export const FlagConfigurationStepWidgetWithRef = React.forwardRef(FlagConfigurationStepWidget)
