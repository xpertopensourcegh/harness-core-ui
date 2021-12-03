import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Container, FontVariation, Color, Heading, Text, Layout } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import routes from '@common/RouteDefinitions'
import ContextMenuActions from '@cv/components/ContextMenuActions/ContextMenuActions'
import type { SLOCardHeaderProps } from '../CVSLOsListingPage.types'

const SLOCardHeader: React.FC<SLOCardHeaderProps> = ({
  name,
  identifier,
  monitoredServiceRef,
  serviceLevelIndicators,
  healthSourceRef,
  monitoredServiceIdentifier,
  onDelete
}) => {
  const history = useHistory()
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()

  const onEdit = (): void => {
    history.push({
      pathname: routes.toCVEditSLOs({
        identifier,
        accountId,
        orgIdentifier,
        projectIdentifier,
        module: 'cv'
      })
    })
  }

  return (
    <>
      <Container flex margin={{ bottom: 'medium' }}>
        <Heading level={2} font={{ variation: FontVariation.CARD_TITLE }} color={Color.GREY_600}>
          {name}
        </Heading>
        {!monitoredServiceIdentifier && (
          <ContextMenuActions
            titleText={getString('common.delete', { name })}
            contentText={<Text color={Color.GREY_800}>{getString('cv.slos.confirmDeleteSLO', { name })}</Text>}
            confirmButtonText={getString('yes')}
            deleteLabel={getString('cv.slos.deleteSLO')}
            onDelete={() => onDelete(identifier, name)}
            editLabel={getString('cv.slos.editSLO')}
            onEdit={onEdit}
          />
        )}
      </Container>

      <Container flex>
        <Layout.Vertical spacing="xsmall">
          <Layout.Horizontal spacing="xsmall">
            <Text font={{ variation: FontVariation.SMALL }} color={Color.GREY_400}>
              {getString('connectors.cdng.monitoredService.label')}:
            </Text>
            <Text font={{ variation: FontVariation.SMALL_BOLD }} color={Color.GREY_400}>
              {monitoredServiceRef}
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal spacing="xsmall">
            <Text font={{ variation: FontVariation.SMALL }} color={Color.GREY_400}>
              {getString('cv.slos.sliType')}:
            </Text>
            <Text font={{ variation: FontVariation.SMALL_BOLD }} color={Color.GREY_400}>
              {serviceLevelIndicators[0]?.type}
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal spacing="xsmall">
            <Text font={{ variation: FontVariation.SMALL }} color={Color.GREY_400}>
              {getString('cv.slos.healthSource')}:
            </Text>
            <Text font={{ variation: FontVariation.SMALL_BOLD }} color={Color.GREY_400}>
              {healthSourceRef}
            </Text>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Container>
    </>
  )
}

export default SLOCardHeader
