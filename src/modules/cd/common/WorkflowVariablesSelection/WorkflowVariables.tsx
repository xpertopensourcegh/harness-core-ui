import React from 'react'
import { Layout, Text, Container, Icon, TextInput, MultiTypeInput } from '@wings-software/uikit'
import css from './WorkflowVariables.module.scss'
import i18n from './WorkflowVariables.i18n'
import cx from 'classnames'
interface VariablesTable {
  [key: string]: string
}
const variableHeaders: VariablesTable = {
  variables: i18n.variableTable.variables,
  value: i18n.variableTable.value
}

function AddAWVPlaceholder(props: { addVariables: any }): JSX.Element {
  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.rowItem}>
        <Text onClick={() => props.addVariables([...[], { name: '', value: '' }])}>{i18n.addWorkflowVariables}</Text>
      </Container>
    </Layout.Vertical>
  )
}

function VariablesListView(props: any): JSX.Element {
  return (
    <Layout.Vertical spacing="small">
      <Container>
        <section className={css.thead}>
          <span>{variableHeaders.variables}</span>
          <span>{variableHeaders.value}</span>
        </section>
      </Container>
      <Layout.Vertical spacing="medium">
        <section>
          {props.variablesList.map((data: { name: string; value: string }, index: number) => {
            return (
              <section className={cx(css.thead, css.rowItem)} key={data.name + index}>
                <span>
                  <TextInput placeholder={i18n.variablePlaceholder} style={{ width: 250 }} />
                </span>
                <span>
                  <MultiTypeInput
                    width={300}
                    selectProps={{
                      items: [
                        { label: 'Kubernetes', value: 'service-kubernetes' },
                        { label: 'GitHub', value: 'service-github' },
                        { label: 'ELK', value: 'service-elk' },
                        { label: 'Jenkins', value: 'service-jenkins' },
                        { label: 'GCP', value: 'service-gcp' }
                      ]
                    }}
                    mentionsInfo={{
                      data: done =>
                        done([
                          'app.name',
                          'app.description',
                          'pipeline.name',
                          'pipeline.description',
                          'pipeline.identifier',
                          'pipeline.stage.qa.displayName'
                        ])
                    }}
                    onChange={() => {
                      // console.log('onChange value:', value)
                    }}
                  />
                </span>
                <span>
                  <Icon
                    name="delete"
                    size={14}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const variableList = [...props.variablesList]
                      variableList.splice(index, 1)
                      props.addVariables([...variableList])
                    }}
                  />
                </span>
              </section>
            )
          })}
        </section>
        <Text
          intent="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => props.addVariables([...props.variablesList, { name: '', value: '' }])}
        >
          {i18n.addWorkflowVariables}
        </Text>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default function WorkflowVariables(): JSX.Element {
  const [variablesList, addVariables] = React.useState([])
  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)', minHeight: 400 }}>
      <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      {variablesList && variablesList.length === 0 && <AddAWVPlaceholder addVariables={addVariables} />}
      {variablesList && variablesList.length > 0 && (
        <VariablesListView variablesList={variablesList} addVariables={addVariables} />
      )}
    </Layout.Vertical>
  )
}
