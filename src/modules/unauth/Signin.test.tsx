import React from 'react'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {render, act, fireEvent} from '@testing-library/react'
import thunkMiddleware from 'redux-thunk'

import {Signin} from './Signin'
import * as restClient from '../../services/api/restClient'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: (v: string) => '',
  }),
}))

jest.mock('../../shared-components/ToolbarMain', () => ({
  ToolbarMain: () => <div/>,
}))

const mockStore = configureStore([thunkMiddleware])

it('Signin, login in app', async () => {
  const store = mockStore({})

  const {container} = render(<Provider store={store}><Signin /></Provider>)

  await act(async () => {
    const form: any = {
      email: 'foo@bar.com',
      pass: '12345678',
    }

    for (const fName in form) {
      const el: HTMLInputElement|null = container.querySelector(`input[name=${fName}]`)
      if (!el) continue
      el.value = form[fName]
      fireEvent.change(el)
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
    f && fireEvent.submit(f)
  })

  // @ts-ignore
  restClient.post.mockRestore()
})
