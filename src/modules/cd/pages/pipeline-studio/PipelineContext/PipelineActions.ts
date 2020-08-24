import { clone } from 'lodash'
import type { IDrawerProps } from '@blueprintjs/core'
import type { CDPipeline, ExecutionWrapper } from 'services/cd-ng'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import type { Diagram } from 'modules/common/exports'

export enum PipelineActions {
  DBInitialize = 'DBInitialize',
  Initialize = 'Initialize',
  Fetching = 'Fetching',
  UpdatePipelineView = 'UpdatePipelineView',
  UpdatePipeline = 'UpdatePipeline',
  PipelineSaved = 'PipelineSaved',
  Success = 'Success',
  Error = 'Error'
}
export const DefaultNewPipelineId = '-1'

export enum DrawerTypes {
  StepConfig = 'StepConfig',
  AddStep = 'AddCommand',
  PipelineVariables = 'PipelineVariables',
  Templates = 'Templates'
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
      isAddStepOverride: boolean
      isParallelNodeClicked: boolean
      entity: Diagram.DefaultNodeModel
    }
    stepConfig?: {
      node: ExecutionWrapper
      isStepGroup: boolean
    }
  }
}
export interface PipelineViewData {
  isSplitViewOpen: boolean
  splitViewData: {
    selectedStageId?: string
    type?: SplitViewTypes
  }
  isDrawerOpened: boolean
  drawerData: DrawerData
}

export interface PipelineReducerState {
  pipeline: CDPipeline
  pipelineView: PipelineViewData
  pipelineIdentifier: string
  error?: string
  isDBInitialized: boolean
  isLoading: boolean
  isInitialized: boolean
  isUpdated: boolean
  snippets?: SnippetInterface[]
}

export const DefaultPipeline: CDPipeline = {
  identifier: DefaultNewPipelineId
}

export interface ActionResponse {
  error?: string
  isUpdated?: boolean
  pipeline?: CDPipeline
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
const updating = (): ActionReturnType => ({ type: PipelineActions.UpdatePipeline })
const fetching = (): ActionReturnType => ({ type: PipelineActions.Fetching })
const pipelineSavedAction = (): ActionReturnType => ({ type: PipelineActions.PipelineSaved })
const success = (response: ActionResponse): ActionReturnType => ({ type: PipelineActions.Success, response })
const error = (response: ActionResponse): ActionReturnType => ({ type: PipelineActions.Error, response })

export const PipelineContextActions = {
  dbInitialized,
  initialized,
  updating,
  fetching,
  pipelineSavedAction,
  updatePipelineView,
  success,
  error
}

export const initialState: PipelineReducerState = {
  pipeline: { ...DefaultPipeline },
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
        isUpdated: true,
        pipeline: response?.pipeline ? clone(response?.pipeline) : state.pipeline
      }
    case PipelineActions.PipelineSaved:
      return {
        ...state,
        isLoading: false,
        isUpdated: false
      }
    case PipelineActions.Fetching:
      return {
        ...state,
        isLoading: true,
        isUpdated: false
      }
    case PipelineActions.Success:
    case PipelineActions.Error:
      return { ...state, isLoading: false, ...response }
    default:
      return state
  }
}
