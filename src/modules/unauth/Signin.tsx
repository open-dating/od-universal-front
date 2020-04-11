import React, {useRef, useState} from 'react'
import * as Yup from 'yup'
import {Formik} from 'formik'
import Container from '@material-ui/core/Container'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import FormHelperText from '@material-ui/core/FormHelperText'
import {useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import Link from '@material-ui/core/Link'

import {post} from '../../services/api/restClient'
import {urlsAuth} from '../../services/api/urls'
import {AuthDto} from '../../interfaces/AuthDto'
import {saveUserData} from '../../store/actions/user'
import {openMessageBox} from '../../shared-components/MessageBox'
import {FormItem} from '../../shared-components/FormItem'
import {ToolbarMain} from '../../shared-components/ToolbarMain'
import {NotRecognizedFields} from '../../shared-components/NotRecognizedFields'
import {getValidationError} from '../../utils/errorHelpers'

const schema = Yup.object().shape({
  pass: Yup.string()
    .min(6)
    .required(),
  email: Yup.string()
    .email()
    .required(),
})

export function Signin() {
  const history = useHistory()
  const [rest, setRest] = useState({
    loading: false,
    invalidFields: {},
  })
  const formikRef = useRef<any>(null)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const form = {
    email: '',
    pass: '',
    showPassword: false,
  }

  const onSubmit = async (values: any) => {
    if (rest.loading) {
      return
    }

    try {
      setRest({loading: true, invalidFields: {}})

      const {data}: { data: AuthDto } = await post(urlsAuth.login(), values)

      dispatch(saveUserData(data))
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

  const goToResetPass = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()

    history.push('/unauth/reset-password')
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
              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.pass)}
                >
                  <InputLabel htmlFor="adornment-password">{t('unauth.password')}</InputLabel>
                  <Input
                    name="pass"
                    id="adornment-password"
                    type={props.values.showPassword ? 'text.ts' : 'password'}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.pass}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => props.handleChange({
                            target: {
                              name: 'showPassword',
                              value: !props.values.showPassword,
                            },
                          })}
                          onMouseDown={e => e.preventDefault()}
                        >
                          {props.values.showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{props.errors.pass}</FormHelperText>
                </FormControl>
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
                  {rest.loading ? t('unauth.signInWait') : t('unauth.signIn')}
                </Button>
              </FormItem>
            </form>
          )}
        </Formik>

        <div>
          <Link
            href="/unauth/reset-password"
            onClick={goToResetPass}
          >
            {t('unauth.forgetYourPass')}
          </Link>
        </div>
      </Container>
    </>
  )
}
