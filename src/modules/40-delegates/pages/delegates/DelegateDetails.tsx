import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, Container, Layout, Text, Tag, Intent, Color } from '@wings-software/uicore'
import { Page } from '@common/exports'
import { useStrings } from 'framework/exports'
import { getDelegateProfilesV2, DelegateProfile } from 'services/portal'
import css from './DelegateDetails.module.scss'

interface Delegate {
  status: string
  connections: string[]
  delegateName: string
  hostName: string
  lastHeartBeat: number
  delegateProfileId?: string
  uuid?: string
  description?: string
  tags?: string[]
  delegateType?: string
}

interface DelegateDetailsProps {
  delegate?: Delegate | null
}

export default function DelegateDetails(props: DelegateDetailsProps): JSX.Element {
  const { delegate } = props
  const { accountId } = useParams()
  const { getString } = useStrings()
  const { data } = getDelegateProfilesV2({ queryParams: { accountId } })
  let delegateProfile: DelegateProfile | undefined
  if (data) {
    const { resource } = data
    if (resource && delegate?.delegateProfileId) {
      const profiles = resource?.response
      delegateProfile = profiles.find((item: any) => item.uuid === delegate?.delegateProfileId)
    }
  }
  return (
    <>
      <Container
        padding={{ top: 'xlarge', left: 'xlarge', bottom: 'medium', right: 'xlarge' }}
        background={Color.BLUE_200}
      >
        {/*TODO replace with breadcrumbs */}
        Navigation content
      </Container>
      <Page.Body className={css.main}>
        <Layout.Vertical>
          <Container>
            <div className={css.optionBtns}>
              <div className={css.item}>{getString('visual')}</div>
              <div className={css.item}>{getString('yaml')}</div>
            </div>
          </Container>
          <Layout.Horizontal spacing="medium">
            <Container className={css.cardContainer}>
              <Card interactive={false} elevation={0} selected={false} className={css.overview}>
                <Text font={{ size: 'medium', weight: 'bold' }}>{getString('overview')}</Text>
                <Container flex>
                  <div>
                    <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                      {getString('delegate.HostName')}
                    </Text>
                    <Text font="small">{delegate?.hostName}</Text>
                  </div>
                  {delegate?.delegateType && (
                    <div>
                      <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                        {getString('delegate.DELEGATE_TYPE')}
                      </Text>
                      <Text font="small">{delegate?.delegateType}</Text>
                    </div>
                  )}
                </Container>

                {delegate?.delegateProfileId && delegateProfile && (
                  <div>
                    <hr style={{ border: '1px solid var(--grey-350)' }} />
                    <Container flex>
                      <div>
                        <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                          {getString('delegate.DELEGATE_CONFIGURATION')}
                        </Text>
                        <Text font="small">{delegateProfile.name}</Text>
                      </div>
                    </Container>
                  </div>
                )}
                <div>
                  <div>
                    <hr style={{ border: '1px solid var(--grey-350)' }} />
                    <Container flex>
                      <div>
                        <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                          {getString('description')}
                        </Text>
                        <Text font="small">{delegate?.description}</Text>
                      </div>
                    </Container>
                  </div>
                </div>
                {/* <Text>{getString('description')}</Text>
              <Text font={{ weight: 'bold' }} lineClamp={1}>
                {triggerResponse?.data?.description || '-'}
              </Text>
              <hr />
              <Text>{getString('identifier')}</Text>
              <Text font={{ weight: 'bold' }} lineClamp={1}>
                {triggerResponse?.data?.identifier}
              </Text>
              <hr />
              <Text>{getString('tagsLabel')}</Text>
              {!isEmpty(triggerResponse?.data?.tags) ? (
                <TagsPopover tags={triggerResponse?.data?.tags as tagsType} />
              ) : null} */}
              </Card>
              <Card interactive={false} elevation={0} selected={false} className={css.overview}>
                <Text font={{ size: 'medium', weight: 'bold' }}>{getString('advancedTitle')}</Text>
                <Container flex>
                  {delegate?.tags && (
                    <div>
                      <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                        {getString('delegate.DelegateTags')}
                      </Text>
                      <Text font="small">{getString('delegate.DelegateTagDescription')}</Text>
                      <Text font="small">{getString('delegate.DelegateSpecificTags')}</Text>
                      {delegate?.tags.map((tag: string) => {
                        return (
                          <Tag intent={Intent.PRIMARY} minimal={true} key={tag}>
                            <span>{tag}</span>
                          </Tag>
                        )
                      })}
                      <Text font="small">{getString('delegate.TagsFromDelegateConfig')}</Text>
                      {delegateProfile &&
                        delegateProfile?.selectors &&
                        delegateProfile?.selectors.map((tag: string) => {
                          return (
                            <Tag intent={Intent.PRIMARY} minimal={true} key={tag}>
                              <span>{tag}</span>
                            </Tag>
                          )
                        })}
                    </div>
                  )}
                </Container>
              </Card>
            </Container>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Page.Body>
    </>
  )
}
