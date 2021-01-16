import { clone } from 'lodash-es'
import type { IDrawerProps } from '@blueprintjs/core'
import type { NgPipeline, ExecutionWrapper, YamlSnippetMetaData } from 'services/cd-ng'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import type { Diagram } from '@pipeline/exports'
import type { DependenciesWrapper } from '../ExecutionGraph/ExecutionGraphUtil'
import type { AdvancedPanels } from '../StepCommands/StepCommandTypes'

export enum PipelineActions {
  DBInitialize = 'DBInitialize',
  Initialize = 'Initialize',
  Fetching = 'Fetching',
  UpdatePipelineView = 'UpdatePipelineView',
  UpdatePipeline = 'UpdatePipeline',
  SetYamlHandler = 'SetYamlHandler',
  PipelineSaved = 'PipelineSaved',
  Success = 'Success',
  Error = 'Error'
}
export const DefaultNewPipelineId = '-1'

export enum DrawerTypes {
  StepConfig = 'StepConfig',
  AddStep = 'AddCommand',
  PipelineVariables = 'PipelineVariables',
  Templates = 'Templates',
  ExecutionStrategy = 'ExecutionStrategy',
  AddService = 'AddService',
  ConfigureService = 'ConfigureService'
}

export const DrawerSizes: { [key: string]: number } = {
  StepConfig: 600,
  AddCommand: 700,
  PipelineVariables: 450,
  Templates: 450,
  ExecutionStrategy: 1000,
  AddService: 485,
  ConfigureService: 600
}

export enum SplitViewTypes {
  Triggers = 'Triggers',
  Notifications = 'Notifications',
  StageView = 'StageView'
}
export interface DrawerData extends Omit<IDrawerProps, 'isOpen'> {
  type: DrawerTypes
  data?: {
    paletteData?: {
      isRollback: boolean
      isParallelNodeClicked: boolean
      entity: Diagram.DefaultNodeModel
      hiddenAdvancedPanels?: AdvancedPanels[]
    }
    stepConfig?: {
      node: ExecutionWrapper | DependenciesWrapper
      addOrEdit: 'add' | 'edit'
      isStepGroup: boolean
      hiddenAdvancedPanels?: AdvancedPanels[]
    }
  }
}
export interface PipelineViewData {
  isSplitViewOpen: boolean
  splitViewData: {
    selectedStageId?: string
    stageType?: string
    type?: SplitViewTypes
  }
  isDrawerOpened: boolean
  drawerData: DrawerData
}

export interface PipelineReducerState {
  pipeline: NgPipeline
  yamlHandler?: YamlBuilderHandlerBinding
  originalPipeline: NgPipeline
  pipelineView: PipelineViewData
  pipelineIdentifier: string
  error?: string
  isDBInitialized: boolean
  isLoading: boolean
  isInitialized: boolean
  isBEPipelineUpdated: boolean
  isUpdated: boolean
  snippets?: YamlSnippetMetaData[]
}

export const DefaultPipeline: NgPipeline = {
  name: '',
  identifier: DefaultNewPipelineId
}

export interface ActionResponse {
  error?: string
  isUpdated?: boolean
  pipeline?: NgPipeline
  yamlHandler?: YamlBuilderHandlerBinding
  originalPipeline?: NgPipeline
  isBEPipelineUpdated?: boolean
  pipelineView?: PipelineViewData
}

export interface ActionReturnType {
  type: PipelineActions
  response?: ActionResponse
}

const dbInitialized = (): ActionReturnType => ({ type: PipelineActions.DBInitialize })
const initialized = (): ActionReturnType => ({ type: PipelineActions.Initialize })
const updatePipelineView = (response: ActionResponse): ActionReturnType => ({
  type: PipelineActions.UpdatePipelineView,
  response
})
const setYamlHandler = (response: ActionResponse): ActionReturnType => ({
  type: PipelineActions.SetYamlHandler,
  response
})
const updating = (): ActionReturnType => ({ type: PipelineActions.UpdatePipeline })
const fetching = (): ActionReturnType => ({ type: PipelineActions.Fetching })
const pipelineSavedAction = (response: ActionResponse): ActionReturnType => ({
  type: PipelineActions.PipelineSaved,
  response
})
const success = (response: ActionResponse): ActionReturnType => ({ type: PipelineActions.Success, response })
const error = (response: ActionResponse): ActionReturnType => ({ type: PipelineActions.Error, response })

export const PipelineContextActions = {
  dbInitialized,
  initialized,
  updating,
  fetching,
  pipelineSavedAction,
  updatePipelineView,
  setYamlHandler,
  success,
  error
}

export const initialState: PipelineReducerState = {
  pipeline: { ...DefaultPipeline },
  originalPipeline: { ...DefaultPipeline },
  pipelineIdentifier: DefaultNewPipelineId,
  pipelineView: {
    isSplitViewOpen: false,
    isDrawerOpened: false,
    splitViewData: {},
    drawerData: {
      type: DrawerTypes.AddStep
    }
  },
  isLoading: false,
  isBEPipelineUpdated: false,
  isDBInitialized: false,
  isUpdated: false,
  isInitialized: false
}

export const PipelineReducer = (state = initialState, data: ActionReturnType): PipelineReducerState => {
  const { type, response } = data
  switch (type) {
    case PipelineActions.Initialize:
      return {
        ...state,
        isInitialized: true
      }
    case PipelineActions.DBInitialize:
      return {
        ...state,
        isDBInitialized: true
      }
    case PipelineActions.SetYamlHandler:
      return {
        ...state,
        yamlHandler: data.response?.yamlHandler
      }
    case PipelineActions.UpdatePipelineView:
      return {
        ...state,
        pipelineView: response?.pipelineView
          ? clone({ ...state.pipelineView, ...response?.pipelineView })
          : state.pipelineView
      }
    case PipelineActions.UpdatePipeline:
      return {
        ...state,
        isUpdated: response?.isUpdated ?? true,
        pipeline: response?.pipeline ? clone(response?.pipeline) : state.pipeline
      }
    case PipelineActions.PipelineSaved:
      return {
        ...state,
        ...response,
        isLoading: false,
        isUpdated: false
      }
    case PipelineActions.Fetching:
      return {
        ...state,
        isLoading: true,
        isBEPipelineUpdated: false,
        isUpdated: false
      }
    case PipelineActions.Success:
    case PipelineActions.Error:
      return { ...state, isLoading: false, ...response }
    default:
      return state
  }
}
