import React, { useState } from 'react'
import {
  Button,
  Container,
  Layout,
  useModalHook,
  Text,
  TextInput,
  Icon,
  Color,
  FlexExpander
} from '@wings-software/uikit'
import { Radio, RadioGroup, Spinner, Dialog } from '@blueprintjs/core'
import { useStrings } from 'framework/exports'
import type { Target } from 'services/cf'

type ModalVariant = 'single' | 'upload'

export type TargetData = Pick<Target, 'name' | 'identifier'>

const emptyTarget = (): TargetData => ({ name: '', identifier: '' })

interface TargetListProps {
  onAdd: () => void
  onChange: (idx: number, newData: TargetData) => void
  targets: TargetData[]
}

const TargetList: React.FC<TargetListProps> = ({ targets, onAdd, onChange }) => {
  const { getString } = useStrings()

  const handleChange = (idx: number, attr: keyof TargetData) => (e: any) => {
    onChange(idx, { ...targets[idx], [attr]: e.target.value })
  }

  return (
    <Layout.Vertical spacing="xsmall" margin={{ bottom: 'medium' }}>
      <Layout.Horizontal spacing="small">
        <Text style={{ width: '50%' }}>{getString('name')}</Text>
        <Text style={{ width: '50%' }}>{getString('identifier')}</Text>
        <FlexExpander />
      </Layout.Horizontal>
      {targets.map((target: TargetData, idx: number) => {
        return (
          <Layout.Horizontal key={idx + '-target-row'} flex={{ align: 'center-center' }} spacing="small">
            <TextInput
              placeholder={getString('cf.targets.enterName')}
              value={target.name}
              onChange={handleChange(idx, 'name')}
            />
            <TextInput
              placeholder={getString('cf.targets.enterValue')}
              value={target.identifier}
              onChange={handleChange(idx, 'identifier')}
            />
            <Icon
              name="zoom-in"
              size={16}
              style={{ visibility: idx !== targets.length - 1 ? 'hidden' : 'visible' }}
              color={Color.BLUE_600}
              onClick={onAdd}
            />
          </Layout.Horizontal>
        )
      })}
    </Layout.Vertical>
  )
}

interface CreateTargetModalProps {
  loading: boolean
  onSubmitTargets: (targets: TargetData[], hideModal: () => void) => void
}

const CreateTargetModal: React.FC<CreateTargetModalProps> = ({ loading, onSubmitTargets }) => {
  const [variant, setVariant] = useState<ModalVariant>('single')
  const [targets, setTargets] = useState<TargetData[]>([emptyTarget()])

  const { getString } = useStrings()
  const getPageString = (key: string) => getString(`cf.targets.${key}`)

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setVariant((e.target as HTMLInputElement).value as ModalVariant)
    setTargets([emptyTarget()])
  }

  const handleTargetAdd = () => {
    setTargets([...targets, emptyTarget()])
  }

  const handleTargetChange = (idx: number, newData: TargetData) => {
    targets[idx] = newData
    setTargets([...targets])
  }

  const handleSubmit = () => {
    const filteredTargets = targets.filter(t => t?.name?.length && t?.identifier?.length)
    if (filteredTargets.length) {
      onSubmitTargets(filteredTargets, hideModal)
      setTargets([emptyTarget()])
    }
  }

  const [openModal, hideModal] = useModalHook(() => {
    return (
      <Dialog isOpen onClose={hideModal} title={getString('cf.targets.addTargets')}>
        <Container padding="medium">
          <Layout.Vertical spacing="medium" padding={{ left: 'large', right: 'medium' }}>
            <RadioGroup name="modalVariant" selectedValue={variant} onChange={handleChange}>
              <Radio name="modalVariant" label={getPageString('single')} value="single" />
              {variant === 'single' && (
                <TargetList targets={targets} onAdd={handleTargetAdd} onChange={handleTargetChange} />
              )}
              <Radio name="modalVariant" label={getPageString('upload')} value="upload" />
              {variant === 'upload' && <Text>To be implemented</Text>}
            </RadioGroup>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Button disabled={loading} text={getString('add')} intent="primary" onClick={handleSubmit} />
              <Button disabled={loading} text={getString('cancel')} minimal onClick={hideModal} />
              {loading && <Spinner size={16} />}
            </div>
          </Layout.Vertical>
        </Container>
      </Dialog>
    )
  }, [variant, targets, loading])

  return <Button intent="primary" text={`+ ${getString('cf.targets.create')}`} onClick={openModal} />
}

export default CreateTargetModal
