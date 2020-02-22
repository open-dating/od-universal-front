import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import { makeStyles } from '@material-ui/core/styles'
import {useTranslation} from 'react-i18next'

import {FormItem} from '../../../shared-components/FormItem'
import {UserHabitPeriodicity} from '../../../enums/user-habit-periodicity.enum'

const useStyles = makeStyles(() => ({
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
}))

type FieldItem = {
  name: string
  translateKey: string
}

export function HabitsFormTable(props: any) {
  const {fields, prefix = ''}: { fields: FieldItem[], prefix: string } = props
  const styles = useStyles()
  const {t} = useTranslation()

  const currentValues = prefix ? props.values[prefix] : props.values
  const currentErrors = prefix && props.errors[prefix] ? props.errors[prefix] : props.errors

  const getFieldName = (name: string) => prefix ? `${prefix}.${name}` : name

  return (
    <>
      {fields.map(({name, translateKey}) => {
        return (
          <FormItem
            key={getFieldName(name)}
            className="habits-form-table-item"
          >
            <Typography
              gutterBottom
            >
              {t(translateKey)} *
            </Typography>
            <FormControl
              required
              key={getFieldName(name)}
              error={!!(currentErrors[name])}
            >
              <RadioGroup
                name={getFieldName(name)}
                onChange={props.handleChange}
                value={currentValues[name]}
                className={styles.radioGroup}
              >
                <FormControlLabel
                  value={UserHabitPeriodicity.Never}
                  control={<Radio/>}
                  label={t('unauth.habitNever')}
                />
                <FormControlLabel
                  value={UserHabitPeriodicity.One}
                  control={<Radio/>}
                  label={t('unauth.habitOne')}
                />
                <FormControlLabel
                  value={UserHabitPeriodicity.Many}
                  control={<Radio/>}
                  label={t('unauth.habitMany')}
                />
              </RadioGroup>
              <FormHelperText>{currentErrors[name]}</FormHelperText>
            </FormControl>
          </FormItem>
        )
      })}
    </>
  )
}
