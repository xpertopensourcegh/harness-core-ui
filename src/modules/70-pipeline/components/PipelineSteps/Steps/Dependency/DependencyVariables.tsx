import React from 'react'
import type { VariableMergeServiceResponse } from 'services/pipeline-ng'
import { VariablesListTable } from '@pipeline/components/VariablesListTable/VariablesListTable'
import type { DependencyData } from './Dependency'
import { flatObject } from '../StepsFlatObject'

export interface DependencyVariablesProps {
  initialValues: DependencyData
  stageIdentifier: string
  onUpdate?(data: DependencyData): void
  metadataMap: Required<VariableMergeServiceResponse>['metadataMap']
  variablesData: DependencyData
}

export const DependencyVariables: React.FC<DependencyVariablesProps> = ({
  variablesData,
  metadataMap,
  initialValues
}) => <VariablesListTable data={flatObject(variablesData)} originalData={initialValues} metadataMap={metadataMap} />
