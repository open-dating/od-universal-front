import React, {useRef, useState} from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import {CardContent} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import {useTranslation} from 'react-i18next'

import './UserCard.scss'
import {UserCardPhoto} from './UserCardPhoto'
import {UserCardDialog} from './UserCardDialog'
import {Complaint} from '../../../shared-components/Complaint'
import {UserCardDnnHeart} from './UserCardDnnHeart'
import {SwipeWrapper} from './SwipeWrapper'
import {UserCardTour} from './UserCardTour'
import {UserProfile} from '../../../interfaces/UserProfile'
import {ImDialog} from '../../../interfaces/ImDialog'
import {StateTour} from '../../../interfaces/StateTour'
import {openMessageBox} from '../../../shared-components/MessageBox'
import {metersToUnit} from '../../../utils/metersToUnit'
import {UserRole} from '../../../enums/user-role.enum'
import {FormattedPlural} from 'react-intl'

const swipeEnableOnMoveByX = 60

export function UserCard(
  {
    user,
    disableActions,
    sendMatchMessage = function () { return Promise.resolve() },
    onLike = function () {},
    likeUser = function () { return Promise.resolve() },
    onPass = function () {},
    passUser = function () { return Promise.resolve() },
    tour,
    showTour = false,
  }: {
    user: UserProfile,
    disableActions: boolean,
    sendMatchMessage?: (d: ImDialog, text: string) => Promise<any>,
    onLike?: (u: UserProfile, e?: any) => void,
    likeUser?: (u: UserProfile) => Promise<any>,
    onPass?: (u: UserProfile, e?: any) => void,
    passUser?: (u: UserProfile) => Promise<any>,
    tour?: StateTour,
    showTour?: boolean
  },
) {
  const {t} = useTranslation()
  const swipeXPosRef = useRef(0)
  let swipeXPos = swipeXPosRef.current
  const cardRef = useRef<HTMLDivElement>(null)
  const likeIndicatorRef = useRef<HTMLDivElement>(null)
  const dislikeIndicatorRef = useRef<HTMLDivElement>(null)

  const [showComplaint, setShowComplaint] = useState(false)
  const [markResult, setMarkResult] = useState('')
  const [dialog, setDialog] = useState<ImDialog|null>(null)

  const onSwipeStart = () => {
    setSwipeX(0)
  }

  const onSwipeMove = (position: any) => {
    proceedSwipeMove(position)
    return false
  }

  const onSwipeEnd = () => {
    if (markResult) {
      return
    }

    if (Math.abs(swipeXPos) >= swipeEnableOnMoveByX) {
      if (swipeXPos < 0) {
        pass()
      } else {
        like()
      }
      return
    }

    setSwipeX(0)
  }

  const proceedSwipeMove = (position: any) => {
    if (markResult) {
      return
    }

    // защита от кривого свайпа
    if (Math.abs(position.y) > 50) {
      animateResetSwipe()
      return
    }

    if (Math.abs(position.x) < swipeEnableOnMoveByX) {
      if (swipeXPos !== 0) {
        setSwipeX(0)
      }
      return
    }

    setSwipeX(position.x)
  }

  const animateResetSwipe = () => {
    if (!cardRef.current) {
      return
    }

    cardRef.current.addEventListener('transitionend', removeSwipeResetAnimation)
    cardRef.current.classList.add('reset-swipe')
    setSwipeX(0)
  }

  const removeSwipeResetAnimation = () => {
    if (!cardRef.current) {
      return
    }

    cardRef.current.classList.remove('reset-swipe')
  }

  const setSwipeX = (v: number) => {
    const xPos = Math.round(v)

    if (xPos === swipeXPos) {
      return
    }

    swipeXPos = xPos

    if (!cardRef.current) {
      return
    }

    let deg = 0
    if (xPos > 0) {
      deg = 3
    } else if (xPos < 0) {
      deg = -3
    }

    // more faster than call react render function
    cardRef.current.style.transform = `translate(${xPos}px, 0) rotate(${deg}deg)`

    if (xPos > 0) {
      setLikeIndicatorAs('like', Math.abs(xPos))
    } else if (xPos < 0) {
      setLikeIndicatorAs('dislike', Math.abs(xPos))
    } else {
      setLikeIndicatorAs('', 0)
    }
  }

  const setLikeIndicatorAs = (type: string, len: number = 1000) => {
    if (!likeIndicatorRef.current || !dislikeIndicatorRef.current) {
      return
    }

    // more faster than call react render function
    // perfomance realy a big problem on chip android devices
    if (type === 'like') {
      likeIndicatorRef.current.style.display = 'block'
      dislikeIndicatorRef.current.style.display = 'none'
    } else if (type === 'dislike') {
      likeIndicatorRef.current.style.display = 'none'
      dislikeIndicatorRef.current.style.display = 'block'
    } else {
      likeIndicatorRef.current.style.display = 'none'
      dislikeIndicatorRef.current.style.display = 'none'
    }

    // scale heart/dismiss icon
    let scale = len / 50
    if (scale > 5) {
      scale = 5
    }

    if (len === Infinity) {
      scale = 6.8
    }

    likeIndicatorRef.current.style.transform = `scale(${scale})`
    dislikeIndicatorRef.current.style.transform = `scale(${scale})`
  }

  const like = async () => {
    if (markResult) {
      return
    }

    animateResetSwipe()
    setMarkResult('like')
    setLikeIndicatorAs('like')

    try {
      await wait()
      const result = await likeUser(user)

      const dialog: ImDialog|null = result.data.dialog
      if (dialog) {
        setDialog(dialog)
        setMarkResult('match')

        setTimeout(() => {
          animateResetSwipe()
          setLikeIndicatorAs('like', Infinity)
        }, 50)
      } else {
        onLike(user)
      }
    } catch (e) {
      console.error(e)
      openMessageBox(e)
      onLike(user, e)
    }
  }

  const pass = async () => {
    if (markResult) {
      return
    }

    setMarkResult('pass')
    setLikeIndicatorAs('dislike', Infinity)

    try {
      await wait()
      await passUser(user)
      onPass(user)
    } catch (e) {
      console.error(e)
      openMessageBox(e)
      onPass(user, e)
    }
  }

  const wait = () => {
    return Promise.resolve()
    // return new Promise(resolve => setTimeout(resolve, 5000))
  }

  const closeComplaint = () => {
    setShowComplaint(false)
  }

  const openComplaint = () => {
    setShowComplaint(true)
  }

  const onComplaintSent = () => {
    closeComplaint()

    if (disableActions) {
      return
    }

    pass()
  }

  const nextPhotos = [...user.photos]
  const firstPhoto = nextPhotos.shift()
  const secondPhoto = nextPhotos.shift()

  let userMarkClassName = ''
  if (markResult === 'match') {
    userMarkClassName = 'user-profile__card--marked-as-match'
  } else if (markResult) {
    userMarkClassName = 'user-profile__card--marked'
  }

  return (
    <div className="user-card">
      <SwipeWrapper
        disableActions={disableActions}
        onSwipeStart={onSwipeStart}
        onSwipeMove={onSwipeMove}
        onSwipeEnd={onSwipeEnd}
        allowMouseEvents
      >
        <div>
          <div
            className="user-profile"
            ref={cardRef}
          >
            <Card
              className={`user-profile__card ${userMarkClassName}`}
            >
              {showTour && tour && !tour.profileTourEnded && <UserCardTour/>}
              <CardHeader
                className="user-profile__card__header"
                title={(
                  <div className="user-profile__card__header__row">
                    <div>{user.firstname}</div>
                    <div>
                      <UserCardDnnHeart
                        user={user}
                      />
                    </div>
                  </div>
                )}
              />
              {firstPhoto && (
                <CardContent>
                  <UserCardPhoto
                    key={firstPhoto.id}
                    photo={firstPhoto}
                  />
                </CardContent>
              )}
              <CardHeader
                className="user-profile__card__header user-profile__card__header--next"
                subheader={(
                  <React.Fragment>
                    <div className="user-profile__card__header__info">
                      <div>
                        {user.height} {t('common.cm')}
                      </div>
                      <div>
                        {`${metersToUnit(user.locationDistance, 'km')} ${t('common.km')}`}
                      </div>
                    </div>
                  </React.Fragment>
                )}
              />
              {secondPhoto && (
                <CardContent>
                  <UserCardPhoto
                    key={secondPhoto.id}
                    photo={secondPhoto}
                  />
                </CardContent>
              )}
              <CardHeader
                className="user-profile__card__header user-profile__card__header--next"
                subheader={(
                  <React.Fragment>
                    <div className="user-profile__card__header__info">
                      <div>
                        {user.weight} {t('common.kg')}
                      </div>
                      <div>
                        {user.age} <FormattedPlural
                          value={user.age}
                          other={t('common.year.other')}
                          zero={t('common.year.zero')}
                          one={t('common.year.one')}
                          two={t('common.year.two')}
                          few={t('common.year.few')}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )}
              />
              {nextPhotos.length > 0 && (
                <CardContent>
                  {nextPhotos.map(photo => (
                    <UserCardPhoto
                      key={photo.id}
                      photo={photo}
                    />
                  ))}
                </CardContent>
              )}
              <CardActions
                disableSpacing
                className="user-profile__card__actions"
              >
                {user.role !== UserRole.Admin && (
                  <Button
                    onClick={openComplaint}
                  >
                    {t('common.complaint')}
                  </Button>
                )}
                {user.role === UserRole.Admin && (
                  <Button>
                    {t('common.roleAdmin')}
                  </Button>
                )}
              </CardActions>
            </Card>
          </div>
          <div
            className="like-indicators"
          >
            <div className="like-indicators__content">
              <div
                className="like-indicators__content__dislike"
                ref={dislikeIndicatorRef}
              >
                <CancelIcon/>
              </div>
              <div
                className="like-indicators__content__like"
                ref={likeIndicatorRef}
              >
                <FavoriteIcon/>
              </div>
            </div>
          </div>
          {!disableActions && (
            <div
              className={`user-actions ${markResult ? 'user-actions--marked' : ''}`}
            >
              <div className="user-actions__buttons">
                <IconButton
                  className="user-actions__buttons__dislike"
                  color="primary"
                  onClick={pass}
                >
                  <CancelIcon/>
                </IconButton>
                <IconButton
                  className="user-actions__buttons__like"
                  color="secondary"
                  onClick={like}
                >
                  <FavoriteIcon/>
                </IconButton>
              </div>
            </div>
          )}
          {dialog && <UserCardDialog
            dialog={dialog}
            sendMatchMessage={sendMatchMessage}
            onDoneCb={() => onLike(user)}
          />}
          {showComplaint && <Complaint
            user={user}
            onDoneCb={onComplaintSent}
            onDismissCb={closeComplaint}
          />}
        </div>
      </SwipeWrapper>
    </div>
  )
}
