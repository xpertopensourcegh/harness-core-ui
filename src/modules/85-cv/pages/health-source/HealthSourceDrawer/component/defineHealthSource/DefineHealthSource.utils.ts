import * as Yup from 'yup'
import type { UseStringsReturn } from 'framework/strings'
import { Connectors } from '@connectors/constants'
import { SelectOrCreateConnectorFieldNames } from '@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector'

export const validate = (isEdit: boolean, getString: UseStringsReturn['getString']) => {
  return Yup.object().shape({
    sourceType: Yup.string().trim().required(getString('cv.onboarding.selectProductScreen.validationText.source')),
    healthSourceName: Yup.string().trim().required(getString('cv.onboarding.selectProductScreen.validationText.name')),
    product: Yup.string().trim().required(getString('cv.onboarding.selectProductScreen.validationText.product')),
    [SelectOrCreateConnectorFieldNames.CONNECTOR_REF]: isEdit
      ? Yup.string().trim().required(getString('cv.onboarding.selectProductScreen.validationText.connectorRef'))
      : Yup.object().required(getString('cv.onboarding.selectProductScreen.validationText.connectorRef'))
  })
}

export const getFeatureOption = (type: string, getString: UseStringsReturn['getString']) => {
  switch (type) {
    case Connectors.APP_DYNAMICS:
      return [
        {
          value: 'Application Monitoring',
          label: getString('cv.monitoringSources.appD.product.applicationMonitoring')
        }
      ]
    default:
      return []
  }
}
