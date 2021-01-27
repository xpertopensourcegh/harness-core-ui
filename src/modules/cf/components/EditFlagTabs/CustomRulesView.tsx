import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  AvatarGroup,
  Color,
  Layout,
  Text,
  SelectOption,
  Card,
  Select,
  MultiSelect,
  MultiSelectOption,
  TextInput,
  Icon,
  useModalHook,
  Button,
  Popover
} from '@wings-software/uicore'
import { Dialog, Menu } from '@blueprintjs/core'
import { assoc, compose, prop } from 'lodash/fp'
import { Clause, Feature, Variation, Serve, VariationMap, useGetAllTargets, Target } from 'services/cf'
import { shape } from '@cf/utils/instructions'
import { extraOperators, useOperatorsFromYaml } from '@cf/constants'
import PercentageRollout from './PercentageRollout'
import i18n from './Tabs.i18n'
import css from './TabTargeting.module.scss'

export interface RuleData {
  ruleId?: string
  serve: Serve
  clauses: Clause[]
  priority: number
}

type Serving = VariationMap

interface Option<T> {
  label: string
  value: T
}

type Finder<T> = (value: T) => Option<T> | undefined

const toOption = (x: string): Option<string> => ({ label: x, value: x })
function useOptions<T>(as: T[], mapper: (a: T) => string): [Option<string>[], Finder<string>] {
  const opts = as.map(mapper).map(toOption)
  return [opts, (val: string) => opts.find(o => o.value === val)]
}

const emptyClause = (): Clause => ({
  id: '',
  op: 'starts_with',
  attribute: '',
  values: [],
  negate: false
})

const emptyRule = (priority = -1): RuleData => ({
  serve: { variation: '' },
  clauses: [emptyClause()],
  priority
})

const emptyServing = (): Serving => ({
  variation: '',
  targets: []
})

const addTargetAvatar = (onAdd: () => void) => ({
  name: '+',
  color: Color.BLUE_500,
  backgroundColor: Color.GREY_200,
  onClick: onAdd
})

const extraOps = extraOperators.customRules
const useCustomRulesOperators = () => useOperatorsFromYaml(extraOps)

interface ClauseRowProps {
  index: number
  label: string
  attribute: string
  operator: SelectOption
  values: string[]
  isLast: boolean
  isSingleClause: boolean
  error: boolean
  onOperatorChange: (op: string) => void
  onAttributeChange: (attr: string) => void
  onValuesChange: (values: string[]) => void
  onAddNewRow: () => void
  onRemoveRow: () => void
}

const ClauseRow: React.FC<ClauseRowProps> = props => {
  const {
    index,
    label,
    attribute,
    operator,
    values,
    isLast,
    isSingleClause,
    error,
    onAttributeChange,
    onOperatorChange,
    onValuesChange,
    onAddNewRow,
    onRemoveRow
  } = props
  const operators = useCustomRulesOperators()
  const valueOpts = values.map(toOption)
  const handleAttrChange = (e: React.ChangeEvent<HTMLInputElement>) => onAttributeChange(e.target.value)
  const handleOperatorChange = (data: SelectOption) => onOperatorChange(data.value as string)
  const handleValuesChange = (data: MultiSelectOption[]) => onValuesChange(data.map(x => x.value as string))

  const actions = [
    <Icon
      key="delete-icon-0"
      name="delete"
      style={{ visibility: isSingleClause ? 'hidden' : 'visible' }}
      size={24}
      color={Color.ORANGE_500}
      onClick={onRemoveRow}
    />,
    <Icon
      key="add-icon-1"
      name="add"
      style={{ visibility: isSingleClause || isLast ? 'visible' : 'hidden' }}
      size={24}
      color={Color.BLUE_500}
      onClick={onAddNewRow}
    />
  ]
  if (isSingleClause) {
    actions.reverse()
  }

  const height = '36px'

  return (
    <Layout.Horizontal spacing="xsmall">
      <Text
        color={Color.GREY_350}
        font="normal"
        style={{ display: 'flex', height, alignItems: 'center', justifyContent: 'flex-end', minWidth: '80px' }}
      >
        {label}
      </Text>
      <div style={{ flex: '1' }}>
        <TextInput
          style={{ height }}
          id={`attribute-${index}`}
          value={attribute}
          disabled={operator.value === extraOps.matchSegment}
          onChange={handleAttrChange}
        />
      </div>
      <div style={{ flex: '0.8' }}>
        <Select inputProps={{ style: { height } }} value={operator} items={operators} onChange={handleOperatorChange} />
      </div>
      <div style={{ flex: '1.5' }}>
        <MultiSelect
          fill
          tagInputProps={{
            intent: error ? 'danger' : 'none'
          }}
          items={valueOpts}
          value={valueOpts}
          onChange={handleValuesChange}
        />
        {error && <Text intent="danger">Required</Text>}
      </div>
      <Layout.Horizontal flex={{ align: 'center-center' }} spacing="small">
        {actions}
      </Layout.Horizontal>
    </Layout.Horizontal>
  )
}

interface RuleEditCardProps {
  rule: RuleData
  variations: Variation[]
  errors: any
  onDelete: () => void
  onChange: (rule: RuleData) => void
}

const RuleEditCard: React.FC<RuleEditCardProps> = ({ rule, variations, errors, onDelete, onChange }) => {
  const operators = useCustomRulesOperators()
  const percentageRollout = { label: 'a rollout percentage', value: 'percentage' }
  const [varOpts, findVariationOpt] = useOptions(variations, x => x.identifier)
  const variationOps = varOpts.concat([percentageRollout])
  const currentServe = rule.serve.distribution ? percentageRollout : findVariationOpt(rule.serve.variation as string)
  const handleClauseChange = (idx: number, field: keyof Clause) => (value: any) => {
    onChange({
      ...rule,
      clauses: assoc(idx, assoc(field, value, rule.clauses[idx]), rule.clauses)
    })
  }

  const handleServeChange = (data: SelectOption) => {
    if (data.value === 'percentage') {
      onChange({
        ...rule,
        serve: {
          distribution: {
            bucketBy: '',
            variations: []
          }
        }
      })
    } else {
      onChange({
        ...rule,
        serve: { variation: data.value as string }
      })
    }
  }

  const handleAddNewRow = () => {
    onChange({
      ...rule,
      clauses: [...rule.clauses, emptyClause()]
    })
  }

  const handleRemove = (idx: number) => () => {
    onChange({
      ...rule,
      clauses: rule.clauses.filter((_, index) => index !== idx)
    })
  }

  const handleRolloutChange = (data: any) => {
    onChange({
      ...rule,
      serve: { distribution: data }
    })
  }

  return (
    <Layout.Horizontal spacing="small">
      <Card style={{ width: '100%' }}>
        <Layout.Vertical spacing="medium">
          {rule.clauses.map((clause, idx) => (
            <ClauseRow
              key={idx}
              index={idx}
              isLast={idx === rule.clauses.length - 1}
              isSingleClause={rule.clauses.length === 1}
              label={idx === 0 ? i18n.tabTargeting.onRequest : i18n.and.toLocaleLowerCase()}
              attribute={clause?.attribute || ''}
              operator={operators.find(x => x.value === clause.op) || operators[0]}
              values={clause.values ?? []}
              error={Boolean(errors?.[idx])}
              onOperatorChange={handleClauseChange(idx, 'op')}
              onAttributeChange={handleClauseChange(idx, 'attribute')}
              onValuesChange={handleClauseChange(idx, 'values')}
              onAddNewRow={handleAddNewRow}
              onRemoveRow={handleRemove(idx)}
            />
          ))}
          <Layout.Horizontal spacing="xsmall">
            <Text
              color={Color.GREY_350}
              font="normal"
              style={{
                display: 'flex',
                height: '36px',
                alignItems: 'center',
                justifyContent: 'flex-end',
                minWidth: '80px'
              }}
            >
              {i18n.tabTargeting.serve.toLocaleLowerCase()}
            </Text>
            <div style={{ flexGrow: 0 }}>
              <Select
                value={currentServe}
                items={variationOps}
                inputProps={{ style: { height: '36px' } }}
                onChange={handleServeChange}
              />
            </div>
          </Layout.Horizontal>
          {currentServe?.value === 'percentage' && (
            <div style={{ paddingLeft: '94px' }}>
              <PercentageRollout
                editing={true}
                variations={variations}
                weightedVariations={rule.serve.distribution?.variations || []}
                onSetPercentageValues={handleRolloutChange}
              />
            </div>
          )}
        </Layout.Vertical>
      </Card>
      <Icon
        name="trash"
        margin={{ top: 'xlarge' }}
        size={24}
        color={Color.GREY_300}
        onClick={onDelete}
        style={{ cursor: 'pointer', height: 'fit-content' }}
      />
    </Layout.Horizontal>
  )
}

interface RuleViewCardProps {
  rule: RuleData
  variations: Variation[]
}

const InlineBold: React.FC<{}> = ({ children }) => <span style={{ fontWeight: 'bold' }}>{children}</span>

const safeJoin = (data: any[], separator: string) => data?.join(separator) || `[${data}]`

const ClauseViewMode: React.FC<{ clause: Clause; operators: { label: string; value: string }[] }> = ({
  clause,
  operators
}) => {
  return (
    <>
      <InlineBold>{` ${clause.attribute} `} </InlineBold>{' '}
      {operators.find(op => op.value === clause.op)?.label || 'NO_OP'}{' '}
      <InlineBold>{` ${safeJoin(clause.values, ', ')}`}</InlineBold>
    </>
  )
}

const RuleViewCard: React.FC<RuleViewCardProps> = ({ rule, variations }) => {
  const isPercentage = Boolean(rule.serve.distribution)
  const operators = useCustomRulesOperators()
  const [firstClause, ...extraClauses] = rule.clauses

  let clausesComponent
  if (extraClauses.length > 0) {
    clausesComponent = (
      <>
        <div>
          {`${i18n.if} `}
          <ClauseViewMode clause={firstClause} operators={operators} />
        </div>
        {extraClauses.map((clause, idx) => {
          return (
            <li key={idx}>
              {`${i18n.and.toLocaleLowerCase()} `}
              <ClauseViewMode clause={clause} operators={operators} />
            </li>
          )
        })}
        <div>
          {`${i18n.serveVariation.serve.toLocaleLowerCase()} `}{' '}
          {isPercentage ? <InlineBold>{i18n.serveVariation.percentageRollout}</InlineBold> : rule.serve.variation}
        </div>
      </>
    )
  } else {
    clausesComponent = (
      <>
        <div>
          {`${i18n.if} `}
          <ClauseViewMode clause={firstClause} operators={operators} />,
          {` ${i18n.serveVariation.serve.toLocaleLowerCase()} `}
          {isPercentage ? <InlineBold>{i18n.serveVariation.percentageRollout}</InlineBold> : rule.serve.variation}
        </div>
      </>
    )
  }

  return (
    <Card style={{ width: '100%' }}>
      <Layout.Vertical spacing="small">
        {clausesComponent}
        {isPercentage && (
          <PercentageRollout
            editing={false}
            variations={variations}
            weightedVariations={rule.serve.distribution?.variations || []}
          />
        )}
      </Layout.Vertical>
    </Card>
  )
}

interface ServingCardRowProps {
  variation: string
  variationOps: Option<string>[]
  editing: boolean
  environment: string
  project: string
  targetAvatars: { name: string }[]
  error?: { variation?: string; targets?: string }
  onChangeTargets: (data: any[]) => void
  onChangeVariation: (data: any) => void
  onDelete: () => void
}

const ServingCardRow: React.FC<ServingCardRowProps> = ({
  editing,
  variationOps,
  variation,
  targetAvatars,
  environment,
  project,
  error,
  onChangeTargets,
  onChangeVariation,
  onDelete
}) => {
  const [openMenu, setOpenMenu] = useState(false)
  const [tagOpts] = useOptions(targetAvatars, prop(['name']))
  const { orgIdentifier, accountId } = useParams<Record<string, string>>()
  const { data } = useGetAllTargets({
    queryParams: {
      environment,
      project,
      account: accountId,
      org: orgIdentifier
    }
  })

  const availableTargets = ((data?.targets || []) as Target[]).map(compose(toOption, prop('identifier'))) || []
  const [tempTargets, setTempTargets] = useState(tagOpts)

  const [openEditModal, hideModal] = useModalHook(() => {
    const handleTempTargetChange = (newData: any) => {
      setTempTargets(newData)
    }

    const handleSaveTemp = () => {
      onChangeTargets(tempTargets.map(x => x.value))
      hideModal()
    }

    return (
      <Dialog isOpen onClose={hideModal} title={`Serve ${variation} to the following`}>
        <Layout.Vertical spacing="medium" padding={{ left: 'large', right: 'medium' }}>
          <MultiSelect
            allowCreatingNewItems={false}
            fill
            value={tempTargets}
            items={availableTargets}
            onChange={handleTempTargetChange}
          />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Button intent="primary" onClick={handleSaveTemp}>
              {i18n.save}
            </Button>
            <Button minimal onClick={hideModal}>
              {i18n.cancel}
            </Button>
            <div style={{ marginLeft: 'auto' }}>
              <Text>{`${tempTargets.length} total`}</Text>
            </div>
          </div>
        </Layout.Vertical>
      </Dialog>
    )
  }, [tagOpts, availableTargets])

  const avatars = editing ? targetAvatars.concat([addTargetAvatar(openEditModal)]) : targetAvatars
  const selectValue = variationOps.find(v => v.value === variation)

  const component = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Text>{i18n.serveVariation.serve}</Text>
      <div style={{ maxWidth: '210px', margin: '0px 10px' }}>
        {editing ? (
          <Select
            value={selectValue}
            items={variationOps}
            onChange={compose(onChangeVariation, prop('value'))}
            inputProps={{ intent: error?.variation ? 'danger' : 'none' }}
          />
        ) : (
          <Text>{variation}</Text>
        )}
      </div>
      <Text>{i18n.serveVariation.toTarget}</Text>
      <AvatarGroup overlap avatars={avatars} />
      <Text>{targetAvatars.length} total</Text>
      {editing && (
        <div style={{ marginLeft: 'auto', marginRight: '0', cursor: 'pointer' }}>
          <Popover isOpen={openMenu} onInteraction={setOpenMenu}>
            <Icon size={24} name="Options" />
            <Menu>
              <Menu.Item icon="edit" text="Edit" onClick={openEditModal} />
              <Menu.Item icon="cross" text="Delete" onClick={onDelete} />
            </Menu>
          </Popover>
        </div>
      )}
    </div>
  )

  const hasError = Boolean(error?.targets || error?.variation)
  const errorMsg = [error?.targets && 'Targets', error?.variation && 'Variation']
    .filter(x => Boolean(x))
    .join(' and ')
    .concat(' required')

  return editing ? (
    <>
      <Card>{component}</Card>
      {hasError && <Text intent="danger">{errorMsg}</Text>}
    </>
  ) : (
    component
  )
}

interface ServingCardProps {
  variations: Variation[]
  servings: Serving[]
  editing: boolean
  environment: string
  project: string
  errors: any
  onAdd: () => void
  onUpdate: (idx: number, attr: 'targets' | 'variation', data: any) => void
  onRemove: (idx: number) => void
}

const ServingCard: React.FC<ServingCardProps> = ({
  servings,
  variations,
  editing,
  environment,
  project,
  errors,
  onAdd,
  onUpdate,
  onRemove
}) => {
  const toVariationOp = (variation: Variation) => ({
    label: variation.name || variation.identifier,
    value: variation.identifier
  })
  const handleUpdate = (idx: number, attr: 'targets' | 'variation') => (data: any) => onUpdate(idx, attr, data)
  const moreAvaiable = servings.length < variations.length

  return (
    <Card style={{ width: '100%' }}>
      <Layout.Vertical spacing="medium">
        {servings.map(({ variation, targets }, idx) => {
          const targetAvatars = targets?.map(shape<{ name: string }>('name'))
          const variationOps = variations
            .filter(v => !servings.find(serving => serving.variation === v.identifier) || v.identifier === variation)
            .map(toVariationOp)
          return (
            <ServingCardRow
              key={idx}
              variation={variation}
              variationOps={variationOps}
              targetAvatars={targetAvatars ?? []}
              editing={editing}
              environment={environment}
              project={project}
              onChangeTargets={handleUpdate(idx, 'targets')}
              onChangeVariation={handleUpdate(idx, 'variation')}
              onDelete={() => onRemove(idx)}
              error={errors[idx]}
            />
          )
        })}
        {editing && moreAvaiable && (
          <Text color={Color.AQUA_500} onClick={onAdd} style={{ cursor: 'pointer', width: 'fit-content' }}>
            + {i18n.serveVariation.add}
          </Text>
        )}
      </Layout.Vertical>
    </Card>
  )
}

interface CustomRulesViewProps {
  formikProps: any
  target: Feature
  editing: boolean
  enviroment: string
  project: string
}

const CustomRulesView: React.FC<CustomRulesViewProps> = ({ formikProps, target, editing, enviroment, project }) => {
  const tempRules = formikProps.values.customRules
  const setTempRules = (data: RuleData[]) => formikProps.setFieldValue('customRules', data)
  const servings = formikProps.values.variationMap
  const setServings = (data: Serving[]) => formikProps.setFieldValue('variationMap', data)

  const handleAddServing = () => setServings([...servings, emptyServing()])

  const handleUpdateServing = (idx: number, attr: 'targets' | 'variation', data: any) => {
    servings[idx][attr] = data
    setServings([...servings])
  }

  const handleDeleteServing = (idx: number) => {
    setServings([...servings.slice(0, idx), ...servings.slice(idx + 1)])
  }

  const handleClearServings = () => {
    setServings([])
  }

  const getPriority = () =>
    tempRules.reduce((max: number, next: { priority: number }) => (max < next.priority ? next.priority : max), 0) + 100

  const handleOnRequest = () => {
    setTempRules([...tempRules, emptyRule(getPriority())])
  }

  const handleRuleChange = (index: number) => (newData: RuleData) => {
    setTempRules([...tempRules.slice(0, index), newData, ...tempRules.slice(index + 1)])
  }

  const handleDeleteRule = (index: number) => () => {
    setTempRules([...tempRules.slice(0, index), ...tempRules.slice(index + 1)])
  }

  return (
    <>
      <Text
        font={{ weight: 'bold' }}
        color={Color.BLACK}
        margin={{ bottom: 'medium' }}
        className={css.defaultRulesHeadingMt}
      >
        {i18n.customRules.header}
      </Text>
      <Layout.Vertical margin="medium">
        {servings.length > 0 && (
          <Layout.Horizontal spacing="small">
            <ServingCard
              editing={editing}
              servings={servings}
              variations={target.variations}
              environment={enviroment}
              project={project}
              onAdd={handleAddServing}
              onUpdate={handleUpdateServing}
              onRemove={handleDeleteServing}
              errors={formikProps.errors?.variationMap || []}
            />
            {editing && (
              <Icon
                name="trash"
                margin={{ top: 'xlarge' }}
                size={24}
                color={Color.GREY_300}
                style={{ cursor: 'pointer', height: 'fit-content' }}
                onClick={handleClearServings}
              />
            )}
          </Layout.Horizontal>
        )}
        {tempRules.length > 0 &&
          tempRules.map((rule: RuleData, idx: number) => (
            <Layout.Vertical key={idx} spacing="medium">
              {editing ? (
                <RuleEditCard
                  key={idx}
                  rule={rule}
                  variations={target.variations}
                  onDelete={handleDeleteRule(idx)}
                  onChange={handleRuleChange(idx)}
                  errors={formikProps.errors?.rules?.[idx] || []}
                />
              ) : (
                <RuleViewCard key={idx} rule={rule} variations={target.variations} />
              )}
            </Layout.Vertical>
          ))}
      </Layout.Vertical>
      {editing && (
        <>
          {servings.length === 0 && (
            <Text
              margin={{ bottom: 'medium' }}
              color={Color.AQUA_500}
              onClick={handleAddServing}
              style={{ cursor: 'pointer' }}
            >
              + {i18n.customRules.serveVartiation}
            </Text>
          )}
          <Text color={Color.AQUA_500} onClick={handleOnRequest} style={{ cursor: 'pointer' }}>
            + {i18n.customRules.onRequest}
          </Text>
        </>
      )}
    </>
  )
}

export default CustomRulesView
