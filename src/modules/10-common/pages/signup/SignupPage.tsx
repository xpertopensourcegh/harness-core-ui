import React from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { Icon, Color, Button, FormInput, Formik, FormikForm, HarnessIcons, Layout } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import i18n from './SignupPage.i18n'
import SignupIllustration from './images/SignupIllustration.png'

import css from './SignupPage.module.scss'

interface SignupForm {
  email: string
  password: string
}

const SignupPage: React.FC = () => {
  const HarnessLogo = HarnessIcons['harness-logo-black']

  function handleSubmit(data: SignupForm): void {
    // To be implemented when a sign up endpoint is created
    // eslint-disable-next-line no-console
    console.log(data)
  }

  return (
    <div className={css.signupPage}>
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
            initialValues={{ email: '', password: '' }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              email: Yup.string().trim().email().required(),
              password: Yup.string().trim().min(6).required()
            })}
          >
            <FormikForm>
              <FormInput.Text name="email" label={i18n.form.emailLabel} placeholder={i18n.form.emailPlaceholder} />
              <FormInput.Text
                name="password"
                label={i18n.password}
                inputGroup={{ type: 'password' }}
                placeholder={i18n.form.passwordPlaceholder}
              />
              <Button className={css.signupButton} type="submit" intent="primary">
                {i18n.submitButton}
              </Button>
            </FormikForm>
          </Formik>
        </Layout.Vertical>
      </div>
      <div className={css.imageContainer}>
        <img className={css.image} src={SignupIllustration} alt="" aria-hidden />
      </div>
    </div>
  )
}

export default SignupPage
