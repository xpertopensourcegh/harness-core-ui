import React from 'react'
import { Heading, Button, Text, Icon, IconName } from '@wings-software/uikit'
import { RightBar } from '../RightBar/RightBar'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { DrawerTypes } from '../PipelineContext/PipelineActions'
import { generateRandomString } from '../ExecutionGraph/ExecutionGraphUtil'
import i18n from './PipelineAddService.i18n'

import css from './PipelineAddService.module.scss'

const services = [
  {
    name: 'Redis',
    type: 'service',
    iconName: 'service-redis',
    iconSize: 40
  },
  {
    name: 'Mongo DB',
    type: 'service',
    iconName: 'service-mongodb',
    iconSize: 37
  }
]

export const PipelineAddService: React.FC = (): JSX.Element => {
  const {
    state: { pipelineView },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const handleItemClick = (type: string, name: string): void => {
    updatePipelineView({
      ...pipelineView,
      drawerData: {
        type: DrawerTypes.ConfigureService,
        data: {
          stepConfig: {
            node: {
              type: type,
              name: name,
              identifier: generateRandomString(name)
            },
            addOrEdit: 'add',
            isStepGroup: false
          }
        }
      }
    })
  }

  const handleCloseClick = (): void => {
    updatePipelineView({
      ...pipelineView,
      isDrawerOpened: false,
      drawerData: { type: DrawerTypes.AddService }
    })
  }

  return (
    <div className={css.wrapper}>
      <div className={css.inner}>
        <div className={css.header}>
          <Heading className={css.title} level={2}>
            {i18n.title}
          </Heading>
          <Button className={css.search} icon="main-search" minimal />
        </div>

        <Text margin={{ bottom: 'xlarge' }}>{i18n.explanationText}</Text>

        <div className={css.servicesWrapper}>
          <div className={css.service} onClick={() => handleItemClick('Custom', 'Custom')}>
            <div className={css.serviceBox}>
              <Icon className={css.customServiceIcon} name="custom-service" size={22} />
            </div>
            <Text className={css.serviceName} font={{ size: 'small', align: 'center' }}>
              {i18n.customService}
            </Text>
          </div>
          {services.map(({ name, type, iconName, iconSize }) => (
            <div className={css.service} key={name} onClick={() => handleItemClick(type, name)}>
              <div className={css.serviceBox}>
                <Icon name={iconName as IconName} size={iconSize} />
              </div>
              <Text className={css.serviceName} font={{ size: 'small', align: 'center' }}>
                {name}
              </Text>
            </div>
          ))}
        </div>
        <Button className={css.close} icon="main-close" minimal onClick={handleCloseClick} />
      </div>

      <RightBar />
    </div>
  )
}
