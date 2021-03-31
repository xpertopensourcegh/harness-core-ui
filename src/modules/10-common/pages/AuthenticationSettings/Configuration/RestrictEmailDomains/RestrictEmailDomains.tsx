import React from 'react'
import cx from 'classnames'
import { Container, Card, Switch, Text, Color, Icon } from '@wings-software/uicore'
import { TagInput } from '@blueprintjs/core'
import { useStrings } from 'framework/exports'
import { useRestrictEmailDomains } from '@common/modals/RestrictEmailDomains/useRestrictEmailDomains'
import configCss from '@common/pages/AuthenticationSettings/Configuration/Configuration.module.scss'
import css from '@common/pages/AuthenticationSettings/Configuration/RestrictEmailDomains/RestrictEmailDomains.module.scss'

const RestrictEmailDomains: React.FC = () => {
  const { getString } = useStrings()
  const { openRestrictEmailDomainsModal } = useRestrictEmailDomains()
  const restrictedEmailDomains: string[] = []

  const label = (
    <Text inline color={Color.BLACK} font={{ weight: 'bold', size: 'normal' }}>
      {getString('authenticationSettings.allowUsersWIthEmails')}
    </Text>
  )

  return (
    <Container margin="xlarge" border={{ radius: 4 }}>
      <Card className={cx(css.card, configCss.shadow)}>
        <Switch labelElement={label} defaultChecked padding={{ bottom: 'medium' }} />
        <TagInput
          disabled
          values={restrictedEmailDomains}
          rightElement={
            <Icon
              name="edit"
              intent="primary"
              margin="small"
              className={css.editIcon}
              onClick={openRestrictEmailDomainsModal}
            />
          }
          className={css.input}
          tagProps={{ minimal: true }}
        />
      </Card>
    </Container>
  )
}

export default RestrictEmailDomains
