import {TOUR_DATA_SAVE} from '../actionTypes'
import {StateTour} from '../../interfaces/StateTour'

const initialTour: StateTour = localStorage.getItem(TOUR_DATA_SAVE) ? JSON.parse(localStorage.getItem(TOUR_DATA_SAVE) as any) : {
  profileTourEnded: false,
}

export const tour = (state = initialTour, {type, profileTourEnded}: {type: string, profileTourEnded: Boolean}): StateTour => {
  if (type === TOUR_DATA_SAVE) {
    const updSate = {
      profileTourEnded: Boolean(profileTourEnded),
    }

    localStorage.setItem(TOUR_DATA_SAVE, JSON.stringify(updSate))

    return updSate
  }

  return state
}
