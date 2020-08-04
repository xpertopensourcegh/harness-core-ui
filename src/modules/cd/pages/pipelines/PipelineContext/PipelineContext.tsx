import React from 'react'
import { openDB, IDBPDatabase, deleteDB } from 'idb'
import xhr from '@wings-software/xhr-async'
import { parse, stringify } from 'yaml'
import type {
  CDPipeline,
  GetPipelineListQueryParams,
  PostPipelineExecuteQueryParams,
  ResponseDTOString
} from 'services/cd-ng'
import { ModuleName, loggerFor } from 'framework/exports'
import SessionToken from 'framework/utils/SessionToken'
import {
  PipelineReducerState,
  ActionReturnType,
  PipelineContextActions,
  DefaultNewPipelineId,
  DefaultPipeline,
  initialState,
  PipelineReducer,
  PipelineViewData
} from './PipelineActions'
const logger = loggerFor(ModuleName.CD)

export const getPipelineByIdentifier = (
  params: GetPipelineListQueryParams,
  identifier: string
): Promise<CDPipeline | undefined> => {
  return fetch(
    `/cd/api/pipelines/${identifier}?accountIdentifier=${params.accountIdentifier}&projectIdentifier=${params.projectIdentifier}&orgIdentifier=${params.orgIdentifier}`
  )
    .then(response => response.text())
    .then(response => {
      const obj = parse(response)
      if (obj.status === 'SUCCESS') {
        return parse(obj.data.yamlPipeline).pipeline as CDPipeline
      }
    })
}

export const savePipeline = (
  params: PostPipelineExecuteQueryParams,
  pipeline: CDPipeline,
  isEdit = false
): Promise<ResponseDTOString | undefined> => {
  return isEdit
    ? xhr
        .put<ResponseDTOString>(
          `/cd/api/pipelines/${pipeline.identifier}?accountIdentifier=${params.accountIdentifier}&projectIdentifier=${params.projectIdentifier}&orgIdentifier=${params.orgIdentifier}`,
          { data: stringify({ pipeline }), headers: { 'Content-Type': 'text/yaml' } }
        )
        .then(data => data.response)
    : xhr
        .post<ResponseDTOString>(
          `/cd/api/pipelines?accountIdentifier=${params.accountIdentifier}&projectIdentifier=${params.projectIdentifier}&orgIdentifier=${params.orgIdentifier}`,
          { data: stringify({ pipeline }), headers: { 'Content-Type': 'text/yaml' } }
        )
        .then(data => data.response)
}

const DBInitializationFailed = 'DB Creation retry exceeded.'

let IdbPipeline: IDBPDatabase | undefined
const IdbPipelineStoreName = 'pipeline-cache'
const PipelineDBName = 'pipeline-db'
const KeyPath = 'identifier'

interface PipelineContextInterface {
  state: PipelineReducerState
  fetchPipeline: (forceFetch?: boolean) => Promise<void>
  updatePipeline: (pipeline: CDPipeline) => Promise<void>
  updatePipelineView: (data: PipelineViewData) => void
  deletePipelineCache: () => void
  pipelineSaved: () => void
}

interface PipelinePayload {
  identifier: string
  pipeline: CDPipeline | undefined
  isUpdated: boolean
}

const getId = (
  accountIdentifier: string,
  orgIdentifier: string,
  projectIdentifier: string,
  pipelineIdentifier: string
): string => `${accountIdentifier}_${orgIdentifier}_${projectIdentifier}_${pipelineIdentifier}`

const _fetchPipeline = async (
  dispatch: React.Dispatch<ActionReturnType>,
  queryParams: GetPipelineListQueryParams,
  identifier: string,
  forceFetch = false
): Promise<void> => {
  const id = getId(
    queryParams.accountIdentifier,
    queryParams.orgIdentifier || '',
    queryParams.projectIdentifier || '',
    identifier
  )
  if (IdbPipeline) {
    dispatch(PipelineContextActions.fetching())
    const data: PipelinePayload = await IdbPipeline.get(IdbPipelineStoreName, id)
    if ((!data || forceFetch) && identifier !== DefaultNewPipelineId) {
      const pipeline = await getPipelineByIdentifier(queryParams, identifier)
      const payload: PipelinePayload = {
        [KeyPath]: id,
        pipeline,
        isUpdated: false
      }
      if (pipeline) {
        await IdbPipeline.put(IdbPipelineStoreName, payload)
        dispatch(PipelineContextActions.success({ error: '', pipeline, isUpdated: false }))
        dispatch(PipelineContextActions.initialized())
      } else if (data) {
        dispatch(
          PipelineContextActions.success({ error: '', pipeline: data?.pipeline, isUpdated: data?.isUpdated || true })
        )
        dispatch(PipelineContextActions.initialized())
      }
    } else {
      dispatch(
        PipelineContextActions.success({
          error: '',
          pipeline: data?.pipeline || { ...DefaultPipeline },
          isUpdated: data?.isUpdated || false
        })
      )
      dispatch(PipelineContextActions.initialized())
    }
  } else {
    dispatch(PipelineContextActions.success({ error: 'DB is not initialized' }))
  }
}

const _updatePipeline = async (
  dispatch: React.Dispatch<ActionReturnType>,
  queryParams: GetPipelineListQueryParams,
  identifier: string,
  pipeline: CDPipeline
): Promise<void> => {
  const id = getId(
    queryParams.accountIdentifier,
    queryParams.orgIdentifier || '',
    queryParams.projectIdentifier || '',
    identifier
  )
  if (IdbPipeline) {
    const payload: PipelinePayload = {
      [KeyPath]: id,
      pipeline,
      isUpdated: true
    }
    await IdbPipeline.put(IdbPipelineStoreName, payload)
    dispatch(PipelineContextActions.success({ error: '', pipeline, isUpdated: true }))
  }
}

const cleanUpDBRefs = (): void => {
  if (IdbPipeline) {
    IdbPipeline.close()
    IdbPipeline = undefined
  }
}

const _initializeDb = async (dispatch: React.Dispatch<ActionReturnType>, version: number, trial = 0): Promise<void> => {
  if (!IdbPipeline) {
    try {
      dispatch(PipelineContextActions.updating())
      IdbPipeline = await openDB(PipelineDBName, version, {
        upgrade(db) {
          try {
            db.deleteObjectStore(IdbPipelineStoreName)
          } catch (_) {
            logger.error('There was no DB found')
            dispatch(PipelineContextActions.error({ error: 'There was no DB found' }))
          }
          const objectStore = db.createObjectStore(IdbPipelineStoreName, { keyPath: KeyPath, autoIncrement: false })
          objectStore.createIndex(KeyPath, KeyPath, { unique: true })
        },
        async blocked() {
          cleanUpDBRefs()
        },
        async blocking() {
          cleanUpDBRefs()
        }
      })
      dispatch(PipelineContextActions.dbInitialized())
    } catch (e) {
      logger.info('DB downgraded, deleting and re creating the DB')

      await deleteDB(PipelineDBName)
      IdbPipeline = undefined

      ++trial

      if (trial < 5) {
        _initializeDb(dispatch, version, trial)
      } else {
        logger.error(DBInitializationFailed)
        dispatch(PipelineContextActions.error({ error: DBInitializationFailed }))
      }
    }
  } else {
    dispatch(PipelineContextActions.dbInitialized())
  }
}

const _deletePipelineCache = async (
  dispatch: React.Dispatch<ActionReturnType>,
  queryParams: GetPipelineListQueryParams,
  identifier: string
): Promise<void> => {
  if (IdbPipeline) {
    dispatch(PipelineContextActions.updating())
    const id = getId(
      queryParams.accountIdentifier,
      queryParams.orgIdentifier || '',
      queryParams.projectIdentifier || '',
      identifier
    )
    await IdbPipeline.delete(IdbPipelineStoreName, id)
  }
}

export const PipelineContext = React.createContext<PipelineContextInterface>({
  state: initialState,
  fetchPipeline: () => new Promise<void>(() => undefined),
  updatePipelineView: () => undefined,
  updatePipeline: () => new Promise<void>(() => undefined),
  pipelineSaved: () => undefined,
  deletePipelineCache: () => undefined
})

export const PipelineProvider: React.FC<{
  queryParams: GetPipelineListQueryParams
  pipelineIdentifier: string
}> = ({ queryParams, pipelineIdentifier, children }) => {
  const [state, dispatch] = React.useReducer(PipelineReducer, initialState)
  state.pipelineIdentifier = pipelineIdentifier
  const fetchPipeline = _fetchPipeline.bind(null, dispatch, queryParams, pipelineIdentifier)
  const updatePipeline = _updatePipeline.bind(null, dispatch, queryParams, pipelineIdentifier)

  const deletePipelineCache = _deletePipelineCache.bind(null, dispatch, queryParams, pipelineIdentifier)
  const pipelineSaved = React.useCallback(() => {
    deletePipelineCache()
    dispatch(PipelineContextActions.pipelineSavedAction())
  }, [deletePipelineCache])

  const updatePipelineView = React.useCallback((data: PipelineViewData) => {
    dispatch(PipelineContextActions.updatePipelineView({ pipelineView: data }))
  }, [])

  React.useEffect(() => {
    if (state.isDBInitialized) {
      fetchPipeline()
    }
  }, [state.isDBInitialized])
  React.useEffect(() => {
    const time = SessionToken.getLastTokenSetTime()
    _initializeDb(dispatch, time || +new Date())
  }, [])
  return (
    <PipelineContext.Provider
      value={{ state, fetchPipeline, updatePipeline, updatePipelineView, pipelineSaved, deletePipelineCache }}
    >
      {children}
    </PipelineContext.Provider>
  )
}
