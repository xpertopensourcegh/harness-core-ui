import { RestrictionType } from '@common/constants/SubscriptionTypes'
import { useDeepCompareEffect } from '@common/hooks'
import {
  useFeaturesContext,
  FeatureRequestOptions,
  FeatureRequest,
  CheckFeatureReturn,
  FeaturesRequest,
  CheckFeaturesReturn
} from 'framework/featureStore/FeaturesContext'
import { FeatureFlag } from '@common/featureFlags'
import type { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'
import { useFeatureFlag } from './useFeatureFlag'

interface FeatureProps {
  featureRequest?: FeatureRequest
  options?: FeatureRequestOptions
}

interface FeaturesProps {
  featuresRequest?: FeaturesRequest
  options?: FeatureRequestOptions
}

export function useFeature(props: FeatureProps): CheckFeatureReturn {
  const { requestFeatures, checkFeature, requestLimitFeature, checkLimitFeature, getRestrictionType } =
    useFeaturesContext()

  const featureEnforced = useFeatureFlag(FeatureFlag.FEATURE_ENFORCEMENT_ENABLED)

  const { featureRequest, options } = props
  const restrictionType = getRestrictionType(featureRequest)
  const isLimit = restrictionType && restrictionType !== RestrictionType.AVAILABILITY

  useDeepCompareEffect(() => {
    if (featureEnforced && featureRequest) {
      if (isLimit) {
        requestLimitFeature(featureRequest)
      } else {
        // cache enabled availability feature list in the context
        // restrictionType could be undefined, we don't do anything
        restrictionType && requestFeatures(featureRequest, options)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureRequest, options, isLimit, featureEnforced, restrictionType])

  if (!featureEnforced || featureRequest === undefined) {
    return { enabled: true }
  }

  // rate limit feature always calls the api in real time
  return isLimit ? checkLimitFeature(featureRequest.featureName) : checkFeature(featureRequest.featureName)
}

export function useFeatures(props: FeaturesProps): CheckFeaturesReturn {
  const { requestFeatures, checkFeature, requestLimitFeature, checkLimitFeature, getRestrictionType } =
    useFeaturesContext()

  const featureEnforced = useFeatureFlag(FeatureFlag.FEATURE_ENFORCEMENT_ENABLED)

  const features = new Map<FeatureIdentifier, CheckFeatureReturn>()
  const { featuresRequest, options } = props

  function groupFeatures(): { limitFeatures: FeatureIdentifier[]; availFeatures: FeatureIdentifier[] } {
    const accLimitFeatures: FeatureIdentifier[] = []
    const accAvailFeatures: FeatureIdentifier[] = []
    featuresRequest?.featureNames.forEach(featureName => {
      const restrictionType = getRestrictionType({ featureName })
      const isLimit = restrictionType && restrictionType !== RestrictionType.AVAILABILITY
      if (isLimit) {
        accLimitFeatures.push(featureName)
      } else {
        // restrictionType could be undefined, we don't do anything
        restrictionType && accAvailFeatures.push(featureName)
      }
    })
    return { limitFeatures: accLimitFeatures, availFeatures: accAvailFeatures }
  }
  const { limitFeatures, availFeatures } = groupFeatures()

  useDeepCompareEffect(() => {
    if (featureEnforced && featuresRequest) {
      if (limitFeatures.length > 0) {
        // every limit feature needs real time inquiry
        limitFeatures.forEach(featureName => {
          requestLimitFeature({ featureName })
        })
      }
      if (availFeatures.length > 0) {
        // cache enabled availability feature list in the context
        requestFeatures(featuresRequest, options)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, featureEnforced, limitFeatures, availFeatures])

  if (!featureEnforced) {
    if (featuresRequest) {
      const { featureNames } = featuresRequest
      featureNames.forEach(featureName => {
        features.set(featureName, { enabled: true })
      })
    }
    return { features }
  }

  limitFeatures.forEach(featureName => {
    features.set(featureName, checkLimitFeature(featureName))
  })

  availFeatures.forEach(featureName => {
    features.set(featureName, checkFeature(featureName))
  })

  return { features }
}
