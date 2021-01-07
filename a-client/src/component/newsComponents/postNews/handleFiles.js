import React, { useState, useEffect } from 'react'

function HandleFile(props) {
    const [file, setFile] = useState([])
    const handleDeleteImamge = (index) => {
        const arr = [...file]
        arr.splice(index, 1)
        setFile(arr)
    }
    useEffect(() => {
        if (props.props) {
            let file = props.props[0];
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setFile(value => [...value, reader.result])
            }

        }
    }, [props.props])
    return (
        <div className="image_post_news">
            {
                typeof file !== 'undefined' ? Object.values(file).map(function (value, index) {
                    return <li>
                        <img src={value}></img>
                        <span onClick={() => handleDeleteImamge(index)}>&#10005;</span>
                    </li>
                }) : {}}
        </div>
    )
}

export default HandleFile
