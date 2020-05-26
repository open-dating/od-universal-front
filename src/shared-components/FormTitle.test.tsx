import React from 'react'
import { shallow } from 'enzyme'
import { FormTitle } from './FormTitle'

describe('FormTitle', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <FormTitle title='foo' subTitle='bar'></FormTitle>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
