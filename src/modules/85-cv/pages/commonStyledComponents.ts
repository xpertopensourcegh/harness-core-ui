import styled from '@emotion/styled'
import { Layout } from '@wings-software/uicore'

const MonitoringServicesHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${(props: any) => props?.height || '64px'};
  background: var(--white);
  border-bottom: 1px solid var(--grey-200);
  padding: var(--spacing-medium) var(--spacing-xxxlarge);

  p {
    font-weight: 600;
    font-size: 24px; 
    line-height: 32px;
    margin-top: 3px;
    color: var(--grey-800)
    text-transform: capitalize;
  }
`
MonitoringServicesHeader.displayName = 'MonitoringServicesHeader'

const HorizontalLayout = styled(Layout.Horizontal)`
  display: flex;
  justify-content: space-between;
  ${(props: any) => `align-items: ${props?.alignItem}`};
`

export { HorizontalLayout, MonitoringServicesHeader }
