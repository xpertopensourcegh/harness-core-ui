import { Container } from '@wings-software/uicore'
import React from 'react'
import css from '../CreateCeAwsConnector.module.scss'

const CrossAccountRoleExtension = () => {
  return (
    <Container className={css.extention}>
      <span>
        <h2>Create cross-account IAM role using AWS CloudFormation template</h2>
        <div className={css.listPoints}>
          <p>Login to your master account to launch template and create stack. </p>
          <ol>
            <li>
              You can <a>Preview Template</a> to understand all the permissions involved
            </li>
            <li>
              Review and Lauch Harness specified AWS CloudFormation template on AWS console
              <ul>
                <li>Click on the checkbox to acknowledge the IAM role creation.</li>
                <li>
                  Click on <span className={css.gray}>Create stack</span>
                </li>
              </ul>
            </li>
            <li>
              On stack details page click on <span className={css.gray}>Outputs</span> tab and copy{' '}
              <span className={css.gray}>IAM ARN</span>.
            </li>
            <li>Provide that IAM ARN in Harness UI.</li>
            <li>External ID is a random unique value to provide additional secure authentication.</li>
          </ol>
          <span>
            More help:
            <ul>
              <li>
                <a>Harness Documentation</a>
              </li>
            </ul>
          </span>
        </div>
      </span>
    </Container>
  )
}

export default CrossAccountRoleExtension
