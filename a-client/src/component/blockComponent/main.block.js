import React from 'react'
import { useHistory } from "react-router-dom"
import { signOut } from '../../helpers/auth'

function Main_block() {
    
    const history = useHistory()
    const handleSubmit = () => {
        history.push("/")
        signOut()
    }
    return (
        <div className="block_page">
            <div className="paper">
                <div className="header">
                </div>
                <div className="body">
                    <p> Bạn đã bị khóa tài khoản trong vòng 30 ngày do những hành vi bạn đã phạm phải
                       <br></br>
                       Hãy xây dựng 1 cộng đồng thực sự lành mạnh xin cảm ơn
                    </p>
                </div>
                <div className="end">
                    <button onClick={handleSubmit}>Xác nhận</button>
                </div>
            </div>
        </div>
    )
}

export default Main_block
