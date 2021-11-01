import React from 'react'
import { Color, Container, Text, Layout } from '@wings-software/uicore'
import { v4 as uuid } from 'uuid'
import MonacoEditor from '@common/components/MonacoEditor/MonacoEditor'

import css from './TemplateYaml.module.scss'

export interface TemplateYamlProps {
  templateYaml?: string
}

export const TemplateYaml: React.FC<TemplateYamlProps> = props => {
  const { templateYaml } = props
  const [key, setKey] = React.useState<string>()

  React.useEffect(() => {
    setKey(uuid())
  }, [templateYaml])

  return (
    <Container height={'100%'} className={css.container}>
      <Layout.Vertical height={'100%'} spacing={'medium'}>
        <Container
          padding={{ top: 'large', right: 'xxlarge', bottom: 'large', left: 'xxlarge' }}
          border={{ bottom: true }}
          background={Color.WHITE}
        >
          <Text font={{ size: 'normal', weight: 'bold' }} color={Color.GREY_800}>
            template.yaml
          </Text>
        </Container>
        <Container style={{ flexGrow: 1 }}>
          <MonacoEditor
            value={templateYaml}
            key={key}
            language={'yaml'}
            height={'100%'}
            options={
              {
                classNames: css.editor,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 13,
                minimap: {
                  enabled: false
                },
                readOnly: true,
                scrollBeyondLastLine: false
              } as any
            }
          />
        </Container>
      </Layout.Vertical>
    </Container>
  )
}
