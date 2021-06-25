import React from 'react'
import { useStrings } from 'framework/strings'
import { StartTrialTemplate } from '@common/components/TrialHomePageTemplate/StartTrialTemplate'
import { useTelemetry } from '@common/hooks/useTelemetry'
import { PageNames } from '@ci/constants/TrackingConstants'
import { Category } from '@common/constants/TrackingConstants'
import bgImageURL from './images/ci.svg'

const CITrialHomePage: React.FC = () => {
  const { getString } = useStrings()

  useTelemetry({ pageName: PageNames.CIStartTrial, category: Category.SIGNUP })

  const startTrialProps = {
    description: getString('ci.ciTrialHomePage.startTrial.description'),
    learnMore: {
      description: getString('ci.learnMore'),
      url: 'https://ngdocs.harness.io/category/zgffarnh1m-ci-category'
    },
    startBtn: {
      description: getString('ci.ciTrialHomePage.startTrial.startBtn.description')
    }
  }

  return (
    <StartTrialTemplate
      title={getString('ci.continuous')}
      bgImageUrl={bgImageURL}
      startTrialProps={startTrialProps}
      module="ci"
    />
  )
}

export default CITrialHomePage
