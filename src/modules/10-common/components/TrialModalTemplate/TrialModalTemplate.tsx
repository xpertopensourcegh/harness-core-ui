import React from 'react'
import { Text, Layout, Icon, Container, Color, IconName } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

interface TrialModalTemplateProps {
  iconName: string
  title: string
  description: string
  imgSrc: string
  children: React.ReactElement
  rightWidth?: string
}

export const TrialModalTemplate: React.FC<TrialModalTemplateProps> = ({
  iconName,
  title,
  description,
  imgSrc,
  children,
  rightWidth = '30%'
}) => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical padding={{ top: 'large', left: 'xxxlarge', bottom: 'large' }}>
      <Layout.Horizontal padding={{ top: 'large' }} spacing="small">
        <Icon name={iconName as IconName} size={20} />
        <Text style={{ color: Color.BLACK, fontSize: 'medium' }}>{title}</Text>
        <Text
          style={{
            backgroundColor: 'var(--orange-500)',
            color: Color.WHITE,
            textAlign: 'center',
            width: 120,
            borderRadius: 3,
            marginLeft: 30,
            display: 'inline-block'
          }}
        >
          {getString('common.trialInProgress')}
        </Text>
      </Layout.Horizontal>
      <Layout.Horizontal padding={{ top: 'large' }}>
        <Container width="57%" padding={{ right: 'xxxlarge' }}>
          <Text style={{ fontSize: 'normal', width: 380, display: 'inline-block', marginLeft: 30, lineHeight: 2 }}>
            {description}
          </Text>
          <img src={imgSrc} style={{ marginLeft: -40, marginTop: -30 }} width={800} height={400} />
        </Container>
        <Container width={rightWidth} padding={{ left: 'xxxlarge' }} border={{ left: true }} height={400}>
          {children}
        </Container>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}
