import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import {useTranslation} from 'react-i18next'

const useStyles = makeStyles(theme => ({
  stepper: {
    padding: theme.spacing(1.3),
  },
  step: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}))

export function JoinSteps({activeStep}: {activeStep: number}) {
  const classes = useStyles()
  const {t} = useTranslation()
  const steps = [t('unauth.stepSelfie'), t('unauth.stepAddPhotos'), t('unauth.stepProfileInfo')]

  return (
    <div>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => {
          return (
            <Step key={label} className={classes.step}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </div>
  )
}
