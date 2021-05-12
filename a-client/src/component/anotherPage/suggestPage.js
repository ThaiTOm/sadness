import React, { useState, useEffect } from 'react'
import axios from "axios"
import "../../assets/style/suggest.css"

function SuggestPage() {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get("http://localhost:2704/api/suggest")
            .then(res => {
                setData(res.data.data)
            }).catch(err => {
                console.log(err)
            })
    }, [])
    return (
        <div className="suggest_user">
            <section>
                {data.map(function (value) {
                    return <div >
                        <p>{value._id}</p>
                        {
                            value.text && <p style={{ marginBottom: "20px" }}>{value.text}</p>
                        }
                        {
                            value.file && <>
                                {value.file.map(function (img) {
                                    return <img alt="suggest_img" src={img}></img>
                                })}
                            </>
                        }

                    </div>
                })}
            </section>

        </div>
    )
}

export default SuggestPage
