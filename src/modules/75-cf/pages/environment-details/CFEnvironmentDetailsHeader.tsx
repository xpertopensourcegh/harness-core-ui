import React from 'react'
import { map } from 'lodash-es'
import { Layout, Text, Color } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import type { EnvironmentResponseDTO } from 'services/cd-ng'

const Tag: React.FC<{ tagName: string }> = ({ tagName }) => (
  <Text
    background={Color.GREY_300}
    padding="xsmall"
    font={{ size: 'small' }}
    color={Color.GREY_700}
    style={{ borderRadius: '4px' }}
  >
    {tagName}
  </Text>
)

//TODO: Add proper types when backend is ready
interface HeaderProps {
  environment: EnvironmentResponseDTO
}

const CFEnvironmentDetailsHeader: React.FC<HeaderProps> = ({ environment }) => {
  const { projectIdentifier, orgIdentifier, accountId } = useParams<Record<string, string>>()
  const history = useHistory()
  const handleGoBack = () => {
    history.push(
      routes.toCFEnvironments({
        accountId,
        orgIdentifier,
        projectIdentifier
      })
    )
  }

  return (
    <Layout.Vertical
      spacing="medium"
      background={Color.BLUE_200}
      padding={{ top: 'large', bottom: 'large', left: 'xxxlarge', right: 'xxxlarge' }}
    >
      <div>
        <Layout.Horizontal
          spacing="small"
          width="fit-content"
          style={{ cursor: 'pointer', alignItems: 'center' }}
          onClick={handleGoBack}
        >
          <Text font={{ size: 'small' }} color={Color.BLUE_700}>
            {projectIdentifier}
          </Text>
          <Text>/</Text>
          <Text font={{ size: 'small' }} color={Color.BLUE_700}>
            {' '}
            Admin: Environments{' '}
          </Text>
          <Text>/</Text>
        </Layout.Horizontal>
      </div>
      <div>
        <Layout.Horizontal flex={{ align: 'center-center', distribution: 'space-between' }}>
          <Layout.Vertical spacing="small">
            <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
              <Text font={{ weight: 'bold', size: 'medium' }} color={Color.BLACK}>
                {environment.name}
              </Text>
              <Text
                font={{ weight: 'semi-bold' }}
                background={Color.BLUE_300}
                width="fit-content"
                padding={{ left: 'xsmall', right: 'xsmall' }}
              >
                {environment.identifier}
              </Text>
            </Layout.Horizontal>
            {environment.description && <Text font={{ size: 'normal' }}>{environment.description}</Text>}
          </Layout.Vertical>
          <Layout.Vertical spacing="small">
            <div>
              <Layout.Horizontal spacing="medium">
                <Text font={{ weight: 'bold', size: 'normal' }}>Type</Text>
                <Text>{environment.type}</Text>
              </Layout.Horizontal>
            </div>
            {Object.keys(environment.tags ?? {}).length > 0 && (
              <div>
                <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                  <Text font={{ weight: 'bold', size: 'normal' }}>Tags</Text>
                  <div>
                    <Layout.Horizontal style={{ alignItems: 'center', justifyContent: 'flex-start' }} spacing="xsmall">
                      {map(environment.tags, (value: string, key: string) => {
                        return <Tag key={key} tagName={value} />
                      })}
                    </Layout.Horizontal>
                  </div>
                </Layout.Horizontal>
              </div>
            )}
          </Layout.Vertical>
          {/* <Layout.Horizontal>
            <Layout.Vertical spacing="small">
              <Text font={{ weight: 'bold', size: 'normal' }}>Created Date</Text>
              <Text font={{ weight: 'bold', size: 'normal' }}>Modified Date</Text>
            </Layout.Vertical>
            <Layout.Vertical spacing="small">
              <Text font={{ size: 'normal' }}>{environment.creationDate ?? 'Oct 25, 2021 12:30 PM'}</Text>
              <Text font={{ size: 'normal' }}>{environment.modifiedDate ?? 'Oct 30, 2021 12:30 PM'}</Text>
            </Layout.Vertical>
          </Layout.Horizontal> */}
        </Layout.Horizontal>
      </div>
    </Layout.Vertical>
  )
}

export default CFEnvironmentDetailsHeader
