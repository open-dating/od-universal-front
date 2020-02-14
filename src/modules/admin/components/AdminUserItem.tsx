import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import {UserProfile} from '../../../interfaces/UserProfile'

export function AdminUserItem({user, columns}: { user: UserProfile, columns: string[] }) {
  return (
    <>
      <TableRow
        hover
        key={user.id}
      >
        {columns.map((prop, i) => {
          if (prop === 'dialogs') {
            return (<TableCell key={`${user.id}_${i}`}>
              <a
                href={`/im/dialogs/${user.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >dialogs</a>
            </TableCell>)
          }
          if (prop === 'firstname') {
            return (<TableCell key={`${user.id}_${i}`}>
              <a
                href={`/user/profile/${user.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >{user.firstname}</a>
            </TableCell>)
          }
          if (prop === 'complaintsToUser') {
            return (<TableCell key={`${user.id}_${i}`}>
              {user.complaintsToUser?.length}
            </TableCell>)
          }

          return (<TableCell key={`${user.id}_${i}`}>{(user as any)[prop]}</TableCell>)
        })}
      </TableRow>
      <TableRow
        hover
        key={`${user.id}_photos`}
      >
        <TableCell
          colSpan={columns.length}
        >
          {user.photos.map(p => <a
            href={p.url}
            target="_blank"
            key={p.id}
            rel="noopener noreferrer"
          >
            <img
              height={80}
              width="auto"
              key={p.id}
              src={p.url}
              alt=""
            />
          </a>)}
        </TableCell>
      </TableRow>
    </>
  )
}
