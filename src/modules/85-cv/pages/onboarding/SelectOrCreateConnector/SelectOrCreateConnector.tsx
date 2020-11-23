import React from 'react'
import { Container, Link, Text, Layout, Color, IconName } from '@wings-software/uikit'
import { useRouteParams } from 'framework/exports'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import useCreateConnectorModal, {
  UseCreateConnectorModalProps
} from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import i18n from './SelectOrCreateConnector.i18n'
import css from './SelectOrCreateConnector.module.scss'

export interface ConnectorSelectionProps {
  connectorType: ConnectorInfoDTO['type']
  createConnectorText: string
  connectToMonitoringSourceText: string
  firstTimeSetupText: string
  onSuccess?: UseCreateConnectorModalProps['onSuccess']
}

export interface SelectOrCreateConnectorProps extends ConnectorSelectionProps {
  iconName: IconName
  iconLabel: string
  iconSize?: number
}

export const SelectOrCreateConnectorFieldNames = {
  NAME: 'name',
  CONNECTOR_REF: 'connectorRef'
}

export function ConnectorSelection(props: ConnectorSelectionProps): JSX.Element {
  const { connectToMonitoringSourceText, firstTimeSetupText, connectorType, createConnectorText, onSuccess } = props
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()
  const { openConnectorModal } = useCreateConnectorModal({ onSuccess })

  return (
    <Layout.Vertical spacing="xsmall">
      <Text>{connectToMonitoringSourceText}</Text>
      <Text color={Color.GREY_350} font={{ size: 'small' }}>
        {firstTimeSetupText}
      </Text>
      <Layout.Horizontal spacing="medium">
        <FormMultiTypeConnectorField
          name={SelectOrCreateConnectorFieldNames.CONNECTOR_REF}
          label=""
          placeholder={i18n.selectConnector}
          accountIdentifier={accountId}
          projectIdentifier={projectIdentifier as string}
          orgIdentifier={orgIdentifier as string}
          width={300}
          isNewConnectorLabelVisible={false}
          type={connectorType}
          className={css.connectorReference}
        />
        <Link
          withoutHref
          onClick={() => openConnectorModal(true, connectorType || ('' as ConnectorInfoDTO['type']), undefined)}
          height="30px"
        >
          {createConnectorText}
        </Link>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export function SelectOrCreateConnector(props: SelectOrCreateConnectorProps): JSX.Element {
  const { iconName, iconLabel, iconSize, ...connectorSelectionProps } = props

  return (
    <Container className={css.main}>
      <Text font={{ size: 'medium' }} margin={{ top: 'large', bottom: 'large' }}>
        {i18n.heading}
      </Text>
      <CVSelectionCard
        isSelected={true}
        className={css.monitoringCard}
        iconProps={{
          name: iconName,
          size: iconSize ?? 40
        }}
        cardLabel={iconLabel}
        renderLabelOutsideCard={true}
      />
      <AddDescriptionAndTagsWithIdentifier
        identifierProps={{ inputLabel: i18n.name, inputName: SelectOrCreateConnectorFieldNames.NAME }}
      />
      <ConnectorSelection {...connectorSelectionProps} />
    </Container>
  )
}
