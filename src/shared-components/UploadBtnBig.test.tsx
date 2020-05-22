import React, {ChangeEvent} from 'react'
import {shallow} from 'enzyme'
import {UploadBtnBig} from './UploadBtnBig'

jest.mock('./../utils/random', () => ({
    getRandom: () => 1,
}))

const props = { onChange: (evt: ChangeEvent<HTMLInputElement>) => {} }
let loading = false

const wrapper = shallow(<UploadBtnBig {...props} loading={loading}/>)

describe('<UploadBtnBig /> rendering', ()=> {
    it('should render 1 div', () => {
        expect(wrapper.find('div')).toHaveLength(1)
    })
})

describe('<UploadBtnBig /> interactions', () => {
    it('should render 1 button with false', () => {
        wrapper.setProps({loading: loading})
        expect(wrapper).toMatchSnapshot()
    })

    it('should render 1 button with true', () => {
        wrapper.setProps({loading: !loading})
        expect(wrapper).toMatchSnapshot()
    })
})


   