import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useSelector} from 'react-redux'

import {history} from './store'
import {SearchNear} from './modules/user/SearchNear'
import {Users} from './modules/admin/Users'
import {Signin} from './modules/unauth/Signin'
import {Welcome} from './modules/unauth/Welcome'
import {StateApp} from './interfaces/StateApp'
import {JoinSelfie} from './modules/unauth/JoinSelfie'
import {JoinPhotos} from './modules/unauth/JoinPhotos'
import {JoinFinish} from './modules/unauth/JoinFinish'
import {ToolbarMain} from './shared-components/ToolbarMain'
import {Dialogs} from './modules/im/Dialogs'
import {DialogMessages} from './modules/im/DialogMessages'
import {ProfileSummary} from './modules/user/ProfileSummary'
import {Profile} from './modules/user/Profile'
import {Complaints} from './modules/admin/Complaints'
import {DemographyByCountries} from './modules/statistic/DemographyByCountries'

history.listen(() => {
  window.scrollTo(0, 0)
})

export function Routes() {
  const userData = useSelector((state: StateApp) => state.user)
  const isUserLogged = userData && userData.jwt && userData.jwt.accessToken

  const commonRoutes = () => (
    <Route path="/statistic/*">
      <ToolbarMain/>
      <Switch>
        <Route path="/statistic/demography-by-countries" component={DemographyByCountries}/>
        <Route path="/statistic/*" component={DemographyByCountries}/>
      </Switch>
    </Route>
  )

  return (
    <>
      {isUserLogged ? (
        <Switch>
          <Route path="/user/*">
            <ToolbarMain/>
            <Switch>
              <Route path="/user/search-near" component={SearchNear}/>
              <Route path="/user/profile-summary" component={ProfileSummary}/>
              <Route path="/user/profile/:id" component={Profile}/>
              <Route path="/user/*" component={SearchNear}/>
            </Switch>
          </Route>

          <Route path="/im/*">
            <Switch>
              <Route path="/im/dialogs" component={Dialogs}/>
              <Route path="/im/dialogs/:userId" component={Dialogs}/>
              <Route path="/im/dialog/:id" component={DialogMessages}/>
              <Route path="/im/*" component={Dialogs}/>
            </Switch>
          </Route>

          <Route path="/admin/*">
            <Switch>
              <Route path="/admin/users" component={Users}/>
              <Route path="/admin/complaints" component={Complaints}/>
              <Route path="/admin/*" component={Users}/>
            </Switch>
          </Route>

          {commonRoutes()}

          <Route path="*">
            <Redirect to="/user/search-near"/>
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="/unauth/*">
            <Switch>
              <Route path="/unauth/welcome" component={Welcome}/>
              <Route path="/unauth/signin" component={Signin}/>
              <Route path="/unauth/join-selfie" component={JoinSelfie}/>
              <Route path="/unauth/join-photos" component={JoinPhotos}/>
              <Route path="/unauth/join-finish" component={JoinFinish}/>
              <Route path="/unauth/*" component={Welcome}/>
            </Switch>
          </Route>

          {commonRoutes()}

          <Route path="*">
            <Redirect to="/unauth/welcome"/>
          </Route>
        </Switch>
      )}
    </>
  )
}
