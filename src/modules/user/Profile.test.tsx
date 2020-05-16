import React from 'react'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {render, act} from '@testing-library/react'

import {Profile} from './Profile'
import * as restClient from '../../services/api/restClient'
import {createUserMock} from '../../../__tests__/helpers/user'

const mockStore = configureStore()

jest.mock('react-router-dom', () => ({
  useRouteMatch: () => ({ url: '/user/profile/1' }),
}))

jest.mock('react-router', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('react-intl', () => ({
  FormattedPlural: () => <div/>,
}))

it('Profile, view profile', async () => {
  jest.spyOn(restClient , 'get').mockImplementation(() => {
    return Promise.resolve({
      headers: {},
      config: {},
      status: 200,
      statusText: '',
      data: createUserMock(3),
    })
  })

  const store = mockStore({
    user: {
      profile: {id: 1},
      jwt: {accessToken: '111'},
    },
    router: {
      history: {},
    },
  })

  let container: HTMLElement = document.createElement('div')

  await act(async () => {
    ({container} = render(<Provider store={store}><Profile /></Provider>))
  })

  expect(container.innerHTML).toContain('firstname of user 3')
  expect(container.innerHTML).toContain('http://photo-of-user-3')
})
