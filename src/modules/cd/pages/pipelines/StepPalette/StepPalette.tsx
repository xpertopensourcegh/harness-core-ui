import React from 'react'
import i18n from './StepPalette.18n'
import css from './StepPalette.module.scss'
import { IconName, Layout, ExpandingSearchInput, Card, Text, Icon } from '@wings-software/uikit'

export interface CommandData {
  text: string
  value: string
  icon: IconName
}

interface GroupedCommandData {
  [key: string]: CommandData[]
}

const commandData: GroupedCommandData = {
  recent: [
    {
      text: 'Shell Script',
      value: 'ShellScript',
      icon: 'command-shell-script'
    },
    {
      text: 'HTTP',
      value: 'Http',
      icon: 'command-http'
    },
    {
      text: 'Approval',
      value: 'Approval',
      icon: 'command-approval'
    }
  ],
  kubernetes: [
    {
      text: 'K8s Rollout Deploy',
      value: 'K8sRolloutDeploy',
      icon: 'service-kubernetes'
    }
  ],
  others: [
    {
      text: 'Jira',
      value: 'jira',
      icon: 'service-jira'
    },
    {
      text: 'Github',
      value: 'service-github',
      icon: 'service-github'
    },
    {
      text: 'GCP',
      value: 'service-gcp',
      icon: 'service-gcp'
    },
    {
      text: 'ELK Service',
      value: 'service-elk',
      icon: 'service-elk'
    },
    {
      text: 'Git Labs',
      value: 'service-gotlab',
      icon: 'service-gotlab'
    },
    {
      text: 'Datadog',
      value: 'service-datadog',
      icon: 'service-datadog'
    },
    {
      text: 'Bamboo',
      value: 'bamboo',
      icon: 'service-bamboo'
    },
    {
      text: 'Jenkins',
      value: 'service-jenkins',
      icon: 'service-jenkins'
    }
  ]
}

export interface StepPaletteProps {
  onSelect: (item: CommandData) => void
}
export const StepPalette: React.FC<StepPaletteProps> = ({ onSelect }): JSX.Element => {
  return (
    <Layout.Vertical padding="large">
      <div className={css.topHeader}>
        <Text className={css.selectStep} font={{ size: 'medium' }}>
          {i18n.selectStep}
        </Text>
        <div className={css.expandedInput}>
          <ExpandingSearchInput />
        </div>
      </div>
      <div>
        {Object.entries(commandData).map(([key, records]) => {
          return (
            <div key={key} style={{ padding: 'var(--spacing-medium) 0' }}>
              {/* TODO: We will remove this any once we have some BE Solution */}
              <Text style={{ paddingBottom: 'var(--spacing-medium)' }}>{(i18n as any)[key]}</Text>{' '}
              <div className={css.grid}>
                {records.map((item: CommandData) => (
                  <div key={item.value}>
                    <Card
                      interactive={true}
                      draggable={true}
                      onClick={() => onSelect(item)}
                      onDragStart={event => {
                        event.dataTransfer.setData('storm-diagram-node', JSON.stringify(item))
                      }}
                    >
                      <Icon name={item.icon} size={28} />
                    </Card>

                    <Text
                      font="small"
                      lineClamp={2}
                      style={{
                        width: '90px',
                        textAlign: 'center',
                        paddingTop: 'var(--spacing-xsmall)',
                        color: 'var(--grey-900)'
                      }}
                    >
                      {item.text}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Layout.Vertical>
  )
}
