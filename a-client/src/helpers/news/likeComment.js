import React, { useState } from 'react'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RequireLogin from './requireLogin';

const LikeComment = (props) => {
    const { socket, data, value, idUser } = props.props
    const { i } = props.props
    const [like, setLike] = useState(data.likes)
    const [isLiked, setIsLiked] = useState(data.isLiked)
    const [login, setLogin] = useState(null)

    const handleLike = () => {
        if (!idUser) {
            setLogin(true)
        } else {
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
    }
    return (
        <div className="list">
            {login ? <RequireLogin onClick={(value) => setLogin(value)} /> : console.log()}
            {
                isLiked === true ?
                    <div>
                        <input
                            defaultChecked={true}
                            onClick={e => handleLike()}
                            type="checkbox"
                            id={"like_button_label " + i + data} />
                        <label htmlFor={"like_button_label " + i + data} >
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
                        <label htmlFor={"like_button_label " + i + data} >
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
