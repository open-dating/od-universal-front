import React from 'react'
import { shallow } from 'enzyme'
import {FetchError} from './FetchError'

describe('FetchError', () => {
    it('toMatchSnaphoot', () => {
        const wrapper = shallow(<FetchError error='Errror message'></FetchError>)
        expect(wrapper).toMatchSnapshot()
    })
})