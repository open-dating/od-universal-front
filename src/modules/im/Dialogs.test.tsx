import React from 'react'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {render} from '@testing-library/react'
import thunkMiddleware from 'redux-thunk'

import {Dialogs} from './Dialogs'
import {ImDialog} from '../../interfaces/ImDialog'
import {createUserMock} from '../../../__tests__/helpers/user'
import * as restClient from '../../services/api/restClient'

const mockStore = configureStore([thunkMiddleware])

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({ url: '/im/dialogs/1' }),
}))

jest.mock('react-router', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('../../shared-components/ToolbarMain', () => ({
  ToolbarMain: () => <div/>,
}))

it('Dialogs, show list', async () => {
  const dialogItem: ImDialog = {
    id: 1,
    users: [
      createUserMock(3),
      createUserMock(1),
    ],
    lastMessage: {
      id: 2,
      dialog: {
        id: 1,
        users: [
          createUserMock(3),
          createUserMock(1),
        ],
        lastMessage: null,
        lastActivityAt: new Date(),
        isBlocked: false,
      },
      fromUser: createUserMock(3),
      text: 'Loreim ipsuim dolor',
      photo: null,
    },
    lastActivityAt: new Date(),
    isBlocked: false,
  }

  jest.spyOn(restClient , 'get').mockImplementation(() => {
    return Promise.resolve({
      headers: {},
      config: {},
      status: 200,
      statusText: '',
      data: {},
    })
  })

  const store = mockStore({
    user: {
      profile: {id: 1},
      jwt: {accessToken: '111'},
    },
    dialogs: {
      loading: false,
      error: null,
      dto: {
        data: [dialogItem],
        _meta: {
          skip: 0,
          limit: 0,
          nextSkip: 0,
        },
      },
    },
    router: {
      history: {},
    },
  })

  const { container } = render(<Provider store={store}><Dialogs /></Provider>)

  expect(container.innerHTML).toContain('firstname of user 3')
  // expect(container.innerHTML).toContain('http://photo-of-user-3')
  expect(container.innerHTML).toContain('Loreim ipsuim dolor')

})
