import React from 'react'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {render, act} from '@testing-library/react'
import thunkMiddleware from 'redux-thunk'

import * as restClient from '../../services/api/restClient'
import {Complaints} from './Complaints'
import {Complaint} from '../../interfaces/Complaint'
import {createUserMock} from '../../../__tests__/helpers/user'

const mockStore = configureStore([thunkMiddleware])

jest.mock('./components/ToolbarAdmin', () => ({
  ToolbarAdmin: () => <div/>,
}))

class ComplaintItem implements Complaint {
  createdAt = new Date().toString()
  dialogId = '1'
  fromUser = createUserMock(1)
  id = 1
  location = ''
  status  = ''
  text  = ''
  toUser = createUserMock(3)
}

const createComplaintItem  = (id: number): Complaint => {
  const c = new ComplaintItem()
  c.text = `complaint text id ${id}`
  c.id = id
  return c
}

it('Complaints list', async () => {
  jest.spyOn(restClient , 'get').mockImplementation(() => {
    return Promise.resolve({
      headers: {},
      config: {},
      status: 200,
      statusText: '',
      data: {
        data: [
          createComplaintItem(1),
          createComplaintItem(2),
        ],
        _meta: {
          totalCount: 2,
          page: 1,
          limit: 2,
          perPage: 50,
        },
      },
    })
  })

  const store = mockStore({
    user: {
      profile: {id: 1},
      jwt: {accessToken: '111'},
    },
  })

  let container: HTMLElement = document.createElement('div')

  await act(async () => {
    ({container} = render(<Provider store={store}><Complaints /></Provider>))
  })

  expect(container.innerHTML).toContain('complaint text id 1')
  expect(container.innerHTML).toContain('complaint text id 2')
})
