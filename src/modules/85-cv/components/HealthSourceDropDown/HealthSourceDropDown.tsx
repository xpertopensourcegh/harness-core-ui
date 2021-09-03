import React, { useMemo } from 'react'
import { Select, SelectOption } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetDataSourcetypes } from 'services/cv'
import type { HealthSourceDropDownProps } from './HealthSourceDropDown.types'
import { dataSourceTypeToLabel } from './HealthSourceDropDown.utils'
import css from './HealthSourceDropDown.module.scss'

export function HealthSourceDropDown(props: HealthSourceDropDownProps): JSX.Element {
  const { onChange, serviceIdentifier, environmentIdentifier, className, verificationType = 'TIME_SERIES' } = props
  const { getString } = useStrings()
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { data, error, loading } = useGetDataSourcetypes({
    queryParams: { accountId, projectIdentifier, orgIdentifier, serviceIdentifier, environmentIdentifier }
  })

  const healthSources: SelectOption[] = useMemo(() => {
    if (loading) {
      return [{ value: '', label: getString('loading') }]
    }
    if (error) {
      return []
    }

    const options = []
    for (const source of data?.resource || []) {
      if (source.dataSourceType && source.verificationType === verificationType) {
        options.push({
          label: dataSourceTypeToLabel(source.dataSourceType, getString),
          value: source.dataSourceType as string
        })
      }
    }

    if (options.length > 1) {
      options.unshift({ label: getString('all'), value: 'all' })
    }

    return options
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.resource, error, loading])

  return (
    <Select
      items={healthSources}
      className={classNames(css.maxDropDownWidth, className)}
      defaultSelectedItem={healthSources?.[0]}
      key={healthSources?.[0]?.value as string}
      inputProps={{ placeholder: getString('pipeline.verification.healthSourcePlaceholder') }}
      onChange={item => {
        onChange(item?.value === 'all' ? '' : (item.value as string))
      }}
    />
  )
}
