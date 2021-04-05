import React from 'react'
import { useParams } from 'react-router'
import { Button, Container, FlexExpander, Heading, Layout, Text } from '@wings-software/uicore'
import type { HeadingProps } from '@wings-software/uicore/dist/components/Heading/Heading'
import { useStrings } from 'framework/exports'
import { Segment, SegmentFlag, SegmentFlagsResponseResponse, useGetSegmentFlags } from 'services/cf'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { getErrorMessage, SegmentFlagType } from '@cf/utils/CFUtils'
import { PageError } from '@common/components/Page/PageError'
import { OptionsMenuButton } from '@common/components'
import { ItemContainer, ItemContainerProps } from '@cf/components/ItemContainer/ItemContainer'
import { NoDataFoundRow } from '@cf/components/NoDataFoundRow/NoDataFoundRow'
import { DetailHeading } from '../DetailHeading'

export const FlagsUseSegment: React.FC<{ segment?: Segment | undefined | null }> = () => {
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier, environmentIdentifier, segmentIdentifier } = useParams<
    Record<string, string>
  >()
  const { loading, error, data: flags, refetch: refetchFlags } = useGetSegmentFlags({
    identifier: segmentIdentifier,
    queryParams: {
      account: accountId,
      org: orgIdentifier,
      project: projectIdentifier,
      environment: environmentIdentifier
    }
  })

  return (
    <Container width={480} height="100%" style={{ background: '#F8FAFB', overflow: 'auto', minWidth: '480px' }}>
      <Layout.Horizontal width="100%" height={55} style={{ alignItems: 'baseline' }} padding={{ right: 'small' }}>
        <DetailHeading style={{ paddingBottom: 0 }}>
          {getString(flags?.length ? 'cf.segments.usingSegmentWithCount' : 'cf.segments.usingSegment', {
            count: flags?.length || 0
          })}
        </DetailHeading>
        <FlexExpander />
        <Button minimal intent="primary" text={getString('cf.segmentDetail.addToFlag')} style={{ display: 'none' }} />
      </Layout.Horizontal>
      <Container
        width="100%"
        height="calc(100% - 55px)"
        style={{ overflow: 'auto', padding: '0 var(--spacing-xxlarge) var(--spacing-xxlarge)' }}
      >
        {error && <PageError message={getErrorMessage(error)} onClick={() => refetchFlags()} />}
        {!error && !loading && <FlagsList flags={flags} />}
        {loading && <ContainerSpinner />}
      </Container>
    </Container>
  )
}

const SectionHeader: React.FC<HeadingProps> = ({ children, ...props }) => {
  const { getString } = useStrings()
  return (
    <>
      <Heading
        level={3}
        style={{
          color: '#4F5162',
          position: 'sticky',
          top: 0,
          padding: 'var(--spacing-xxlarge) 0 var(--spacing-large)',
          background: 'rgb(248, 250, 251)',
          fontSize: '14px',
          fontWeight: 500
        }}
        {...props}
      >
        {children}
      </Heading>
      <Layout.Horizontal style={{ alignItems: 'center' }} margin={{ bottom: 'small' }} padding={{ left: 'small' }}>
        <Text
          padding={{ left: 'small' }}
          style={{ color: '#4F5162', fontSize: '10px', fontWeight: 'bold', flexGrow: 1 }}
        >
          {getString('cf.shared.flags').toLocaleUpperCase()}
        </Text>
        <Text
          width={150}
          style={{ color: '#4F5162', fontSize: '10px', fontWeight: 'bold' }}
          padding={{ left: 'small' }}
        >
          {getString('cf.shared.variation').toLocaleUpperCase()}
        </Text>
      </Layout.Horizontal>
    </>
  )
}

const FlagsList: React.FC<{ flags: SegmentFlagsResponseResponse | null }> = ({ flags }) => {
  const { getString } = useStrings()
  const directAddedFlags = flags?.filter(flag => flag.type === SegmentFlagType.DIRECT) || []
  const conditionalAddedFlags = flags?.filter(flag => flag.type === SegmentFlagType.CONDITION) || []

  if (!flags?.length) {
    return <NoDataFoundRow message={getString('cf.segmentDetail.noFlagsUseThisSegment')} margin={{ top: 'xxlarge' }} />
  }

  return (
    <>
      {!!directAddedFlags?.length && (
        <>
          {' '}
          <SectionHeader>{getString('cf.segmentDetail.directlyAdded')}</SectionHeader>
          <Layout.Vertical spacing="small" style={{ padding: '1px' }}>
            {directAddedFlags.map(_flag => (
              <FlagItem key={_flag.identifier} flag={_flag} />
            ))}
          </Layout.Vertical>
        </>
      )}
      {!!conditionalAddedFlags?.length && (
        <>
          <SectionHeader>{getString('cf.segmentDetail.autoAdded')}</SectionHeader>
          <Layout.Vertical spacing="small" style={{ padding: '1px' }}>
            {conditionalAddedFlags.map(_flag => (
              <FlagItem key={_flag.identifier} flag={_flag} />
            ))}
          </Layout.Vertical>
        </>
      )}
    </>
  )
}

interface FlagItemProps extends ItemContainerProps {
  flag: SegmentFlag
  onRemoveClick?: () => void
}

const FlagItem: React.FC<FlagItemProps> = ({ flag, onRemoveClick, ...props }) => {
  const { name, description, variation } = flag
  const { getString } = useStrings()
  const variationTextWidth = onRemoveClick ? '88px' : '135px'

  return (
    <ItemContainer style={{ paddingRight: 'var(--spacing-xsmall)' }} {...props}>
      <Layout.Horizontal spacing="xsmall" style={{ alignItems: 'center' }}>
        <Container style={{ flexGrow: 1 }} padding={{ left: 'xsmall', right: 'small' }}>
          <Text
            margin={{ bottom: description?.length ? 'xsmall' : undefined }}
            style={{ color: '#22222A', fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}
          >
            {name}
          </Text>
          {description && <Text style={{ color: '#22222A' }}>{description}</Text>}
        </Container>

        {/* NOTE: flag does not have enough info to render variation icon.
            Only text for now. See: https://harness.atlassian.net/browse/FFM-699 */}
        <Text style={{ minWidth: variationTextWidth, maxWidth: variationTextWidth }}>{variation}</Text>

        {onRemoveClick && (
          <OptionsMenuButton
            items={[{ text: getString('cf.segmentDetail.removeFomFlag'), icon: 'cross', onClick: onRemoveClick }]}
          />
        )}
      </Layout.Horizontal>
    </ItemContainer>
  )
}
