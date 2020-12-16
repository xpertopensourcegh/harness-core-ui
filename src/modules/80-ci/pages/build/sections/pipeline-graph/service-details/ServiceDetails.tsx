import React from 'react'
import moment from 'moment'
import type { ServiceDependency } from '@ci/pages/build/utils/api2ui'
import { useStrings } from 'framework/exports'
import css from '../BuildPipelineGraph.module.scss'

export interface ServiceDetailsProps {
  service: ServiceDependency | undefined
}

const ServiceDetails: React.FC<ServiceDetailsProps> = props => {
  const { getString } = useStrings()

  const { service } = props

  return (
    <table className={css.stepDetailsTable}>
      <tr>
        <td>{getString('createdAt')}</td>
        <td>{service?.startTime ? moment(service?.startTime).format('M/D/YYYY h:mm:ss a') : '-'}</td>
      </tr>
      <tr>
        <td>{getString('image')}</td>
        <td>{service?.image ? service?.image : '-'}</td>
      </tr>
    </table>
  )
}

export default ServiceDetails
