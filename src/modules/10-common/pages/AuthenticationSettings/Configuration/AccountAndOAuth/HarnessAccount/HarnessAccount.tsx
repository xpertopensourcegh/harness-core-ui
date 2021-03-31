import React, { ReactNode } from 'react'
import cx from 'classnames'
import { NestedAccordionPanel, Switch, Color, Layout, Text, Icon, Container } from '@wings-software/uicore'
import { usePasswordStrength } from '@common/modals/PasswordStrength/usePasswordStrength'
import { usePasswordExpiration } from '@common/modals/PasswordExpiration/usePasswordExpiration'
import { useLockoutPolicy } from '@common/modals/LockoutPolicy/useLockoutPolicy'
import { useStrings } from 'framework/exports'
import configCss from '@common/pages/AuthenticationSettings/Configuration/Configuration.module.scss'
import accAndOAuthCss from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/AccountAndOAuth.module.scss'
import css from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/HarnessAccount/HarnessAccount.module.scss'

interface Summary {
  label: string
  defaultChecked?: boolean
}

interface AccountSecurityChecks {
  label: string
  details: {
    title?: string
    list: {
      subTitle: string
      value?: number | string | ReactNode
    }[]
  }
  onClick: () => void
}

const Summary: React.FC<Summary> = ({ label, defaultChecked }) => (
  <Switch
    label={label}
    defaultChecked={defaultChecked}
    font={{ weight: 'semi-bold', size: 'normal' }}
    color={Color.GREY_800}
  />
)

const Details: React.FC = () => {
  const { getString } = useStrings()
  const { openPasswordStrengthModal } = usePasswordStrength()
  const { openPasswordExpirationModal } = usePasswordExpiration()
  const { openLockoutPolicyModal } = useLockoutPolicy()

  const accountSecurityChecks: AccountSecurityChecks[] = [
    {
      label: getString('authenticationSettings.enforcePasswordStrength'),
      details: {
        title: getString('authenticationSettings.passwordMustFulfillReq'),
        list: [
          {
            subTitle: getString('authenticationSettings.atLeast8Chars')
          }
        ]
      },
      onClick: openPasswordStrengthModal
    },
    {
      label: getString('authenticationSettings.periodicallyExpirePassword'),
      details: {
        title: getString('authenticationSettings.periodicallyExpirePasswordNote'),
        list: [
          {
            subTitle: getString('authenticationSettings.daysBeforePasswordExpires'),
            value: 90
          },
          {
            subTitle: getString('authenticationSettings.daysBeforeUserNotified'),
            value: 5
          }
        ]
      },
      onClick: openPasswordExpirationModal
    },
    {
      label: getString('authenticationSettings.enforceLockoutPolicy'),
      details: {
        list: [
          {
            subTitle: getString('authenticationSettings.failedLoginsBeforeLockedAccount'),
            value: 5
          },
          {
            subTitle: getString('authenticationSettings.lockoutDuration'),
            value: (
              <>
                <Text color={Color.GREY_800} font={{ weight: 'bold' }} padding={{ left: 'xsmall', right: 'xsmall' }}>
                  25
                </Text>
                {getString('hours')}
              </>
            )
          },
          {
            subTitle: getString('authenticationSettings.notifyUsersWhenTheyLocked'),
            value: getString('no')
          },
          {
            subTitle: getString('authenticationSettings.notifyUsersWHenUserLocked'),
            value: getString('none')
          }
        ]
      },
      onClick: openLockoutPolicyModal
    },
    {
      label: getString('authenticationSettings.enforceTwoFA'),
      details: {
        list: []
      },
      onClick: openPasswordStrengthModal
    }
  ]

  return (
    <Layout.Vertical spacing="small" margin={{ left: 'small', right: 'small', bottom: 'small' }}>
      {accountSecurityChecks.map(({ label, details, onClick }) => (
        <NestedAccordionPanel
          key={label}
          id={label}
          summary={<Summary label={label} />}
          details={
            <Layout.Vertical
              spacing="small"
              padding={{ left: 'xxxlarge', top: 'medium', bottom: 'medium', right: 'medium' }}
              className={css.passwordChecksDiv}
            >
              <Icon name="edit" intent="primary" margin="small" className={css.editIcon} onClick={onClick} />
              {details.title && (
                <Text margin={{ bottom: 'xsmall' }} color={Color.BLACK}>
                  {details.title}
                </Text>
              )}
              {details.list.map(({ subTitle, value }) => (
                <Container flex={{ justifyContent: 'flex-start' }} key={subTitle}>
                  <Text color={Color.GREY_800} icon="dot">
                    {subTitle}:
                    {React.isValidElement(value) ? (
                      value
                    ) : (
                      <Text color={Color.GREY_800} font={{ weight: 'bold' }} padding={{ left: 'xsmall' }}>
                        {value}
                      </Text>
                    )}
                  </Text>
                </Container>
              ))}
            </Layout.Vertical>
          }
          summaryClassName={configCss.nestedSummary}
          panelClassName={cx(configCss.shadow)}
          detailsClassName={configCss.nestedDetails}
        />
      ))}
    </Layout.Vertical>
  )
}

const HarnessAccount: React.FC = () => {
  const { getString } = useStrings()
  return (
    <NestedAccordionPanel
      isDefaultOpen
      id="account"
      summary={<Summary label={getString('authenticationSettings.useHarnessUsernameAndPassword')} defaultChecked />}
      details={<Details />}
      summaryClassName={configCss.nestedSummary}
      panelClassName={cx(configCss.shadow, accAndOAuthCss.panel)}
      detailsClassName={configCss.nestedDetails}
    />
  )
}

export default HarnessAccount
