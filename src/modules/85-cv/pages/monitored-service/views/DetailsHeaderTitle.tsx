import React from 'react'
import { Classes } from '@blueprintjs/core'
import { Layout, Container, Text, Color, FontVariation, Heading } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { TitleProps } from '../MonitoredServicePage.types'

const DetailsHeaderTitle: React.FC<TitleProps> = ({ loading, monitoredService }) => {
  const { getString } = useStrings()

  if (loading) {
    return (
      <Layout.Vertical flex spacing="small" height={45}>
        <Container height={22} width={300} className={Classes.SKELETON} />
        <Container height={15} width={300} className={Classes.SKELETON} />
      </Layout.Vertical>
    )
  }

  return (
    <Layout.Horizontal spacing="small" height={45}>
      {/* <Icon margin={{ right: 'xsmall' }} name="infrastructure" size={40}></Icon> */}
      <Container>
        <Layout.Horizontal flex spacing="small">
          <Heading level={3} color={Color.GREY_800} font={{ variation: FontVariation.H5 }}>
            {monitoredService?.name}
          </Heading>
          <Text color={Color.GREY_500} font={{ variation: FontVariation.SMALL_SEMI }}>
            {getString('idLabel', { id: monitoredService?.identifier })}
          </Text>
        </Layout.Horizontal>
        <Text color={Color.GREY_700} font={{ variation: FontVariation.BODY }}>
          {monitoredService?.description}
        </Text>
      </Container>
    </Layout.Horizontal>
  )
}

export default DetailsHeaderTitle
