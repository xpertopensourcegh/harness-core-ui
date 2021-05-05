import React, { useMemo } from 'react'
import cx from 'classnames'
import { Color, Layout, Text, Icon, IconName } from '@wings-software/uicore'
import type { ResponseMessage } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import css from '@common/components/ErrorHandler/ErrorHandler.module.scss'

export interface ErrorHandlerProps {
  responseMessages: ResponseMessage[]
  className?: string
}

const extractInfo = (
  responseMessages: ErrorHandlerProps['responseMessages']
): {
  error?: ResponseMessage
  explanations?: ResponseMessage[]
  hints?: ResponseMessage[]
} => {
  let error = {}
  const explanations = []
  const hints = []
  for (const message of responseMessages) {
    if (message.level === 'ERROR') {
      error = message
    } else {
      if (message.code === 'HINT') {
        hints.push(message)
      } else if (message.code === 'EXPLANATION') {
        explanations.push(message)
      }
    }
  }
  return {
    error,
    explanations,
    hints
  }
}

const ErrorList: React.FC<{
  items: ResponseMessage[]
  header: string
  icon: IconName
}> = props => {
  if (!props.items.length) {
    return null
  }
  return (
    <Layout.Horizontal margin={{ bottom: 'xlarge' }}>
      <Icon name={props.icon} margin={{ right: 'small' }} />
      <Layout.Vertical className={css.errorListTextContainer}>
        <Text font={{ weight: 'semi-bold' }} color={Color.BLACK} margin={{ bottom: 'xsmall' }}>
          {props.header}
        </Text>
        {props.items.map((item, index) => (
          <Text key={index} color={Color.BLACK} margin={{ bottom: 'xsmall' }}>
            {item.message}
          </Text>
        ))}
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = props => {
  const { responseMessages, className = '' } = props
  const { error = {}, explanations = [], hints = [] } = useMemo(() => extractInfo(responseMessages), [responseMessages])
  const { getString } = useStrings()
  return (
    <Layout.Vertical
      background={Color.RED_100}
      padding={{ top: 'medium', bottom: 0, left: 'medium', right: 'medium' }}
      className={cx(css.container, className)}
    >
      <Text font={{ weight: 'bold' }} color={Color.RED_700} margin={{ bottom: 'medium' }}>
        {error.message}
      </Text>
      {<ErrorList items={explanations} header={getString('common.errorHandler.issueCouldBe')} icon={'info'} />}
      {<ErrorList items={hints} header={getString('common.errorHandler.tryTheseSuggestions')} icon={'lightbulb'} />}
    </Layout.Vertical>
  )
}
