import React, { useState } from 'react'
import { Card, FontVariation, Layout, Text } from '@wings-software/uicore'
import { TimeRangeToDays, useLandingDashboardContext } from '@common/factories/LandingDashboardContext'
import { useStrings } from 'framework/strings'
import TimeRangeSelect from '../TimeRangeSelect/TimeRangeSelect'

import OverviewGlanceCards from '../OverviewGlanceCards/OverviewGlanceCards'
import css from './LandingDashboardSummaryWidget.module.scss'

const LandingDashboardSummaryWidget: React.FC = () => {
  const { selectedTimeRange } = useLandingDashboardContext()
  const { getString } = useStrings()
  const [range] = useState([Date.now() - TimeRangeToDays[selectedTimeRange] * 24 * 60 * 60000, Date.now()])

  return (
    <div style={{ position: 'relative' }}>
      <TimeRangeSelect className={css.timeRangeSelect} />
      <Layout.Horizontal className={css.atGlanceWrapper} spacing="large">
        <OverviewGlanceCards range={range} />
        <Card className={css.topProjectContainer}>
          <Layout.Vertical>
            <Text font={{ variation: FontVariation.CARD_TITLE }}>
              {getString('projectsOrgs.landingDashboard.title', { timeRange: selectedTimeRange })}
            </Text>
          </Layout.Vertical>
        </Card>
      </Layout.Horizontal>
    </div>
  )
}

export default LandingDashboardSummaryWidget
