import Chip from '@material-ui/core/Chip'
import React from 'react'

import {AnyObject} from '../interfaces/AnyObject'

export function NotRecognizedFields(
  {
    schema,
    invalidFields,
  }: {
    schema: any,
    invalidFields: AnyObject
  },
) {
  const notInSchemaInvalidFields: AnyObject = {}
  const schemaFields = Object.keys(schema.fields)
  for (const fName in invalidFields) {
    if (schemaFields.indexOf(fName) === -1) {
      notInSchemaInvalidFields[fName] = invalidFields[fName]
    }
  }

  return (
    <div className="not-recognized-fields">
      {Object.keys(notInSchemaInvalidFields)
        .map(fName => {
          return <Chip
            key={fName}
            label={`${fName}: ${notInSchemaInvalidFields[fName]}`}
            color="secondary"
          />
        })
      }
    </div>
  )
}
