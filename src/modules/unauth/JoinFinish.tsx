import React, {useRef, useState} from 'react'
import * as Yup from 'yup'
import {Formik} from 'formik'
import Container from '@material-ui/core/Container'
import DateFnsUtils from '@date-io/date-fns'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import FormHelperText from '@material-ui/core/FormHelperText'
import {useDispatch, useSelector} from 'react-redux'
import {Grid, makeStyles} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import {useDebouncedCallback} from 'use-debounce'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {useTranslation} from 'react-i18next'

import {FormItem} from '../../shared-components/FormItem'
import {post} from '../../services/api/restClient'
import {urlsAuth} from '../../services/api/urls'
import {StateApp} from '../../interfaces/StateApp'
import {JoinSteps} from './components/JoinSteps'
import {UserUseType} from '../../enums/user-use-type.enum'
import {UserGender} from '../../enums/user-gender.enum'
import {NotRecognizedFields} from '../../shared-components/NotRecognizedFields'
import {getValidationError} from '../../utils/errorHelpers'
import {saveUserData} from '../../store/actions/user'
import {saveJoinData} from '../../store/actions/join'
import {getGeoLocation} from '../../services/geoLocation'
import {openMessageBox} from '../../shared-components/MessageBox'
import {promptConfirmBox} from '../../shared-components/ConfirmBox'
import {HabitsFormTable} from './components/HabitsFormTable'
import {USER_HABITS_LIST} from '../../config/constants'
import {UserHabitPeriodicity} from '../../enums/user-habit-periodicity.enum'
import {FormTitle} from '../../shared-components/FormTitle'

const useStyles = makeStyles(theme => ({
  typography: {
    color: theme.palette.text.secondary,
  },
  sliderInput: {
    width: 50,
    marginTop: -10,
    '& input': {
      textAlign: 'center',
    },
  },
}))

const initialBday = new DateFnsUtils().setSeconds(new Date(), (24 * 3600 * 365 * 30) * -1)

const schema = Yup.object().shape({
  pass: Yup.string()
    .min(6)
    .required(),
  firstname: Yup.string()
    .min(2)
    .required(),
  email: Yup.string()
    .email()
    .required(),
  bday: Yup.date()
    .max(
      new DateFnsUtils().setSeconds(new Date(), (24 * 3600 * 365 * 18) * -1),
      'Minimal age is 18',
    )
    .required(),
  height: Yup.number()
    .min(30)
    .required(),
  weight: Yup.number()
    .min(20)
    .required(),
  gender: Yup.string().required(),
  useType: Yup.string().required(),
  tolerantPromise: Yup.boolean().oneOf([true], 'You need to accept promise'),
  honestyAndGoodnessPromise: Yup.boolean().oneOf([true], 'You need to accept promise'),
  tos: Yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
})

export function JoinFinish() {
  const classes = useStyles()
  const joinForm = useSelector((state: StateApp) => state.join)
  const dispatch = useDispatch()
  const formikRef = useRef<any>(null)
  const {t, i18n} = useTranslation()

  const form = {
    firstname: '',
    email: '',
    pass: '',
    bday: '',
    weight: 0,
    height: 0,
    useType: '',
    gender: '',
    showPassword: false,
    habits: Object.fromEntries(USER_HABITS_LIST.map(v => [v.name, UserHabitPeriodicity.Never])),
    acceptedUseDataInScience: false,
    bio: '',
    tolerantPromise: false,
    honestyAndGoodnessPromise: false,
    tos: false,
  }

  const [rest, setRest] = useState({
    loading: false,
    invalidFields: {},
  })

  const [setSliderValueWithDebounce] = useDebouncedCallback(
    (props: any, form: any) => {
      props.handleChange(form)
    },
    0,
  )

  const onSubmit = async (values: any) => {
    if (rest.loading) {
      return
    }

    try {
      setRest({loading: true, invalidFields: {}})

      await promptConfirmBox(
        t('unauth.locationInfoProm'),
        {hideCancel: true},
      )

      const coordinates = [0, 0]
      try {
        const location = await getGeoLocation()
        coordinates[0] = location.coords.longitude
        coordinates[1] = location.coords.latitude
      } catch (e) {
        console.error(e)
      }

      const form = {
        ...values,
        selfieId: joinForm.selfie?.id,
        photosIds: joinForm.photos.map(p => p.id),
        location: {
          type: 'Point',
          coordinates,
        },
        language: i18n.language,
      }

      dispatch(saveJoinData({...joinForm, form}))

      const {data} = await post(urlsAuth.createUser(), form)

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

  return (
    <Container>
      <JoinSteps activeStep={3}/>
      <Container>
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
              <FormTitle
                title={t('unauth.formTitleMainInfo')}
                subTitle={t('unauth.formTitleMainInfoSub')}
              />
              <FormItem>
                <TextField
                  required
                  label={t('common.firstname')}
                  name="firstname"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.firstname}
                  error={!!(props.errors.firstname)}
                  helperText={props.errors.firstname}
                />
              </FormItem>
              <FormItem>
                <MuiPickersUtilsProvider
                  utils={DateFnsUtils}
                >
                  <DatePicker
                    name="bday"
                    label={t('common.birthday')}
                    format="dd.MM.yyyy"
                    value={props.values.bday}
                    required
                    error={!!(props.errors.bday)}
                    helperText={props.errors.bday}
                    onChange={(dt) => dt && props.handleChange({
                      target: {
                        name: 'bday',
                        value: dt,
                      },
                    })}
                    initialFocusedDate={initialBday}
                  />
                </MuiPickersUtilsProvider>
              </FormItem>

              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.gender)}
                >
                  <InputLabel htmlFor="gender-helper">{t('common.gender')}</InputLabel>
                  <Select
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.gender}
                    inputProps={{
                      name: 'gender',
                      id: 'gender-helper',
                    }}
                  >
                    <MenuItem value={UserGender.Female}>{t('common.female')}</MenuItem>
                    <MenuItem value={UserGender.Male}>{t('common.male')}</MenuItem>
                    <MenuItem value={UserGender.Other}>{t('common.otherGender')}</MenuItem>
                  </Select>
                  <FormHelperText>{props.errors.gender}</FormHelperText>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.useType)}
                >
                  <InputLabel htmlFor="useType-helper">{t('common.useType')}</InputLabel>
                  <Select
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.useType}
                    inputProps={{
                      name: 'useType',
                      id: 'useType-helper',
                    }}
                  >
                    <MenuItem value={UserUseType.Rel}>{t('common.useTypeRel')}</MenuItem>
                    <MenuItem value={UserUseType.Other}>{t('common.useTypeOther')}</MenuItem>
                  </Select>
                  <FormHelperText>{props.errors.useType}</FormHelperText>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.height)}
                >
                  <Typography
                    className={classes.typography}
                  >
                    {t('common.height')}, {t('common.cm')} *
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <Slider
                        value={props.values.height}
                        onChange={(_, value) => setSliderValueWithDebounce(props, {
                          target: {
                            name: 'height',
                            value,
                          },
                        })}
                        valueLabelDisplay="auto"
                        min={45}
                        max={250}
                      />
                    </Grid>
                    <Grid item>
                      <Input
                        className={classes.sliderInput}
                        disabled
                        value={props.values.height}
                        margin="dense"
                        inputProps={{
                          min: 45,
                          max: 250,
                        }}
                        name="height"
                        onChange={props.handleChange}
                      />
                    </Grid>
                  </Grid>
                  <FormHelperText>{props.errors.height}</FormHelperText>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.weight)}
                >
                  <Typography
                    gutterBottom
                    className={classes.typography}
                  >
                    {t('common.weight')}, {t('common.kg')} *
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <Slider
                        value={props.values.weight}
                        onChange={(_, value) => setSliderValueWithDebounce(props, {
                          target: {
                            name: 'weight',
                            value,
                          },
                        })}
                        valueLabelDisplay="auto"
                        min={15}
                        max={200}
                      />
                    </Grid>
                    <Grid item>
                      <Input
                        className={classes.sliderInput}
                        disabled
                        value={props.values.weight}
                        margin="dense"
                        inputProps={{
                          min: 15,
                          max: 200,
                        }}
                        name="weight"
                        onChange={props.handleChange}
                      />
                    </Grid>
                  </Grid>
                  <FormHelperText>{props.errors.weight}</FormHelperText>
                </FormControl>
              </FormItem>

              <FormTitle
                title={t('unauth.formTitleHabits')}
                subTitle={t('unauth.formTitleHabitsSub')}
              />
              <HabitsFormTable
                fields={USER_HABITS_LIST}
                prefix="habits"
                {...props}
              />

              <FormTitle
                title={t('unauth.formTitleLoginInfo')}
                subTitle={t('unauth.formTitleLoginInfoSub')}
              />
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

              <FormTitle
                title={t('unauth.formTitleAgreementsAndAssistance')}
                subTitle=""
              />
              <FormItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptedUseDataInScience"
                      checked={props.values.acceptedUseDataInScience}
                      onChange={props.handleChange}
                    />
                  }
                  label={t('unauth.acceptOptionalDataScience')}
                />
              </FormItem>
              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.tolerantPromise)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="tolerantPromise"
                        checked={props.values.tolerantPromise}
                        onChange={props.handleChange}
                      />
                    }
                    label={t('unauth.tolerantPromise')}
                  />
                  {props.errors.tolerantPromise && <FormHelperText>{props.errors.tolerantPromise}</FormHelperText>}
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.honestyAndGoodnessPromise)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="honestyAndGoodnessPromise"
                        checked={props.values.honestyAndGoodnessPromise}
                        onChange={props.handleChange}
                      />
                    }
                    label={t('unauth.honestyAndGoodnessPromise')}
                  />
                  {props.errors.honestyAndGoodnessPromise && <FormHelperText>{props.errors.honestyAndGoodnessPromise}</FormHelperText>}
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl
                  required
                  error={!!(props.errors.tos)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="tos"
                        checked={props.values.tos}
                        onChange={props.handleChange}
                      />
                    }
                    label={t('unauth.tos')}
                  />
                  {props.errors.tos && <FormHelperText>{props.errors.tos}</FormHelperText>}
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
                  {rest.loading ? t('unauth.signUpWait') : t('unauth.signUp')}
                </Button>
              </FormItem>
            </form>
          )}
        </Formik>
      </Container>
    </Container>
  )
}
