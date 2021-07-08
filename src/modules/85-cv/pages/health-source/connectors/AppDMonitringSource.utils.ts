import type { updatedHealthSource } from '../HealthSourceDrawer/HealthSourceDrawerContent'

const createAppDPayload = (formData: any): updatedHealthSource => {
  const healthSourcesPayload = {
    name: formData.healthSourceName as string,
    environment: formData.environmentIdentifier as string,
    service: formData.serviceIdentifier as string,
    identifier: formData.healthSourceidentifier as string,
    type: 'AppDynamics' as any,
    spec: {
      connectorRef: (formData?.connectorRef?.connector?.identifier as string) || (formData.connectorRef as string),
      feature: formData.product as string,
      appdApplicationName: formData.appdApplication as string,
      appdTierName: formData.appDTier as string,
      metricPacks: Object.entries(formData.metricAppD)
        .map(item => {
          // item [key , value] = ['Error', true]
          return item[1]
            ? {
                identifier: item[0] // 'Error': true
              }
            : {}
        })
        .filter(item => !!item)
    }
  }

  return healthSourcesPayload
}

export { createAppDPayload }
