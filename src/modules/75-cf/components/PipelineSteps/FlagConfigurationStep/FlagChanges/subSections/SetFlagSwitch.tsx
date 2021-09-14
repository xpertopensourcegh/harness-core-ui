import React, { FC } from 'react'
import SubSection, { SubSectionProps } from '../SubSection'

const SetFlagSwitch: FC<SubSectionProps> = props => (
  <SubSection data-testid="flagChanges-setFlagSwitch" {...props}>
    <p>Set Flag Switch</p>
  </SubSection>
)

export default SetFlagSwitch
