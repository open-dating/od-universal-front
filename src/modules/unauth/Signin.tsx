import React, {useState} from 'react'
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

import {post} from '../../services/api/restClient'
import {urlsAuth} from '../../services/api/urls'
import {AuthDto} from '../../interfaces/AuthDto'
import {saveUserData} from '../../store/actions/user'
import {openMessageBox} from '../../shared-components/MessageBox'
import {FormItem} from '../../shared-components/FormItem'

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
  const dispatch = useDispatch()

  const form = {
    email: 'foo@bar.com',
    pass: 'foobar',
    showPassword: false,
  }

  const onSubmit = async (values: any) => {
    if (rest.loading) {
      return
    }

    try {
      setRest({loading: true, invalidFields: {}})

      const {data}: {data: AuthDto} = await post(urlsAuth.login(), values)

      dispatch(saveUserData(data))

      history.push('/users/search-near')
    } catch (e) {
      console.error(e)
      openMessageBox(e)
      setRest({loading: false, invalidFields: {}})
    }
  }

  return (
    <Container>
      <Formik
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
                label="Email"
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
                <InputLabel htmlFor="adornment-password">Password</InputLabel>
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

            <FormItem
              center
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={rest.loading === true}
              >
                {rest.loading ? 'Sign in...' : 'Sign in'}
              </Button>
            </FormItem>
          </form>
        )}
      </Formik>
    </Container>
  )
}
