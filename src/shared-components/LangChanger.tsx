import React, {useEffect, useState} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'

import {StateApp} from '../interfaces/StateApp'
import {patch} from '../services/api/restClient'
import {urlsUser} from '../services/api/urls'
import {saveUserData} from '../store/actions/user'
import {openMessageBox} from './MessageBox'

export function LangChanger() {
  const {i18n} = useTranslation()
  const [mainLng] = String(i18n.language).split('-') // 'ru-RU'
  const [lang, setLang] = useState(mainLng)
  const userData = useSelector((state: StateApp) => state.user)
  const dispatch = useDispatch()

  const token = userData.jwt?.accessToken

  const changeLang = async (evt: any) => {
    try {
      const language = evt.target.value

      await i18n.changeLanguage(language)
      setLang(language)

      if (token && userData.profile) {
        await patch(urlsUser.langSave(), {
          language,
        }, token)

        dispatch(saveUserData({
          profile: {
            ...userData.profile,
            language,
          },
        }))
      }
    } catch (e) {
      console.error(e)
      openMessageBox(e)
    }
  }

  useEffect(() => {
    if (userData.profile?.language && userData.profile?.language !== lang) {
      setLang(userData.profile?.language)
    }
  }, [userData, lang])

  return (
    <Select
      onChange={changeLang}
      value={lang}
      inputProps={{
        name: 'lang',
        id: 'lang-helper',
      }}
    >
      <MenuItem value='en'>English</MenuItem>
      <MenuItem value='ru'>Русский</MenuItem>
    </Select>
  )
}
