import { useEffect } from 'react'
import telemetry from 'framework/utils/Telemetry'
import AppStorage from 'framework/utils/AppStorage'

type TrackEvent = (eventName: string, properties: Record<string, string>) => void
type IdentifyUser = (email: string | undefined) => void
interface PageParams {
  pageName?: string
  category?: string
  properties?: Record<string, string>
}
interface TelemetryReturnType {
  trackEvent: TrackEvent
  identifyUser: IdentifyUser
}

const userId = AppStorage.get('email')
const groupId = AppStorage.get('acctId')

export function useTelemetry(pageParams: PageParams = {}): TelemetryReturnType {
  useEffect(() => {
    pageParams.pageName &&
      telemetry.page({
        name: pageParams.pageName,
        category: pageParams.category || '',
        properties: { userId, groupId, ...pageParams.properties } || {}
      })
  }, [pageParams.pageName, pageParams.category, pageParams.properties])
  const trackEvent: TrackEvent = (eventName: string, properties: Record<string, string>) => {
    telemetry.track({ event: eventName, properties: { userId, groupId, ...properties } })
  }
  const identifyUser: IdentifyUser = (email: string | undefined) => {
    if (!email) return
    telemetry.identify(email)
  }
  return { trackEvent, identifyUser }
}
