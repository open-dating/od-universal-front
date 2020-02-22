import axios, {AxiosError} from 'axios'

import {store} from '../../store'
import {removeUserData} from '../../store/actions/user'
import {i18n} from '../../i18n'

function buildHeaders (token?: string) {
  return {
    authorization: `Bearer ${token}`,
    'accept-language': `${i18n.language}`,
  }
}

function handleError(e: AxiosError, token?: string) {
  if (Number(e.response?.status) === 401 && token) {
    store.dispatch(removeUserData(token) as any)
  }
  return Promise.reject(e)
}

export function post(url: string, data: any, token?: string) {
  return axios.post(url, data, {
    headers: buildHeaders(token),
  }).catch(e => handleError(e, token))
}

export function get(url: string, token?: string, params = {}) {
  return axios.get(url, {
    ...params,
    headers: buildHeaders(token),
  }).catch(e => handleError(e, token))
}

export function patch (url: string, data: any, token?: string) {
  return axios.patch(url, data, {
    headers: buildHeaders(token),
  }).catch(e => handleError(e, token))
}

export function remove(url: string, token?: string) {
  return axios.delete(url, {
    headers: buildHeaders(token),
  }).catch(e => handleError(e, token))
}
