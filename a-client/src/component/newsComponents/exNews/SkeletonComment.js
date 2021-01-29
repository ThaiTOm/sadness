import React from 'react'
import SkeletonShape from "./SkeletonShape"

function SkeletonComment() {
    return (
        <div>
            <div className="comment_skeleton_wrapper">
                <SkeletonShape type="avatar" />
                <SkeletonShape type="text" />
                <SkeletonShape type="image" />
                <SkeletonShape type="likeShare" />
            </div>
        </div>


    )
}

export default SkeletonComment
