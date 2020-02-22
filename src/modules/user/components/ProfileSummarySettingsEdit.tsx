import React, {useRef, useState} from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import {useDispatch, useSelector} from 'react-redux'
import * as Yup from 'yup'
import {Formik} from 'formik'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import {useTranslation} from 'react-i18next'

import {StateApp} from '../../../interfaces/StateApp'
import './ProfileSummarySettingsEdit.scss'
import {getValidationError} from '../../../utils/errorHelpers'
import {openMessageBox} from '../../../shared-components/MessageBox'
import {FormItem} from '../../../shared-components/FormItem'
import {UserGender} from '../../../enums/user-gender.enum'
import {NotRecognizedFields} from '../../../shared-components/NotRecognizedFields'
import {patch} from '../../../services/api/restClient'
import {urlsUser} from '../../../services/api/urls'
import {saveUserData} from '../../../store/actions/user'
import {MessageBoxType} from '../../../enums/message-box-type.enum'

const schema = Yup.object().shape({
  searchGender: Yup.string().required(),
})

export function ProfileSummarySettingsEdit() {
  const {t} = useTranslation()
  const userData = useSelector((state: StateApp) => state.user)
  const [rest, setRest] = useState({
    loading: false,
    invalidFields: {},
  })
  const dispatch = useDispatch()
  const formikRef = useRef<any>(null)

  const token = userData.jwt?.accessToken

  const form = {
    searchRadius: Math.round(Number(userData.profile?.setting?.searchRadius) / 1000),
    age: [
      Number(userData.profile?.setting?.minAge),
      Number(userData.profile?.setting?.maxAge),
    ],
    searchGender: userData.profile?.setting?.searchGender,
  }

  const onSubmit = async (values: any) => {
    if (rest.loading) {
      return
    }

    try {
      setRest({loading: true, invalidFields: {}})

      const profile = userData.profile || {}

      const res = await patch(urlsUser.settingsSave(), {
        searchGender: values.searchGender,
        minAge: values.age[0],
        maxAge: values.age[1],
        searchRadius: Math.round(values.searchRadius * 1000),
      }, token)

      dispatch(saveUserData({
        profile: {
          ...profile,
          ...res.data,
        },
      }))

      setRest({loading: false, invalidFields: {}})

      openMessageBox(t('common.saved'), MessageBoxType.success)
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
    <div className="profile-summary-settings-edit">
      <Formik
        innerRef={i => formikRef.current = i}
        initialValues={form}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {props => (
          <form
            onSubmit={props.handleSubmit}
            noValidate
            autoComplete="off"
          >
            <FormItem>
              <Typography gutterBottom>{t('common.age')}</Typography>
              <Slider
                value={props.values.age}
                onChange={(_, value) => props.handleChange({
                  target: {
                    name: 'age',
                    value,
                  },
                })}
                valueLabelDisplay="auto"
                min={18}
                max={70}
              />
            </FormItem>

            <FormItem>
              <Typography gutterBottom>{t('user.searchRadius')}, {t('common.km')}</Typography>
              <Slider
                value={props.values.searchRadius}
                onChange={(_, value) => props.handleChange({
                  target: {
                    name: 'searchRadius',
                    value,
                  },
                })}
                valueLabelDisplay="auto"
                min={5}
                max={200}
              />
            </FormItem>

            <FormItem>
              <FormControl
                required
                error={!!(props.errors.searchGender)}
              >
                <InputLabel htmlFor="searchGender-helper">{t('user.wantToFindGender')}</InputLabel>
                <Select
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.searchGender}
                  inputProps={{
                    name: 'searchGender',
                    id: 'searchGender-helper',
                  }}
                >
                  <MenuItem value={UserGender.Female}>{t('common.female')}</MenuItem>
                  <MenuItem value={UserGender.Male}>{t('common.male')}</MenuItem>
                  <MenuItem value={UserGender.Other}>{t('common.otherGender')}</MenuItem>
                </Select>
                <FormHelperText>{props.errors.searchGender}</FormHelperText>
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
                {rest.loading ? t('common.saveWait') : t('common.save')}
              </Button>
            </FormItem>
          </form>
        )}
      </Formik>
    </div>
  )
}
