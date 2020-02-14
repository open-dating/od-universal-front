import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

const useStyles = makeStyles(theme => ({
  stepper: {
    padding: theme.spacing(1.3),
  },
}))

export function JoinSteps({activeStep}: {activeStep: number}) {
  const classes = useStyles()
  const steps = ['Take selfie', 'Add photos', 'Profile info']

  return (
    <div>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => {
          const stepProps = {}
          const labelProps = {}
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </div>
  )
}
