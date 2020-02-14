import {AxiosError} from 'axios'
import {FormikErrors, FormikValues} from 'formik'

export function getValidationError(e: AxiosError): FormikErrors<FormikValues> | null {
  if (e.response && +e.response.status === 400) {
    const formikErrors: FormikErrors<FormikValues> = {}
    for (const err of e.response.data.message) {
      const {property, constraints} = err
      formikErrors[property] = Object.values(constraints).join('. ')
    }
    return formikErrors
  }
  return null
}

export function recognizeError(e: any): string {
  let msg = ''

  if (e.response && e.response.data && e.response.data.error) {
    msg = e.response.data.error
  } else if (e.response && e.response.data && e.response.data.message) {
    msg = e.response.data.message
  } else if (e.response && e.response.data) {
    msg = e.response.data.toString().substring(0, 100).replace(/<[^>]*>?/gm, '')
  } else if (e.message) {
    msg = e.message.toString()
  } else {
    msg = JSON.stringify(e || 'Unknown error')
  }

  // debugger

  if (e.response && e.response.status && e.response.status === 502) {
    msg = 'Try later, service temprary unvalable'
  }

  if (msg.indexOf('Network Error') > -1) {
    msg = 'No internet'
  }

  return msg || 'Unknown error'
}
