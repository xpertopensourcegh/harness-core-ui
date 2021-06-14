import * as Yup from 'yup'
import type { DefineYourMonitoringSourceProps } from '@cv/components/CVSetupSourcesView/DefineYourMonitoringSource/DefineYourMonitoringSource'
import type { UseStringsReturn } from 'framework/strings'
import { IdentifierSchemaWithoutHook } from '@common/utils/Validation'

export function getDefineMonitoringSourceBaseProps(
  getString: UseStringsReturn['getString']
): Omit<DefineYourMonitoringSourceProps, 'mainHeading' | 'subHeading' | 'formikProps'> {
  return {
    stepLabelProps: {
      stepNumber: 1,
      totalSteps: 3
    },
    iconLabel: getString('connectors.prometheusLabel'),
    sourceIcon: { name: 'service-prometheus' }
  }
}

export function getValidationSchema(getString: UseStringsReturn['getString']): Record<string, any> {
  return Yup.object({
    monitoringSourceName: Yup.string().required(getString('cv.onboarding.selectProductScreen.validationText.name')),
    identifier: IdentifierSchemaWithoutHook(getString, {
      requiredErrorMsg: getString('cv.onboarding.selectProductScreen.validationText.identifier'),
      regexErrorMsg: getString('cv.onboarding.selectProductScreen.validationText.validIdRegex')
    }),
    connectorRef: Yup.object().required(getString('cv.onboarding.selectProductScreen.validationText.connectorRef')),
    productName: Yup.string().required(getString('cv.onboarding.selectProductScreen.validationText.product'))
  })
}
