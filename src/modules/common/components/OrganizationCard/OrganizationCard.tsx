import {
  IconName,
  Card,
  Color,
  Container,
  Icon,
  Layout,
  SimpleTagInput,
  Text,
  CardBody,
  Utils
} from '@wings-software/uikit'
import React from 'react'
import css from './OrganizationCard.module.scss'
import cx from 'classnames'
import type { OrganizationDTO } from 'services/cd-ng'
import i18n from './OrganizationCard.i18n'
import { Menu } from '@blueprintjs/core'
import { Classes } from '@blueprintjs/core'

interface OrganizationCardProps {
  data: OrganizationDTO
  width?: number
  isPreview?: boolean
  className?: string
  onClick?: () => void
}

// TODO: Remove this when icon is implemented
const icons = [
  'harness',
  'placeholder',
  'service-gotlab',
  'service-datadog',
  'service-github',
  'service-gcp',
  'service-jenkins',
  'service-slack'
]

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
      elevation={2}
      interactive={!isPreview}
      className={cx(css.card, className)}
      onClick={onClick}
      style={{ borderLeft: `5px solid ${data?.color || 'transparent'}` }}
    >
      <CardBody.Menu
        menuContent={
          <Menu>
            <Menu.Item icon="edit" text={i18n.edit} />
            <Menu.Item icon="duplicate" text={i18n.clone} onClick={Utils.stopEvent} />
            <Menu.Item icon="cross" text={i18n.delete} onClick={Utils.stopEvent} />
          </Menu>
        }
        menuPopoverProps={{
          className: Classes.DARK
        }}
      >
        <Container width={width}>
          <Layout.Vertical spacing="small" padding={{ right: isPreview ? 'large' : undefined }}>
            <Icon name={icons[Math.floor(Math.random() * icons.length)] as IconName} size={42} />
            <Text font="medium" color={Color.BLACK}>
              {data?.name || i18n.placeholder.name}
            </Text>
            <Text style={{ color: 'var(--grey-350)' }} lineClamp={isPreview ? 5 : undefined}>
              {data?.description || i18n.placeholder.description}
            </Text>
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
      </CardBody.Menu>
    </Card>
  )
}
