import { Color, Container, Heading, Icon, Layout, CardSelect, Text } from '@wings-software/uikit'
import React from 'react'
import i18n from '../useOrganizationModal.i18n'
import css from './OptionsView.module.scss'

export type CreationType = 'NEW' | 'CLONE'

export interface OrganizationCreationType {
  type: CreationType
}

export interface OptionsViewProps {
  onSelectOption: (type: CreationType) => void
}

export const OptionsView: React.FC<OptionsViewProps> = ({ onSelectOption }) => {
  return (
    <Container className={css.optionsViewContainer}>
      <Heading level={2} color={Color.WHITE} style={{ fontSize: '30px' }}>
        {i18n.heading}
      </Heading>
      <Heading level={3} font="small" color={Color.WHITE} margin={{ top: 'large', bottom: 'medium' }}>
        {i18n.recommended}
      </Heading>
      <Layout.Horizontal spacing="large">
        <CardSelect<OrganizationCreationType>
          onChange={value => onSelectOption(value.type)}
          selected={undefined}
          className={css.optionsViewGrid}
          data={[{ type: 'NEW' }]}
          renderItem={(item: OrganizationCreationType) => (
            <Container width={116} height={80}>
              <Layout.Horizontal spacing="xsmall" flex style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                <Icon name="nav-project-hover" size={32} />
                {item.type === 'CLONE' && <Icon name="arrow-right" size={12} />}
                {item.type === 'CLONE' && <Icon name="nav-project-hover" size={32} />}
              </Layout.Horizontal>
              <Text font={{ size: 'small' }} style={{ marginTop: '25px' }}>
                {item.type === 'CLONE' ? i18n.cloneOrg : i18n.newOrg}
              </Text>
            </Container>
          )}
        />
      </Layout.Horizontal>
    </Container>
  )
}
