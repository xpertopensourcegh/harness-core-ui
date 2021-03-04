import React from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import {
  Button,
  Color,
  FormInput,
  Formik,
  FormikForm,
  HarnessIcons,
  Icon,
  Layout,
  OverlaySpinner
} from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/components'
import { UserInviteRequestBody, useTrialSignup } from 'services/portal'
import { OAuthProviderType, OAuthProviders } from './constants/OAuthProviders'
import i18n from './SignupPage.i18n'
import SignupIllustration from './images/SignupIllustration.png'

import css from './SignupPage.module.scss'

interface SignupForm {
  name: string
  email: string
  company: string
  password: string
}

interface IconExtraProps {
  color?: Color
}

const URLS = {
  OAUTH: 'https://app.harness.io/gateway/',
  FREE_TRIAL: 'https://harness.io/thanks-freetrial-p/',
  PRIVACY_AGREEMENT: 'https://harness.io/privacy/',
  SUBSCRIPTION_TERMS: 'https://harness.io/subscriptionterms/'
}

const SignupPage: React.FC = () => {
  const { showError } = useToaster()
  const { mutate: createTrialAccount, loading: loadingTrialSignup } = useTrialSignup({})

  const HarnessLogo = HarnessIcons['harness-logo-black']

  const OAuthIcons = OAuthProviders.map((oAuthProvider: OAuthProviderType) => {
    const { color, iconName, type, url } = oAuthProvider

    const extraProps: IconExtraProps = {}

    if (color) {
      extraProps.color = color
    }

    const link = `${URLS.OAUTH}api/users/${url}`

    return (
      <a className={css.iconContainer} key={type} href={link} rel="noreferrer" target="_blank">
        <Icon name={iconName} size={24} {...extraProps} />
      </a>
    )
  })

  const handleSignup = async (data: SignupForm): Promise<void> => {
    const { name, email, company: companyName, password } = data

    const dataToSubmit: UserInviteRequestBody = {
      uuid: '',
      appId: '',
      lastUpdatedAt: 0,
      name,
      email,
      companyName,
      password: password.split('')
    }

    try {
      await createTrialAccount(dataToSubmit)

      // Redirect to free-trial page
      // This will be updated in the future
      window.location.href = URLS.FREE_TRIAL
    } catch (error) {
      showError(error.message)
    }
  }

  function handleSubmit(data: SignupForm): void {
    handleSignup(data)
  }

  const spinner = (
    <OverlaySpinner show>
      <></>
    </OverlaySpinner>
  )

  const submitButton = (
    <Button className={css.signupButton} type="submit" intent="primary">
      {i18n.submitButton}
    </Button>
  )

  return (
    <div className={css.signupPage}>
      <div className={css.cardColumn}>
        <div className={css.card}>
          <div className={css.header}>
            <HarnessLogo height={35} />
            <Link className={css.link} to={routes.toLogin()}>
              <Icon className={css.arrow} name="arrow-left" size={18} color={Color.BLUE_500} />
              {i18n.header.signInButton}
            </Link>
          </div>
          <h1 className={css.title}>{i18n.message.primary}</h1>
          <span className={css.subtitle}>{i18n.message.secondary}</span>
          <Layout.Vertical className={css.form} spacing="large">
            <Formik
              initialValues={{ name: '', email: '', company: '', password: '' }}
              onSubmit={handleSubmit}
              validationSchema={Yup.object().shape({
                name: Yup.string().trim().required(),
                email: Yup.string().trim().email().required(),
                company: Yup.string().trim().required(),
                password: Yup.string().trim().min(6).required()
              })}
            >
              <FormikForm>
                <FormInput.Text name="name" label={i18n.form.nameLabel} placeholder={i18n.form.namePlaceholder} />
                <FormInput.Text name="email" label={i18n.form.emailLabel} placeholder={i18n.form.emailPlaceholder} />
                <FormInput.Text
                  name="company"
                  label={i18n.form.companyLabel}
                  placeholder={i18n.form.companyPlaceholder}
                />
                <FormInput.Text
                  name="password"
                  label={i18n.password}
                  inputGroup={{ type: 'password' }}
                  placeholder={i18n.form.passwordPlaceholder}
                />
                {loadingTrialSignup ? spinner : submitButton}
              </FormikForm>
            </Formik>
          </Layout.Vertical>
          <h2 className={css.lineMessage}>
            <span className={css.message}>{i18n.oAuth.signup}</span>
          </h2>
          <div className={css.oAuthIcons}>{OAuthIcons}</div>
          <div className={css.disclaimer}>
            {i18n.disclaimer.initial}
            <a className={css.externalLink} href={URLS.PRIVACY_AGREEMENT} rel="noreferrer" target="_blank">
              {i18n.disclaimer.privacyPolicy}
            </a>
            {i18n.disclaimer.middle}
            <a className={css.externalLink} href={URLS.SUBSCRIPTION_TERMS} rel="noreferrer" target="_blank">
              {i18n.disclaimer.terms}
            </a>
          </div>
        </div>
      </div>
      <div className={css.imageColumn}>
        <img className={css.image} src={SignupIllustration} alt="" aria-hidden />
      </div>
    </div>
  )
}

export default SignupPage
