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
import css from './CFTargetsPage.module.scss'

type ModalVariant = 'list' | 'upload'

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

const FileUpload: React.FC<{ onChange: (data?: any) => void; file?: File }> = ({ onChange, file }) => {
  const handleChange = (e: any) => {
    onChange(e.target.files[0])
  }

  const handleRemove = () => onChange(undefined)

  return (
    <>
      {file === undefined ? (
        <>
          <label htmlFor="bulk" className={css.upload}>
            <Layout.Vertical
              flex={{ align: 'center-center' }}
              background={Color.GREY_200}
              border={{ color: Color.GREY_450 }}
              padding="xxxlarge"
            >
              <Icon size={48} name="cloud-upload" />
              <Text>Upload a File</Text>
            </Layout.Vertical>
          </label>
          <input type="file" id="bulk" name="bulk-upload" style={{ display: 'none' }} onChange={handleChange} />
        </>
      ) : (
        <>
          <Layout.Vertical
            flex={{ align: 'center-center' }}
            background={Color.GREY_200}
            border={{ color: Color.GREY_450 }}
            padding="xxxlarge"
            spacing="small"
          >
            <Text color={Color.BLACK}>{`You've uploaded`}</Text>
            <Text color={Color.BLUE_500} font={{ size: 'medium' }}>
              {file?.name}
            </Text>
            <Button text="Change" onClick={handleRemove} outlined />
          </Layout.Vertical>
        </>
      )}
    </>
  )
}

const filterTargets = (targets: TargetData[]): TargetData[] =>
  targets.filter(t => t.name?.length && t.identifier?.length)

interface CreateTargetModalProps {
  loading: boolean
  onSubmitTargets: (targets: TargetData[], hideModal: () => void) => void
  onSubmitUpload: (file: File, hideModal: () => void) => void
}

const CreateTargetModal: React.FC<CreateTargetModalProps> = ({ loading, onSubmitTargets, onSubmitUpload }) => {
  const [variant, setVariant] = useState<ModalVariant>('list')
  const [targets, setTargets] = useState<TargetData[]>([emptyTarget()])
  const [file, setFile] = useState<File | undefined>()

  const addDisabled = variant === 'list' ? filterTargets(targets).length === 0 : file === undefined

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
    if (variant === 'list') {
      const filteredTargets = filterTargets(targets)
      if (filteredTargets.length) {
        onSubmitTargets(filteredTargets, () => {
          hideModal()
          setTargets([emptyTarget()])
        })
      }
    } else {
      if (file) {
        onSubmitUpload(file, () => {
          hideModal()
          setFile(undefined)
        })
      }
    }
  }

  const handleFileChange = (data: any) => {
    setFile(data)
  }

  const handleCancel = () => {
    setVariant('list')
    setFile(undefined)
    setTargets([emptyTarget()])
    hideModal()
  }

  const [openModal, hideModal] = useModalHook(() => {
    return (
      <Dialog isOpen onClose={hideModal} title={getString('cf.targets.addTargets')}>
        <Container padding="medium">
          <Layout.Vertical spacing="medium" padding={{ left: 'large', right: 'medium' }}>
            <RadioGroup name="modalVariant" selectedValue={variant} onChange={handleChange}>
              <Radio name="modalVariant" label={getPageString('list')} value="list" />
              {variant === 'list' && (
                <TargetList targets={targets} onAdd={handleTargetAdd} onChange={handleTargetChange} />
              )}
              <Radio name="modalVariant" label={getPageString('upload')} value="upload" />
              {variant === 'upload' && (
                <Layout.Vertical spacing="small">
                  <Text>Please upload a csv file according to our template</Text>
                  <FileUpload file={file} onChange={handleFileChange} />
                </Layout.Vertical>
              )}
            </RadioGroup>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Button
                disabled={addDisabled || loading}
                text={getString('add')}
                intent="primary"
                onClick={handleSubmit}
              />
              <Button disabled={loading} text={getString('cancel')} minimal onClick={handleCancel} />
              {loading && <Spinner size={16} />}
            </div>
          </Layout.Vertical>
        </Container>
      </Dialog>
    )
  }, [variant, targets, loading, file, addDisabled])

  return <Button intent="primary" text={`+ ${getString('cf.targets.create')}`} onClick={openModal} />
}

export default CreateTargetModal
