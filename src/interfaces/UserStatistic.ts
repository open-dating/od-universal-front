import {StatItem} from './StatItem'

export interface UserStatistic {
  likes: StatItem[]

  passes: StatItem[]

  matches: StatItem[]

  likesFromOtherUsers: StatItem[]

  passesFromOtherUsers: StatItem[]
}
