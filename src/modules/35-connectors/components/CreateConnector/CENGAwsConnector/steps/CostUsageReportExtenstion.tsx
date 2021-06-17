import React from 'react'
import { Container } from '@wings-software/uicore'
import css from '../CreateCeAwsConnector.module.scss'

const CostUsageReportExtention: React.FC = () => {
  return (
    <Container className={css.extention}>
      <span>
        <h2>How to Create Cost and Usage Report?</h2>
        <div className={css.listPoints}>
          <p>Once the template is launched in the AWS console:</p>
          <ol type="A">
            <li>
              <h3 style={{ fontWeight: 700 }}>Creating a Report</h3>
              <ol>
                <li>
                  Click <span className={css.gray}>Create Report</span> and provide a Cost and Usage Report Name. Copy
                  this and paste it in the space provided on the left.
                </li>
                <li>Check Include resource IDs and keep other selections as is.</li>
                <li>Click Next.</li>
              </ol>
            </li>
            <li>
              {' '}
              <h3 style={{ fontWeight: 700 }}>Delivery options</h3>
              <ol>
                <li>
                  Click <span className={css.gray}>Configure</span> to create an S3 bucket.
                </li>
                <li>Provide an S3 bucket name and select Region (preferably US East - N.Virginia).</li>
                <li>
                  {' '}
                  Click <span className={css.gray}>Next</span>, then click <span className={css.gray}>Save</span>.
                </li>
                <li> Enter a Report path prefix.</li>
                <li>
                  Configure the report with the following configuration:
                  <ul>
                    <li>
                      Time granularity: <span className={css.gray}>Hourly</span>
                    </li>
                    <li>
                      Report versioning: <span className={css.gray}>Overwrite Existing Report Version</span>
                    </li>
                    <li>You do not need to enable any report data integrations.</li>
                    <li>
                      Compression: <span className={css.gray}>GZIP</span>
                    </li>
                  </ul>
                </li>
                <li>
                  Click <span className={css.gray}>Next</span>, then click{' '}
                  <span className={css.gray}>Review and Complete</span> .
                </li>
                <li>Copy and enter the CUR Report name and S3 bucket name.</li>
              </ol>
            </li>
          </ol>
          <span>
            More help:
            <ul>
              <li>
                <a>Watch help video</a>
              </li>
              <li>
                <a>Harness Documentation</a>
              </li>
              <li>
                <a>Creating Cost and Usage Reports</a>
              </li>
              <li>
                <a>Billing and Cost Management Policy Examples</a>
              </li>
            </ul>
          </span>
        </div>
      </span>
    </Container>
  )
}

export default CostUsageReportExtention
