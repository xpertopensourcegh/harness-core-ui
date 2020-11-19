import React from 'react'
import moment from 'moment'
import type { ServiceDependency } from '@ci/pages/build/utils/api2ui'
import i18n from './ServiceDetail.i18n'
import css from '../BuildPipelineGraph.module.scss'

export interface ServiceDetailsProps {
  service: ServiceDependency | undefined
}

const ServiceDetails: React.FC<ServiceDetailsProps> = props => {
  const { service } = props

  return (
    <table className={css.stepDetailsTable}>
      <tr>
        <td>{i18n.createdAt}</td>
        <td>{service?.startTime ? moment(service?.startTime).format('M/D/YYYY h:mm:ss a') : '-'}</td>
      </tr>
      <tr>
        <td>{i18n.image}</td>
        <td>{service?.image ? service?.image : '-'}</td>
      </tr>
    </table>
  )
}

export default ServiceDetails
