import React, {useEffect, useRef, useState} from 'react'
import * as L from 'leaflet'
import {useSelector} from 'react-redux'

import './DemographyByCountries.scss'
import {StateFetchAnyItem} from '../../interfaces/StateFetchAnyItem'
import {get} from '../../services/api/restClient'
import {urlsStatistic} from '../../services/api/urls'
import {FetchError} from '../../shared-components/FetchError'
import {DemographyDto} from '../../interfaces/DemographyDto'
import {SpinnerPrefetch} from '../../shared-components/SpinnerPrefetch'
import {attachCountryStatPopup, detachCountryStatPopup} from './components/CountryStatPopup'
import {StateApp} from '../../interfaces/StateApp'

export function DemographyByCountries() {
  const userData = useSelector((state: StateApp) => state.user)
  const [stat, setStat] = useState<StateFetchAnyItem<DemographyDto>>({item: null, loading: true, error: null})
  const [bounds, setBounds] = useState()
  const mapElement = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map>()

  const geometry = userData.profile?.location

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStat({item: null, loading: true, error: null})

        const [resp, respBounds] = await Promise.all([
          get(urlsStatistic.publicDemographyByCountries()),
          get(urlsStatistic.publicCountriesBounds()),
        ])

        setStat({item: resp.data, loading: false, error: null})
        setBounds(respBounds.data)
      } catch (e) {
        console.error(e)
        setStat({item: null, loading: false, error: e})
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!mapElement.current) {
      return
    }
    if (map.current) {
      return
    }

    map.current = L.map(mapElement.current)
      .setView([51.505, -0.09], 3)

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data <a target="_blank" href="http://www.openstreetmap.org">OpenStreetMap.org</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(map.current)
  }, [])

  useEffect(() => {
    if (!map.current || !bounds) {
      return
    }

    const onEachFeature = (countryCode: string, feature: any, layer: L.GeoJSON) => {
      const wrapper = document.createElement('div')
      const popupLayer = layer.bindPopup(wrapper)

      popupLayer.on('popupopen', () => {
        if (!(stat.item && stat.item[countryCode])) {
          return
        }

        attachCountryStatPopup(wrapper, {
          statItems: stat.item[countryCode].raw,
          feature,
        })
        layer.setStyle({fillColor: '#f5ff64', color: '#000'})
      })

      popupLayer.on('popupclose', () => {
        layer.setStyle({fillColor: '#3388ff', color: '#3388ff'})
      })

      layer.on('remove', () => {
        detachCountryStatPopup(wrapper)
      })
    }

    for (const countryCode in bounds) {
      L.geoJSON(bounds[countryCode], {
        onEachFeature: (f, l: L.GeoJSON) => onEachFeature(countryCode, f, l),
      }).addTo(map.current as unknown as L.Map)
    }

    if (geometry) {
      L.geoJSON(geometry, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {
            icon: L.divIcon({
              html: 'Me',
              iconSize: [18, 16],
            }),
          })
        },
      }).addTo(map.current as unknown as L.Map)
    }
  }, [stat, bounds, geometry])

  return (
    <div className="demography-by-countries">
      {stat.loading && (<SpinnerPrefetch/>)}
      {stat.error && (<FetchError error={stat.error}/>)}
      <div ref={mapElement} className="demography-by-countries__map"/>
    </div>
  )
}
