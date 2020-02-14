import React, {useEffect, useState} from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import {useSelector} from 'react-redux'

import './AdminList.scss'
import {FetchStateRestItems} from '../../../interfaces/FetchStateRestItems'
import {get} from '../../../services/api/restClient'
import {FetchError} from '../../../shared-components/FetchError'
import {SpinnerPrefetch} from '../../../shared-components/SpinnerPrefetch'
import {NavState} from '../../../interfaces/NavState'
import {StateApp} from '../../../interfaces/StateApp'

export function AdminList(
  {
    itemList,
    endpoint,
    columns,
  }: {
    itemList: (v: any) => any
    endpoint: (v: NavState) => string
    columns: string[]
  },
) {
  const [rest, setRest] = useState<FetchStateRestItems<any>>({
    dto: {
      data: [],
      _meta: {
        totalCount: 0,
        page: 0,
        limit: 0,
        perPage: 0,
      },
    },
    loading: true,
    error: null,
  })
  const [nav, setNav] = useState<NavState>({
    page: 1,
    limit: 50,
  })
  const userData = useSelector((state: StateApp) => state.user)

  const token = userData.jwt?.accessToken

  const navigateTo = ({page, limit}: { page?: number, limit?: number }) => {
    if (page) {
      setNav({...nav, page})
    }

    if (limit) {
      setNav({...nav, limit})
    }
  }

  useEffect(() => {
    const fetchData = async (nav: any) => {
      try {
        setRest(v => ({...v, loading: true, error: null}))

        const {data} = await get(endpoint(nav), token)

        setRest({dto: data, loading: false, error: null})
      } catch (e) {
        setRest(v => ({...v, loading: false, error: e}))
      }
    }

    fetchData(nav)
  }, [endpoint, nav, token])

  return (
    <div className="admin-list">
      {rest.error && (
        <FetchError error={rest.error}/>
      )}
      {rest.loading ? (
        <SpinnerPrefetch/>
      ) : (
        <>
          <TableContainer
            className="admin-list__table"
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column, i) => (
                    <TableCell
                      key={i}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rest.dto.data.map(item => itemList(item))}
              </TableBody>
            </Table>
          </TableContainer>
          <table className="admin-list__pagination-wrap">
            <tfoot>
            <tr>
              <TablePagination
                count={rest.dto._meta.totalCount}
                page={nav.page - 1}
                rowsPerPage={rest.dto._meta.perPage}
                onChangePage={(_, page) => navigateTo({page: page + 1})}
                onChangeRowsPerPage={(event) => navigateTo({limit: parseInt(event.target.value, 10)})}
              />
            </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  )
}
