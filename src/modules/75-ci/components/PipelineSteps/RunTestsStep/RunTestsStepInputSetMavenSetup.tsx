import React, { FormEvent } from 'react'
import { Text, RadioButtonGroup, CodeBlock } from '@wings-software/uicore'
import { connect, FormikContext } from 'formik'
import { get, isEmpty } from 'lodash-es'
import { useStrings } from 'framework/strings'

export interface RunTestsStepInputSetMavenSetupProps {
  path?: string
  formik?: FormikContext<any>
}

export const RunTestsStepInputSetMavenSetup = ({
  path,
  formik
}: RunTestsStepInputSetMavenSetupProps): React.ReactElement => {
  const [mavenSetupQuestionAnswer, setMavenSetupQuestionAnswer] = React.useState('yes')

  const { getString } = useStrings()

  const languageValue = get(formik?.values, `${isEmpty(path) ? '' : `${path}.`}spec.language`, '')
  const buildToolValue = get(formik?.values, `${isEmpty(path) ? '' : `${path}.`}spec.buildTool`, '')

  if (languageValue === 'Java' && buildToolValue === 'Maven') return <></>

  return (
    <>
      <Text margin={{ top: 'small', bottom: 'small' }} color="grey800">
        {getString('ci.runTestsMavenSetupTitle')}
      </Text>
      <Text font={{ size: 'small' }}>{getString('ci.runTestsMavenSetupText1')}</Text>
      <RadioButtonGroup
        inline={true}
        selectedValue={mavenSetupQuestionAnswer}
        onChange={(e: FormEvent<HTMLInputElement>) => {
          setMavenSetupQuestionAnswer(e.currentTarget.value)
        }}
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' }
        ]}
        margin={{ bottom: 'small' }}
      />
      {mavenSetupQuestionAnswer === 'yes' && (
        <>
          <Text
            font={{ size: 'small' }}
            margin={{ bottom: 'xsmall' }}
            tooltipProps={{ dataTooltipId: 'runTestsMavenSetupText2' }}
          >
            {getString('ci.runTestsMavenSetupText2')}
          </Text>
          <CodeBlock
            allowCopy
            codeToCopy="${env.HARNESS_JAVA_AGENT}"
            format="pre"
            snippet={getString('ci.runTestsMavenSetupSample')}
          />
        </>
      )}
    </>
  )
}

export default connect(RunTestsStepInputSetMavenSetup)
