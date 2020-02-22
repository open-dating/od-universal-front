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
  let msg: string = ''

  if (e && e.response && e.response.data && e.response.data.error) {
    msg = e.response.data.error
  } else if (e && e.response && e.response.data && e.response.data.message) {
    msg = e.response.data.message
  } else if (e && e.response && e.response.data) {
    msg = e.response.data.toString().substring(0, 100).replace(/<[^>]*>?/gm, '')
  } else if (e && e.message) {
    msg = e.message.toString()
  } else if (typeof e === 'string' || typeof e === 'number') {
    msg = String(e)
  } else {
    msg = JSON.stringify(e || 'Unknown error')
  }

  // debugger

  if (e && e.response && e.response.status && e.response.status === 502) {
    msg = 'Try later, service temporarily unavailable'
  }

  if (msg.indexOf('Network Error') > -1) {
    msg = 'No internet connection or server is down'
  }

  return msg
}
