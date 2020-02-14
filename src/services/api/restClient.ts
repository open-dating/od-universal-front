import axios, {AxiosError} from 'axios'

import {store} from '../../store'
import {removeUserData} from '../../store/actions/user'

function buildHeaders (token?: string) {
  return {
    authorization: `Bearer ${token}`,
  }
}

function handleError(e: AxiosError) {
  if (Number(e.response?.status) === 401) {
    const token = store.getState().user.jwt?.accessToken
    store.dispatch(removeUserData(token || '') as any)
  }
  return Promise.reject(e)
}

export function post(url: string, data: any, token?: string) {
  return axios.post(url, data, {
    headers: buildHeaders(token),
  }).catch(e => handleError(e))
}

export function get(url: string, token?: string, params = {}) {
  return axios.get(url, {
    ...params,
    headers: buildHeaders(token),
  }).catch(e => handleError(e))
}

export function patch (url: string, data: any, token?: string) {
  return axios.patch(url, data, {
    headers: buildHeaders(token),
  }).catch(e => handleError(e))
}
