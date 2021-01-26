import React, { useState, useEffect } from 'react'
import { getCookie } from '../../../helpers/auth';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import socketApp from '../../../socket';


const LikeComment = (props) => {
    let socket = socketApp.getSocket();
    const { data, value } = props.props
    const { i } = props.props
    const [like, setLike] = useState(data.likes)
    const [isLiked, setIsLiked] = useState(data.isLiked)
    const idUser = getCookie().token
    const handleLike = () => {
        setLike(like + 1)
        setIsLiked(true)
        socket.emit("likeCmt", { value, id: idUser, idComment: data.id }, callback => {
            if (callback === "error") {
                setLike(like - 1)
                setIsLiked(false)
            } if (callback === "exists") {
                setLike(like - 1)
                setIsLiked(false)
            }
        })
    }
    return (
        <div className="list">
            {
                isLiked === true ?
                    <div>
                        <input
                            defaultChecked={true}
                            onClick={e => handleLike()}
                            type="checkbox"
                            id={"like_button_label " + i + data} />
                        <label for={"like_button_label " + i + data} >
                            <li className="like">
                                <FavoriteIcon /> {like}
                            </li>
                        </label>
                    </div> :
                    <div>
                        <input
                            defaultChecked={like}
                            onClick={e => handleLike()}
                            type="checkbox"
                            id={"like_button_label " + i + data} />
                        <label for={"like_button_label " + i + data} >
                            <li className="like">
                                <FavoriteBorderIcon /> {like}
                            </li>
                        </label>
                    </div>
            }
        </div>
    )
}

export default LikeComment
