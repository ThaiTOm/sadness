import React, { useState, useEffect } from 'react'

function HandleFile(props) {
    const [file, setFile] = useState([])

    useEffect(() => {
        if (props.props) {
            console.log(props.props)
            let file = props.props[0];
            let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    setFile(value => [...value, reader.result])
                }
            
        }
    }, [props.props])
    return (
        <div>
            {console.log(file)}
            {
                typeof file !== 'undefined' ? Object.values(file).map(function (value, index) {
                    return <div>
                        {"value"}
                    </div>
                }) : {}}
        </div>
    )
}

export default HandleFile
