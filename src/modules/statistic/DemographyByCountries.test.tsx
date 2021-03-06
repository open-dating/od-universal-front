import React from 'react'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {act} from '@testing-library/react'
import {mount, ReactWrapper} from 'enzyme'
import thunkMiddleware from 'redux-thunk'

import * as restClient from '../../services/api/restClient'
import {DemographyByCountries} from './DemographyByCountries'
import {urlsStatistic} from '../../services/api/urls'

const mockStore = configureStore([thunkMiddleware])

it('Demography by countries, map rendered', async () => {
  jest.spyOn(restClient , 'get').mockImplementation((url) => {
    let data

    if (url === urlsStatistic.publicCountriesBounds()) {
      data = {
        'TW': {
          'type': 'FeatureCollection',
          'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
          'features': [],
        },
      }
    } else if (url === urlsStatistic.publicDemographyByCountries()) {
      data = {
        TW: {raw: [], countryName: 'Taiwan'},
      }
    }

    return Promise.resolve({
      headers: {},
      config: {},
      status: 200,
      statusText: '',
      data,
    })
  })

  const store = mockStore({
    user: {
      profile: null,
      jwt: null,
    },
  })

  let wrapper: ReactWrapper = mount(<Provider store={store}><DemographyByCountries /></Provider>)

  await act(async () => {
    wrapper = mount(<Provider store={store}><DemographyByCountries /></Provider>)
  })

  // @ts-ignore
  expect(wrapper).toMatchSnapshot()

})
