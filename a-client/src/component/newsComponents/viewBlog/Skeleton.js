import React from 'react'
import SkeletonShape from "./SkeletonShape"

function Skeleton() {

    return (
        <div className="blog_skeleton_wrapper">
            <SkeletonShape type="avatar" />
            <SkeletonShape type="text" />
            <SkeletonShape type="image" />
            <SkeletonShape type="likeShare" />
        </div>
    )
}

export default Skeleton
