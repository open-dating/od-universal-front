import React from 'react'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {render} from 'react-dom'
import {act, Simulate} from 'react-dom/test-utils'
import thunkMiddleware from 'redux-thunk'

import {Signin} from './Signin'
import * as restClient from '../../services/api/restClient'

let lastHistoryValue = ''
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: (v: string) => lastHistoryValue = v,
  }),
}))

jest.mock('../../shared-components/ToolbarMain', () => ({
  ToolbarMain: () => <div/>,
}))

const mockStore = configureStore([thunkMiddleware])

it('Signin, login in app', async () => {
  const store = mockStore({})
  const container: HTMLElement = document.createElement('div')

  await act(async () => {
    render(<Provider store={store}><Signin /></Provider>, container)
  })

  await act(async () => {
    const form: any = {
      email: 'foo@bar.com',
      pass: '12345678',
    }

    for (const fName in form) {
      const el: HTMLInputElement|null = container.querySelector(`input[name=${fName}]`)
      if (!el) continue
      el.value = form[fName]
      Simulate.change(el)
    }
  })

  jest.spyOn(restClient , 'post').mockImplementation(() => {
    return Promise.resolve({
      headers: {},
      config: {},
      status: 200,
      statusText: '',
      data: {
        profile: {},
        jwt: {},
      },
    })
  })

  await act(async () => {
    const f = container.querySelector('form')
    f && Simulate.submit(f)
  })

  expect(lastHistoryValue).toBe('/users/search-near')

  // @ts-ignore
  restClient.post.mockRestore()
})
