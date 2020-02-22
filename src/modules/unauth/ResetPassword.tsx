import React, {useRef, useState} from 'react'
import * as Yup from 'yup'
import Container from '@material-ui/core/Container'
import {Formik} from 'formik'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {useTranslation} from 'react-i18next'

import {openMessageBox} from '../../shared-components/MessageBox'
import {FormItem} from '../../shared-components/FormItem'
import {post} from '../../services/api/restClient'
import {urlsUser} from '../../services/api/urls'
import {getValidationError} from '../../utils/errorHelpers'
import {MessageBoxType} from '../../enums/message-box-type.enum'
import {ToolbarMain} from '../../shared-components/ToolbarMain'
import {NotRecognizedFields} from '../../shared-components/NotRecognizedFields'

const schema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
})

export function ResetPassword() {
  const [rest, setRest] = useState({
    loading: false,
    invalidFields: {},
  })
  const formikRef = useRef<any>(null)
  const {t} = useTranslation()

  const form = {
    email: '',
  }

  const onSubmit = async (values: any) => {
    if (rest.loading) {
      return
    }

    try {
      setRest({loading: true, invalidFields: {}})

      await post(urlsUser.resetPass(), {
        email: values.email,
      })

      openMessageBox(t('unauth.newPassWasSent', MessageBoxType.success))
    } catch (e) {
      const invalidFields = getValidationError(e)
      if (invalidFields) {
        setRest({loading: false, invalidFields})
        if (formikRef.current) {
          formikRef.current.setErrors(invalidFields)
        }
      } else {
        console.error(e)
        openMessageBox(e)
        setRest({loading: false, invalidFields: {}})
      }
    }
  }

  return (
    <>
      <ToolbarMain/>
      <Container>
        <Formik
          innerRef={i => formikRef.current = i}
          initialErrors={{}}
          initialValues={form}
          onSubmit={onSubmit}
          validationSchema={schema}>
          {props => (
            <form
              onSubmit={props.handleSubmit}
              noValidate
              autoComplete="off"
            >
              <FormItem>
                <TextField
                  required
                  label={t('unauth.email')}
                  name="email"
                  type="email"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.email}
                  error={!!(props.errors.email)}
                  helperText={props.errors.email}
                />
              </FormItem>

              <NotRecognizedFields
                schema={schema}
                invalidFields={rest.invalidFields}
              />

              <FormItem
                center
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={rest.loading === true}
                >
                  {rest.loading ? t('unauth.resetPassWait') : t('unauth.resetPass')}
                </Button>
              </FormItem>
            </form>
          )}
        </Formik>
      </Container>
    </>
  )
}
