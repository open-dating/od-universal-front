import React from 'react'
import {shallow} from 'enzyme'
import {SmallTip} from './SmallTip'

describe('SmallTip', () => {
  it('toMatchSnapshot', () => {
    const wrapper = shallow(<SmallTip>
      <div>Some tip text</div>
    </SmallTip>)

    expect(wrapper).toMatchSnapshot()
  })
})
