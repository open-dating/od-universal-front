import React, {useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import * as Yup from 'yup'
import {Formik} from 'formik'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import {useTranslation} from 'react-i18next'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

import {StateApp} from '../../../interfaces/StateApp'
import './ProfileSummaryProfileEdit.scss'
import {getValidationError} from '../../../utils/errorHelpers'
import {openMessageBox} from '../../../shared-components/MessageBox'
import {FormItem} from '../../../shared-components/FormItem'
import {NotRecognizedFields} from '../../../shared-components/NotRecognizedFields'
import {patch} from '../../../services/api/restClient'
import {urlsUser} from '../../../services/api/urls'
import {saveUserData} from '../../../store/actions/user'
import {MessageBoxType} from '../../../enums/message-box-type.enum'
import {USER_HABITS_LIST} from '../../../config/constants'
import {HabitsFormTable} from '../../unauth/components/HabitsFormTable'

const schema = Yup.object().shape({
  weight: Yup.number()
    .min(20)
    .required(),
})

export function ProfileSummaryProfileEdit() {
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
    weight: Number(userData.profile?.weight),
    bio: String(userData.profile?.bio),
    habits: userData.profile?.habits,
  }

  const onSubmit = async (values: any) => {
    if (rest.loading) {
      return
    }

    try {
      setRest({loading: true, invalidFields: {}})

      const profile = userData.profile

      const res = await patch(urlsUser.myProfileSave(), {
        photosIds: profile?.photos.map(p => p.id),
        bio: values.bio,
        weight: values.weight,
        habits: values.habits,
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
    <div className="profile-summary-profile-edit">
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
              <TextField
                name="bio"
                label={t('user.bio')}
                value={props.values.bio}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                multiline
                error={!!(props.errors.bio)}
                helperText={props.errors.bio}
              />
              <FormHelperText>{props.errors.bio}</FormHelperText>
            </FormItem>

            <FormItem>
              <FormControl
                required
                error={!!(props.errors.weight)}
              >
                <Typography gutterBottom>{t('common.weight')}, {t('common.kg')}</Typography>
                <Slider
                  value={props.values.weight}
                  onChange={(_, value) => props.handleChange({
                    target: {
                      name: 'weight',
                      value,
                    },
                  })}
                  valueLabelDisplay="auto"
                  min={15}
                  max={200}
                />
                <FormHelperText>{props.errors.weight}</FormHelperText>
              </FormControl>
            </FormItem>

            <HabitsFormTable
              fields={USER_HABITS_LIST}
              prefix="habits"
              {...props}
            />

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
