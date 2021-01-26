import React from 'react'

function SkeletonShare({ type }) {
    const classes = `skeleton ${type}`
    return (
        <div className={classes}>

        </div>
    )
}

export default SkeletonShare
