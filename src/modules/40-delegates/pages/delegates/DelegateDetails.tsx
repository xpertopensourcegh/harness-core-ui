import React from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { Container, Layout, Text, IconName, Color } from '@wings-software/uicore'
import { Page } from '@common/exports'
import { useStrings } from 'framework/exports'
import { useGetDelegateFromId, useGetDelegateConfigFromId } from 'services/portal'
import { DelegateOverview } from './DelegateOverview'
import { DelegateAdvanced } from './DelegateAdvanced'
import css from './DelegateDetails.module.scss'

export default function DelegateDetails(): JSX.Element {
  const { delegateId, accountId } = useParams<Record<string, string>>()
  const { pathname } = useLocation()
  const { getString } = useStrings()
  const { data } = useGetDelegateFromId({
    delegateId,
    queryParams: { accountId }
  })

  const delegate = data?.resource

  const { loading, error, data: profileResponse, refetch } = useGetDelegateConfigFromId({
    delegateProfileId: delegate?.delegateProfileId || '',
    queryParams: { accountId }
  })

  const delegateProfile = profileResponse?.resource
  const icon: IconName = 'app-kubernetes' // TODO: Use proper icon per delegate type
  const renderTags = (tags: string[] | undefined): React.ReactNode => {
    if (tags?.length) {
      return (
        <Container margin={{ top: 'medium' }}>
          <Layout.Horizontal spacing="xsmall">
            {tags.map(tag => (
              <Text
                key={tag}
                color={Color.GREY_900}
                style={{ background: '#CDF4FE', borderRadius: '5px', fontSize: '10px', padding: '4px 8px' }}
              >
                {tag}
              </Text>
            ))}
          </Layout.Horizontal>
        </Container>
      )
    }

    return null
  }
  const renderTitle = (): React.ReactNode => {
    return (
      <Layout.Vertical spacing="small">
        <Layout.Horizontal spacing="xsmall">
          <Link to={`${pathname.substring(0, pathname.lastIndexOf('/'))}`}>Resources</Link>
          <span>/</span>
          <Link to={`${pathname.substring(0, pathname.lastIndexOf('/'))}`}>Delegates</Link>
        </Layout.Horizontal>
        <Text style={{ fontSize: '20px', color: '#383946' }} icon={icon} iconProps={{ size: 20 }}>
          {delegate?.delegateName}
        </Text>
        <Text color={Color.GREY_400}>{delegate?.hostName}</Text>
        {renderTags(delegate?.tags || ['foo', 'bar', '1', '2'])}
      </Layout.Vertical>
    )
  }

  if (loading) {
    return <Page.Spinner />
  }

  if (error) {
    return <Page.Error message={error.message} onClick={() => refetch()} />
  }

  return (
    <>
      <Container
        height={143}
        padding={{ top: 'large', right: 'xlarge', bottom: 'large', left: 'xlarge' }}
        style={{ backgroundColor: 'rgba(219, 241, 255, .46)' }}
      >
        {renderTitle()}
      </Container>
      <Page.Body className={css.main}>
        <Layout.Vertical>
          <Container style={{ display: 'none' }}>
            {/** TODO: Not support visual/yaml toggle at the moment */}
            <div className={css.optionBtns}>
              <div className={css.item}>{getString('visual')}</div>
              <div className={css.item}>{getString('yaml')}</div>
            </div>
          </Container>
          <Layout.Horizontal spacing="medium">
            <Container className={css.cardContainer}>
              {delegate && delegateProfile && (
                <>
                  <DelegateOverview delegate={delegate} delegateProfile={delegateProfile} />
                  <DelegateAdvanced delegate={delegate} delegateProfile={delegateProfile} />
                </>
              )}
            </Container>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Page.Body>
    </>
  )
}
