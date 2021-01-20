import React from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { Card, Container, Layout, Text, Tag, Intent } from '@wings-software/uicore'
import { Page } from '@common/exports'
import { useStrings } from 'framework/exports'
import { useGetDelegateFromId, useGetDelegateConfigFromId } from 'services/portal'
import css from './DelegateDetails.module.scss'
// interface Delegate {
//   status: string
//   connections: string[]
//   delegateName: string
//   hostName: string
//   lastHeartBeat: number
//   delegateProfileId: string
//   uuid?: string
//   description?: string
//   tags?: string[]
//   delegateType?: string
// }

export default function DelegateDetails(): JSX.Element {
  // const { delegate } = props
  const { delegateId, accountId } = useParams()
  const { pathname } = useLocation()
  const { getString } = useStrings()
  const { data } = useGetDelegateFromId({
    delegateId,
    queryParams: { accountId }
  })

  const delegate = data?.resource

  const { data: profileResponse } = useGetDelegateConfigFromId({
    delegateProfileId: delegate?.delegateProfileId || '',
    queryParams: { accountId }
  })

  const delegateProfile = profileResponse?.resource
  const renderTitle = () => {
    return (
      <Layout.Vertical>
        <Layout.Horizontal spacing="xsmall">
          <Link to={`${pathname.substring(0, pathname.lastIndexOf('/'))}`}>Resources</Link>
          <span>/</span>
          <Link to={`${pathname.substring(0, pathname.lastIndexOf('/'))}`}>Delegates</Link>
        </Layout.Horizontal>
        <span>{delegate?.hostName}</span>
      </Layout.Vertical>
    )
  }
  return (
    <>
      <Page.Header title={renderTitle()} />
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
                    <Text font="small" className={css.cardValue}>
                      {delegate?.hostName}
                    </Text>
                  </div>
                  {delegate?.delegateType && (
                    <div>
                      <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                        {getString('delegate.DELEGATE_TYPE')}
                      </Text>
                      <Text font="small" className={css.cardValue}>
                        {delegate?.delegateType}
                      </Text>
                    </div>
                  )}
                </Container>

                {delegate?.delegateProfileId && delegateProfile && (
                  <div className={css.addSpacing}>
                    <hr className={css.labelSeparator} />
                    <Container flex>
                      <div>
                        <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                          {getString('delegate.DELEGATE_CONFIGURATION')}
                        </Text>
                        <Text font="small" className={css.cardValue}>
                          {delegateProfile.name}
                        </Text>
                      </div>
                    </Container>
                  </div>
                )}
                {delegate?.description && (
                  <div className={css.addSpacing}>
                    <div>
                      <hr className={css.labelSeparator} />
                      <Container flex>
                        <div>
                          <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                            {getString('description')}
                          </Text>
                          <Text font="small" className={css.cardValue}>
                            {delegate?.description}
                          </Text>
                        </div>
                      </Container>
                    </div>
                  </div>
                )}
              </Card>
              <Card interactive={false} elevation={0} selected={false} className={css.advancedCard}>
                <Text font={{ size: 'medium', weight: 'bold' }}>{getString('advancedTitle')}</Text>
                <Container flex>
                  <div className={css.addSpacing}>
                    <Text font="small" style={{ marginBottom: '5px', color: 'var(--grey-350)' }}>
                      {getString('delegate.DelegateTags')}
                    </Text>
                    <Text font="small">{getString('delegate.DelegateTagDescription')}</Text>
                    <Text font="small" color="#4F4F4F">
                      {getString('delegate.DelegateSpecificTags')}
                    </Text>
                    {delegate?.tags &&
                      delegate?.tags.map((tag: string) => {
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
                </Container>
              </Card>
            </Container>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Page.Body>
    </>
  )
}
