import React from 'react'
import ReactDOM from 'react-dom'
import {useTranslation} from 'react-i18next'

import {DemographyStatDto} from '../../../interfaces/DemographyStatDto'
import {calcTotal} from '../utils/calcs'
import {UserGender} from '../../../enums/user-gender.enum'

type props = {
  feature: any
  statItems: DemographyStatDto[]
}

export function CountryStatPopup({feature, statItems}: props) {
  const {t} = useTranslation()

  return (
    <div>
      <div>
        {feature.properties.namedetails['name:en']}
        ({feature.properties.display_name})
      </div>
      <div>
        <img src={feature.properties.extratags.flag} alt="flag" height="40px" width="auto"/>
      </div>
      <div>
        {t('statistic.totals')}: <br/>
        {t('common.all')}: {calcTotal(statItems)}<br/>
        {t('common.female')}: {calcTotal(statItems, UserGender.Female)}<br/>
        {t('common.male')}: {calcTotal(statItems, UserGender.Male)}<br/>
        {t('common.otherGender')}: {calcTotal(statItems, UserGender.Other)}
      </div>
    </div>
  )
}

export function attachCountryStatPopup(wrapper: HTMLElement|undefined, {feature, statItems}: props) {
  if (!wrapper) {
    return
  }

  ReactDOM.render(
    <CountryStatPopup
      feature={feature}
      statItems={statItems}
    />,
    wrapper,
  )

  return wrapper
}

export function detachCountryStatPopup(wrapper: HTMLElement|undefined) {
  if (!wrapper) {
    return
  }

  ReactDOM.unmountComponentAtNode(wrapper)
}
