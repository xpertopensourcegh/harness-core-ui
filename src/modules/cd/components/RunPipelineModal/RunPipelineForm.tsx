import React from 'react'
import { Classes } from '@blueprintjs/core'
import { Button, Color, Layout, Text } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { CDPipeline, useGetPipeline } from 'services/cd-ng'
import i18n from './RunPipelineModal.i18n'
import { InputSetSelector, InputSetSelectorProps } from '../InputSetSelector/InputSetSelector'
import css from './RunPipelineModal.module.scss'

export interface RunPipelineFormProps {
  pipelineIdentifier: string
  inputSetOption?: InputSetSelectorProps['value']
  onClose: () => void
}

enum SelectedView {
  VISUAL = 'VISUAL',
  YAML = 'YAML'
}

export const RunPipelineForm: React.FC<RunPipelineFormProps> = ({ pipelineIdentifier, onClose }) => {
  const { projectIdentifier, orgIdentifier, accountId } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const [selectedView, setSelectedView] = React.useState<SelectedView>(SelectedView.VISUAL)

  const handleModeSwitch = React.useCallback((view: SelectedView) => {
    setSelectedView(view)
  }, [])

  const { data: pipelineResponse, loading: loadingPipeline } = useGetPipeline({
    pipelineIdentifier,
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const pipeline: CDPipeline | undefined = (pipelineResponse?.data?.cdPipeline as any)?.pipeline

  const [selectedInputSets, setSelectedInputSets] = React.useState<InputSetSelectorProps['value']>()

  if (loadingPipeline) {
    return <PageSpinner />
  }

  return (
    <>
      <Layout.Horizontal flex={{ distribution: 'space-between' }} padding="medium">
        <Text font="medium">{`${i18n.runPipeline}: ${pipeline?.name}`}</Text>
        <Button icon="cross" minimal onClick={onClose} />
      </Layout.Horizontal>
      <div className={Classes.DIALOG_BODY}>
        <Layout.Horizontal flex={{ distribution: 'space-between' }}>
          <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
            <Text font={{ weight: 'bold' }} color={Color.BLACK}>
              {i18n.inputForm}
            </Text>
            <div className={css.optionBtns}>
              <div
                className={cx(css.item, { [css.selected]: selectedView === SelectedView.VISUAL })}
                onClick={() => handleModeSwitch(SelectedView.VISUAL)}
              >
                {i18n.VISUAL}
              </div>
              <div
                className={cx(css.item, { [css.selected]: selectedView === SelectedView.YAML })}
                onClick={() => handleModeSwitch(SelectedView.YAML)}
              >
                {i18n.YAML}
              </div>
            </div>
          </Layout.Horizontal>
          <InputSetSelector
            onChange={value => {
              setSelectedInputSets(value)
            }}
            value={selectedInputSets}
          />
        </Layout.Horizontal>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Layout.Horizontal flex={{ distribution: 'space-between' }}>
          <Button intent="primary" text={i18n.runPipeline} />
          <Button minimal intent="primary" text={i18n.saveAsInputSet} />
        </Layout.Horizontal>
      </div>
    </>
  )
}
