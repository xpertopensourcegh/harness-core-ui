import React, { useState } from 'react'
import { Button, Heading, Color, Container, Layout, IconName, Icon, Text } from '@wings-software/uicore'
import { String, useStrings } from 'framework/strings'
import { useQueryParams } from '@common/hooks'
import type { StringsMap } from 'stringTypes'
import type { Module } from '@common/interfaces/RouteInterfaces'
import ModuleInfoCards, { ModuleInfoCard, INFO_CARD_PROPS } from '@common/components/ModuleInfoCards/ModuleInfoCards'

export interface StartTrialModalContentProps {
  handleStartTrial?: () => void
  module: Module
}

const StartTrialModalContent: React.FC<StartTrialModalContentProps> = props => {
  const { handleStartTrial, module } = props

  const { getString } = useStrings()
  const { source } = useQueryParams<{ source?: string }>()
  const initialSelectedInfoCard = INFO_CARD_PROPS[module] ? INFO_CARD_PROPS[module][0] : undefined
  const [selectedInfoCard, setSelectedInfoCard] = useState<ModuleInfoCard | undefined>(initialSelectedInfoCard)

  function getModuleButton(): React.ReactElement {
    function handleOnClick(): void {
      if (!selectedInfoCard || selectedInfoCard?.isNgRoute) {
        handleStartTrial?.()
      } else if (selectedInfoCard?.route) {
        window.location.href = selectedInfoCard.route
        return
      }
    }

    const getButtonText = (): string | undefined => {
      if (source) {
        return getString('continue')
      }
      if (selectedInfoCard?.route) {
        return getString('common.launchFirstGen' as keyof StringsMap, { module: module.toUpperCase() })
      }
      return getString('common.startTrial' as keyof StringsMap, { module: module.toUpperCase() })
    }

    return (
      <Button
        style={{
          width: 270,
          borderRadius: 4,
          lineHeight: 2.5,
          textAlign: 'center',
          padding: 19
        }}
        intent="primary"
        text={getButtonText()}
        onClick={handleOnClick}
      />
    )
  }

  function getContentHeader(): React.ReactElement {
    const moduleName = module.toLowerCase()

    const title = getString(`${moduleName}.continuous` as keyof StringsMap)
    return (
      <>
        <Heading
          color={Color.BLACK}
          font={{ size: 'large', weight: 'bold' }}
          padding={{ top: 'xxlarge' }}
          style={{ marginBottom: 30 }}
        >
          {getString('common.purpose.welcome')}
        </Heading>
        <Layout.Horizontal spacing="small">
          <Icon name={`${moduleName}-main` as IconName} size={25} />
          <Text font={{ size: 'medium', weight: 'semi-bold' }}>{title}</Text>
        </Layout.Horizontal>
      </>
    )
  }

  function getWarningBanner(): React.ReactElement | undefined {
    if (selectedInfoCard?.route) {
      const warningText = getString('common.ce.visibilityWarning')

      return (
        <Container
          padding="medium"
          intent="warning"
          flex={{
            justifyContent: 'start'
          }}
          background="yellow100"
          font={{
            align: 'center'
          }}
          border={{
            color: 'yellow500'
          }}
        >
          <Icon name={`deployment-incomplete-new`} size={25} style={{ marginRight: 10 }} />
          <Text color={Color.BLACK}>{warningText}</Text>
        </Container>
      )
    }
  }

  const infoCards = module && (
    <ModuleInfoCards
      style={{ marginRight: 300 }}
      module={module}
      selectedInfoCard={selectedInfoCard}
      setSelectedInfoCard={setSelectedInfoCard}
    />
  )

  const button = getModuleButton()

  const contentHeader = getContentHeader()

  const warningBanner = module === 'ce' ? getWarningBanner() : null

  return (
    <Layout.Vertical key={module} spacing="large" padding={{ bottom: 'xxxlarge' }}>
      {contentHeader}
      <String
        style={{ lineHeight: 2, fontSize: 'small' }}
        stringID={`common.purpose.${module}.description` as keyof StringsMap}
        useRichText={true}
      />
      {infoCards}
      {warningBanner}
      {button}
    </Layout.Vertical>
  )
}

export default StartTrialModalContent
