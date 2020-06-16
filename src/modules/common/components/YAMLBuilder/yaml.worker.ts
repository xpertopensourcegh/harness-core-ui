// @ts-nocheck
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker'
import { YAMLWorker } from './yamlWorker'

self.onmessage = () => {
  worker.initialize((ctx, createData) => {
    return new YAMLWorker(ctx, createData)
  })
}
