import React, { useEffect, useReducer, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Color,
  Container,
  Icon,
  Layout,
  MultiSelect,
  MultiSelectOption,
  Select,
  SelectOption,
  Tabs,
  Text,
  TextInput,
  useModalHook
} from '@wings-software/uikit'
import { isEqual, omit } from 'lodash-es'
import { Dialog, Divider, Spinner, Tab } from '@blueprintjs/core'
import { useToaster } from '@common/exports'
import { SharedQueryParams, useOperatorsFromYaml } from '@cf/constants'
import { Clause, useGetAllTargets, useGetSegment, usePatchSegment } from 'services/cf'
import patch, { getDiff } from '../../utils/instructions'
import css from './CFSegmentDetailsPage.module.scss'

const AddTargetAvatar: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <Avatar name="+" color={Color.BLUE_500} backgroundColor={Color.GREY_200} onClick={onAdd} />
)

const InlineBold: React.FC<{}> = ({ children }) => <span style={{ fontWeight: 'bold' }}>{children}</span>
const safeJoin = (data: any[], separator: string) => data?.join(separator) || `[${data}]`
interface ClauseProps {
  clause: Clause
  operators: {
    label: string
    value: string
  }[]
}
const ClauseViewMode: React.FC<ClauseProps> = ({ clause, operators }) => {
  return (
    <>
      If
      <InlineBold>{` ${clause.attribute} `} </InlineBold>{' '}
      {operators.find(op => op.value === clause.op)?.label || 'NO_OP'}{' '}
      <InlineBold>{` ${safeJoin(clause.values, ', ')}`}</InlineBold>
    </>
  )
}

type ClauseMutation =
  | { kind: 'op'; payload: string }
  | { kind: 'attribute'; payload: string }
  | { kind: 'values'; payload: string[] }

type ClauseEditProps = {
  index: number
  operator: string
  operators: {
    label: string
    value: string
  }[]
  attribute: string
  values: string[]
  onChange: (data: ClauseMutation) => void
}

const ClauseEditMode: React.FC<ClauseEditProps> = ({ index, operator, operators, attribute, values, onChange }) => {
  const valueOpts = values.map(toOption)
  const handleAttrChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ kind: 'attribute', payload: e.target.value })
  const handleOperatorChange = (data: SelectOption) => onChange({ kind: 'op', payload: data.value as string })
  const handleValuesChange = (data: MultiSelectOption[]) =>
    onChange({ kind: 'values', payload: data.map(x => x.value as string) })

  const height = '36px'

  return (
    <Layout.Horizontal spacing="xsmall">
      <Text
        color={Color.GREY_350}
        font="normal"
        style={{ display: 'flex', height, alignItems: 'center', justifyContent: 'flex-end' }}
      >
        {'If '}
      </Text>
      <div style={{ flex: '1' }}>
        <TextInput style={{ height }} id={`attribute-${index}`} value={attribute} onChange={handleAttrChange} />
      </div>
      <div style={{ flex: '1' }}>
        <Select
          inputProps={{ style: { height } }}
          value={operators.find(o => o.value === operator)}
          items={operators}
          onChange={handleOperatorChange}
        />
      </div>
      <div style={{ flex: '1.5' }}>
        <MultiSelect
          fill
          className={css.valueMultiselect}
          tagInputProps={{ className: css.valueMultiselect, inputProps: { className: css.valueMultiselect } }}
          items={valueOpts}
          value={valueOpts}
          onChange={handleValuesChange}
        />
      </div>
    </Layout.Horizontal>
  )
}

interface AvatarOption {
  name: string
}
interface Option<T> {
  label: string
  value: T
}
const toAvatar = (x: string): AvatarOption => ({ name: x })
const toOption = (x: string): Option<string> => ({ value: x, label: x })

interface RulesTabProps {
  excluded: string[]
  included: string[]
  availableTargets: string[]
  rules: Clause[]
  editing: boolean
  loadingSave: boolean
  onChangeIncluded: (data: string[]) => void
  onChangeExcluded: (data: string[]) => void
  onChangeRules: (data: Clause[]) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

const RulesTab: React.FC<RulesTabProps> = ({
  excluded,
  included,
  rules,
  availableTargets,
  editing,
  loadingSave,
  onChangeIncluded,
  onChangeExcluded,
  onChangeRules,
  onEdit,
  onSave,
  onCancel
}) => {
  const operators = useOperatorsFromYaml()

  const [tempIncluded, setTempIncluded] = useState(included.map(toOption))
  useEffect(() => setTempIncluded(included.map(toOption)), [included])
  const [openIncluded, hideIncluded] = useModalHook(() => {
    const handleTempIncludedChange = (newData: any) => {
      setTempIncluded(newData)
    }

    const handleSaveTempIncluded = () => {
      onChangeIncluded(tempIncluded.map(x => x.value))
      hideIncluded()
    }

    return (
      <Dialog isOpen onClose={hideIncluded} title={`Serve variation to the following`}>
        <Layout.Vertical spacing="medium" padding={{ left: 'large', right: 'medium' }}>
          <MultiSelect
            fill
            allowCreatingNewItems={false}
            value={tempIncluded}
            items={availableTargets.map(toOption)}
            onChange={handleTempIncludedChange}
          />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Button intent="primary" onClick={handleSaveTempIncluded}>
              Save
            </Button>
            <Button minimal onClick={hideIncluded}>
              Cancel
            </Button>
            <div style={{ marginLeft: 'auto' }}>
              <Text>{`${tempIncluded.length} total`}</Text>
            </div>
          </div>
        </Layout.Vertical>
      </Dialog>
    )
  }, [tempIncluded, availableTargets])

  const [tempExcluded, setTempExcluded] = useState(excluded.map(toOption))
  useEffect(() => setTempExcluded(excluded.map(toOption)), [excluded])
  const [openExcluded, hideExcluded] = useModalHook(() => {
    const handleTempExcludedChange = (newData: any) => {
      setTempExcluded(newData)
    }

    const handleSaveTempExcluded = () => {
      onChangeExcluded(tempExcluded.map(x => x.value))
      hideExcluded()
    }

    return (
      <Dialog isOpen onClose={hideExcluded} title={`Serve variation to the following`}>
        <Layout.Vertical spacing="medium" padding={{ left: 'large', right: 'medium' }}>
          <MultiSelect
            fill
            allowCreatingNewItems={false}
            value={tempExcluded}
            items={availableTargets.map(toOption)}
            onChange={handleTempExcludedChange}
          />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Button intent="primary" onClick={handleSaveTempExcluded}>
              Save
            </Button>
            <Button minimal onClick={hideExcluded}>
              Cancel
            </Button>
            <div style={{ marginLeft: 'auto' }}>
              <Text>{`${tempExcluded.length} total`}</Text>
            </div>
          </div>
        </Layout.Vertical>
      </Dialog>
    )
  }, [tempExcluded, availableTargets])

  const [includedAvatars, excludedAvatars] = [included, excluded].map(x => x.map(toAvatar))

  const handleClauseChange = (idx: number) => ({ kind, payload }: ClauseMutation) => {
    rules[idx] = {
      ...rules[idx],
      [kind]: payload
    }
    onChangeRules([...rules])
  }

  const handleNewClause = () => {
    onChangeRules([
      ...rules,
      {
        id: '',
        op: 'starts_with',
        attribute: '',
        values: [],
        negate: false
      }
    ])
  }

  const handleDelete = (idx: number) => () => {
    onChangeRules(rules.filter((_, index) => index !== idx))
  }

  return (
    <Layout.Vertical spacing="medium" padding="large">
      <Layout.Horizontal style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        {!editing && <Button text="Edit Rules" icon="edit" onClick={onEdit} />}
      </Layout.Horizontal>
      <Card style={{ width: '100%', padding: 'var(--spacing-medium)' }}>
        <Layout.Vertical spacing="small">
          <Text font={{ size: 'medium', weight: 'bold' }}>Individual Targets</Text>
          <Layout.Horizontal
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
            padding="small"
          >
            <Text>Include the following:</Text>{' '}
            {editing && includedAvatars.length === 0 ? (
              <AddTargetAvatar onAdd={openIncluded} />
            ) : (
              <AvatarGroup overlap avatars={includedAvatars} onAdd={editing ? openIncluded : undefined} />
            )}
          </Layout.Horizontal>
          <Divider />
          <Layout.Horizontal
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
            padding="small"
          >
            <Text>Exclude the following:</Text>{' '}
            {editing && excludedAvatars.length === 0 ? (
              <AddTargetAvatar onAdd={openExcluded} />
            ) : (
              <AvatarGroup overlap avatars={excludedAvatars} onAdd={editing ? openExcluded : undefined} />
            )}
          </Layout.Horizontal>
        </Layout.Vertical>
      </Card>
      {rules.map((clause, idx) => {
        return (
          <Layout.Horizontal spacing="medium" flex={{ align: 'center-center' }} width="100%" key={idx}>
            <Card style={{ flexGrow: 1 }}>
              {editing ? (
                <ClauseEditMode
                  key={idx}
                  index={idx}
                  attribute={clause.attribute}
                  operator={clause.op}
                  operators={operators}
                  values={clause.values}
                  onChange={handleClauseChange(idx)}
                />
              ) : (
                <ClauseViewMode key={idx} clause={clause} operators={operators} />
              )}
            </Card>
            {editing && <Icon name="trash" size={24} color={Color.GREY_300} onClick={handleDelete(idx)} />}
          </Layout.Horizontal>
        )
      })}
      {editing && (
        <Text color={Color.AQUA_500} onClick={handleNewClause}>
          + Check for condition and include target to segment
        </Text>
      )}
      {editing && (
        <Layout.Horizontal spacing="small" padding="medium" style={{ marginTop: 'auto' }}>
          <Button
            text="Save"
            intent="primary"
            onClick={() => {
              onSave()
            }}
          />
          <Button
            minimal
            text="Cancel"
            onClick={() => {
              onCancel()
            }}
          />
          {loadingSave && <Spinner size={24} />}
        </Layout.Horizontal>
      )}
    </Layout.Vertical>
  )
}

type TempSegment = {
  excluded: string[]
  included: string[]
  rules: Clause[]
}

type SegmentMutation =
  | { type: 'included'; payload: string[] }
  | { type: 'excluded'; payload: string[] }
  | { type: 'rules'; payload: Clause[] }
  | { type: 'set'; payload: TempSegment }

type MutationType = 'included' | 'excluded' | 'rules'

const tempSegmentReducer = (state: TempSegment, action: SegmentMutation) => {
  switch (action.type) {
    case 'included':
    case 'excluded':
    case 'rules':
      return {
        ...state,
        [action.type]: action.payload
      }
    case 'set':
      return action.payload
  }
}

const setIncluded = (payload: string[]): SegmentMutation => ({ type: 'included', payload })
const setExcluded = (payload: string[]): SegmentMutation => ({ type: 'excluded', payload })
const setRules = (payload: Clause[]): SegmentMutation => ({ type: 'rules', payload })
const setTempSegment = (payload: TempSegment): SegmentMutation => ({ type: 'set', payload })

const CFSegmentDetailsPage = () => {
  const history = useHistory()
  const { showError } = useToaster()
  const [editing, setEditing] = useState(false)
  const { environmentIdentifier: environment, projectIdentifier: project, segmentIdentifier: identifier } = useParams<
    any
  >()
  const { data, loading, refetch: fetchSegment } = useGetSegment({
    identifier,
    queryParams: {
      environment,
      project,
      ...SharedQueryParams
    }
  })

  const { data: rawTargets, loading: loadingTargets } = useGetAllTargets({
    queryParams: {
      environment,
      project,
      ...SharedQueryParams
    }
  })

  const { mutate: sendPatch, loading: loadingPatch } = usePatchSegment({
    identifier,
    queryParams: {
      environment,
      project,
      ...SharedQueryParams
    }
  })

  const targets = rawTargets?.targets?.map(t => t.identifier || '') || []

  const [tempSegment, dispatch] = useReducer(tempSegmentReducer, {
    included: [...(data?.included || [])],
    excluded: [...(data?.excluded || [])],
    rules: [...(data?.rules || [])]
  })

  useEffect(() => {
    dispatch(
      setTempSegment({
        included: [...(data?.included || [])],
        excluded: [...(data?.excluded || [])],
        rules: [...(data?.rules || [])]
      })
    )
  }, [data])

  const handleSegmentChange = (type: MutationType) => (newData: any) => {
    if (type === 'included') {
      dispatch(setIncluded(newData))
    } else if (type === 'excluded') {
      dispatch(setExcluded(newData))
    } else if (type === 'rules') {
      dispatch(setRules(newData))
    }
  }

  const handleSave = () => {
    const instructions = []
    const [addedToInc, removedFromInc] = getDiff(data?.included || [], tempSegment.included)
    const [addedToExc, removedFromExc] = getDiff(data?.excluded || [], tempSegment.excluded)

    removedFromExc.length > 0 && instructions.push(patch.creators.removeFromExcludeList(removedFromExc))
    removedFromInc.length > 0 && instructions.push(patch.creators.removeFromIncludeList(removedFromInc))
    addedToExc.length > 0 && instructions.push(patch.creators.addToExcludeList(addedToExc))
    addedToInc.length > 0 && instructions.push(patch.creators.addToIncludeList(addedToInc))

    const removedClauses = (data?.rules || []).filter(c => !tempSegment.rules.find(x => x.id === c.id))
    const updatedClauses = (data?.rules || []).filter(
      c =>
        !isEqual(
          c,
          tempSegment.rules.find(x => x.id === c.id)
        )
    )
    const newClauses = tempSegment.rules.filter(c => c.id === '')

    removedClauses.length > 0 &&
      instructions.push(...removedClauses.map(cl => patch.creators.removeClauseOnSegment(cl.id)))
    updatedClauses.length > 0 &&
      instructions.push(
        ...updatedClauses.map(cl =>
          patch.creators.updateClauseOnSegment({
            ...omit(cl, ['id', 'negate']),
            clauseID: cl.id
          })
        )
      )
    newClauses.length > 0 &&
      instructions.push(...newClauses.map(cl => patch.creators.addClauseToSegment(omit(cl, ['id']))))

    patch.segment.addAllInstructions(instructions)
    patch.segment.onPatchAvailable(patchData => {
      sendPatch(patchData)
        .then(() => {
          fetchSegment()
          setEditing(false)
        })
        .catch(() => {
          showError('Error saving')
        })
        .finally(() => patch.segment.reset())
    })
  }

  const handleCancel = () => {
    dispatch(
      setTempSegment({
        included: [...(data?.included || [])],
        excluded: [...(data?.excluded || [])],
        rules: [...(data?.rules || [])]
      })
    )
    setEditing(false)
  }

  if (loading || loadingTargets) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }

  return (
    <Layout.Vertical spacing="medium">
      <Layout.Vertical background={Color.BLUE_300} padding="medium" spacing="medium">
        <Container
          width="100%"
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text color={Color.BLUE_500} onClick={history.goBack} style={{ cursor: 'pointer' }}>
            Targets: Segments /
          </Text>
          <Icon name="Options" size={24} />
        </Container>
        <Container
          width="100%"
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text font="large" color={Color.BLACK}>
            {data?.name}
          </Text>
        </Container>
      </Layout.Vertical>
      <Layout.Horizontal background={Color.GREY_600} padding="medium">
        <Text color={Color.WHITE}>{`Environment: ${environment}`}</Text>
      </Layout.Horizontal>
      <Layout.Horizontal style={{ flexGrow: 1 }}>
        <Container width="30%" height="100%">
          To be implemented
        </Container>
        <Container width="70%" height="100%">
          <Tabs id="editSegmentTabs">
            <Tab
              id="rules"
              title="Rules"
              panel={
                <RulesTab
                  availableTargets={targets}
                  rules={tempSegment.rules || []}
                  included={tempSegment.included}
                  excluded={tempSegment.excluded}
                  editing={editing}
                  loadingSave={loadingPatch}
                  onChangeIncluded={handleSegmentChange('included')}
                  onChangeExcluded={handleSegmentChange('excluded')}
                  onChangeRules={handleSegmentChange('rules')}
                  onEdit={() => setEditing(true)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              }
            />
            <Tab id="activity" title="Activity Log" panel={<div>To be implemented</div>} />
          </Tabs>
        </Container>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default CFSegmentDetailsPage
