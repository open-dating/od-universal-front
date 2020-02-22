import {HOST} from '../../config/config'

function qToQParams(q: any) {
  return Object.keys(q).map(key => `${key}=${q[key]}`).join('&')
}

export const urlsAuth = {
  login: () => `${HOST}/api/v1/auth/login`,
  createUser: () => `${HOST}/api/v1/auth/create-user`,
}

export const urlsUser = {
  create: () => `${HOST}/api/v1/user/create`,
  searchNear: () => `${HOST}/api/v1/user/search-near`,
  profile: (id: number) => `${HOST}/api/v1/user/profile/${id}`,
  myProfile: () => `${HOST}/api/v1/user/my-profile`,
  myProfileSave: () => `${HOST}/api/v1/user/my-profile`,
  settingsSave: () => `${HOST}/api/v1/user/settings`,
  langSave: () => `${HOST}/api/v1/user/lang`,
  saveLocation: () => `${HOST}/api/v1/user/location`,
  saveFcm: () => `${HOST}/api/v1/user/fcm`,
  resetPass: () => `${HOST}/api/v1/auth/auto-change-pass`,
}

export const urlsComplaint = {
  create: () => `${HOST}/api/v1/complaint/create`,
}

export const urlsChoice = {
  like: (id: number) => `${HOST}/api/v1/choice/like/${id}`,
  pass: (id: number) => `${HOST}/api/v1/choice/pass/${id}`,
}

export const urlsIm = {
  sendMessage: () => `${HOST}/api/v1/im/send-message`,
  dialogs: (userId: number, skip: number) => `${HOST}/api/v1/im/dialogs/${userId}?skip=${skip}`,
  messages: (dialogId: number, olderThanId: number) => `${HOST}/api/v1/im/dialog/${dialogId}/messages?olderThanId=${olderThanId}`,
  markAsRead: (dialogId: number) => `${HOST}/api/v1/im/dialog/${dialogId}/mark-as-read`,
  blockDialog: (dialogId: number) => `${HOST}/api/v1/im/dialog/${dialogId}/block`,
}

export const urlsAdmin = {
  users: (q = {}) => `${HOST}/api/v1/admin/users?${qToQParams(q)}`,
  complaints: (q = {}) => `${HOST}/api/v1/admin/complaints?${qToQParams(q)}`,
}

export const urlsPhoto = {
  upload: () => `${HOST}/api/v1/photo/upload`,
}

export const urlsStatistic = {
  user: (relatedToUserId: number) => `${HOST}/api/v1/statistic/user/${relatedToUserId}`,
  publicCountriesBounds: () => `${HOST}/api/v1/statistic/public/countries/bounds`,
  publicDemographyByCountries: () => `${HOST}/api/v1/statistic/public/demography/by-countries`,
}

export const urlsSystem = {
  removeProfile: (id: number)=> `${HOST}/api/v1/system/user/${id}`,
}
