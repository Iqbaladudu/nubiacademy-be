import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { RelationshipFieldLabelServerComponent } from 'payload'

export const ModuleLabelWithCourseName: RelationshipFieldLabelServerComponent = (
    {clientField, path}: { clientField: any, path: any }
) => {
    console.log(clientField, path)
    return (
        <FieldLabel
            label={clientField?.label || clientField?.name}
            path={path}
            required={clientField?.required}
        />
    )
}