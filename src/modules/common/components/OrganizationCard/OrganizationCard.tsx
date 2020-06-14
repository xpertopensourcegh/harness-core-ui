import { IconName, Card, Color, Container, Icon, Layout, SimpleTagInput, Text } from '@wings-software/uikit'
import React from 'react'
import css from './OrganizationCard.module.scss'
import cx from 'classnames'
import type { OrganizationDTO } from 'modules/common/types/dto/OrganizationDTO'
import i18n from './OrganizationCard.i18n'

interface OrganizationCardProps {
  data: OrganizationDTO
  width?: number
  isPreview?: boolean
  className?: string
  onClick?: () => void
}

//
// TODO:
//  - Icon is not supported by backend yet
//  - Color is not implemented
export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  data = {},
  width = 250,
  isPreview,
  className,
  onClick
}) => {
  return (
    <Card
      elevation={isPreview ? 2 : undefined}
      interactive={!isPreview}
      className={cx(css.card, className)}
      onClick={onClick}
    >
      <Container width={width}>
        <Layout.Vertical spacing="small" padding={{ right: isPreview ? 'large' : undefined }}>
          <Icon name={(data?.icon as IconName) || 'placeholder'} size={42} />
          <Text font="medium" color={Color.BLACK}>
            {data?.name || i18n.placeholder.name}
          </Text>
          <Text style={{ color: 'var(--grey-350)' }}>{data?.description || i18n.placeholder.description}</Text>
          <Layout.Horizontal className={css.tagsncollabs}>
            <SimpleTagInput readonly fill noInputBorder items={[]} selectedItems={data?.tags} />
            <Container>
              <Layout.Vertical style={{ alignItems: 'center' }}>
                <Text color={Color.BLACK} style={{ fontSize: '8px', whiteSpace: 'nowrap' }}>
                  YOU
                </Text>
                <Icon size={24} name="user" />
              </Layout.Vertical>
            </Container>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Container>
    </Card>
  )
}
