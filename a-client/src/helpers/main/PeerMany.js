const { createEmptyAudioTrack, createNullStream } = require("../message/audio")

// turn on or turn off own volumn

export const setVolumnOwn = async ({ audio, volumn }) => {
    let arr = []
    for await (let data of audio) {
        // copy old object
        let value = Object.assign({}, data.stream.props, { seleted: false, writeable: true })
        let old = Object.assign({}, data.stream, { writeable: true, seleted: false })
        value.muted = !volumn
        // delete specific key
        delete value["seleted"]
        delete value["writeable"]
        old.props = value
        delete old["seleted"]
        delete old["writeable"]
        // create new object
        // to handle new data
        let obj = {
            stream: old,
            audio: data.audio,
            mic: false
        }
        arr.push(obj)
    }
    return arr
}
// Turn on or turn off the own mic
export const setMicOwn = ({ mic, oldPeer, audio }) => {
    if (mic === true) {
        const audioTrack = createEmptyAudioTrack();
        let data = oldPeer.connections
        for (let i = 0; i < audio.length; i++) {
            let userMic = Object.keys(data)[i]
            let sender = data[userMic][0].peerConnection.getSenders()[0] || []
            sender.replaceTrack(audioTrack)
        }
    }
    // else reconnect peer to peer 
    else {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
            let data = oldPeer.connections
            for (let i = 0; i < audio.length; i++) {
                let userMic = Object.keys(data)[i]
                let sender = data[userMic][0].peerConnection.getSenders()[0]
                sender.replaceTrack(stream.getAudioTracks()[0])
            }
        }).catch(err => {
        })
    }
}
export const setVolumnOther = ({ oldPeer, i, audio, value }) => {
    let idMuted = Object.keys(oldPeer.connections)[i]
    let sender = oldPeer.connections[idMuted][0].peerConnection.getSenders()[0] || []
    const returnAudio = (stream, streamNull) => {
        let a = (
            <audio ref={audio => audio ? audio.srcObject = stream : streamNull} playsInline autoPlay />
        )
        let obj = {
            stream: a,
            audio: false,
            mic: true
        }
        let arr = [...audio]
        arr[i] = obj
        return arr
    }
    if (value.audio === true) {
        let audioTrack = createEmptyAudioTrack()
        sender.replaceTrack(audioTrack)
        const streamNull = new MediaStream([audioTrack]);
        returnAudio(streamNull, streamNull)
    } else {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
            sender.replaceTrack(stream.getAudioTracks()[0])
            returnAudio(stream, createNullStream())
        })
    }
}
export const setMicOther = ({ audio, data, volumn, i }) => {
    if (audio.length !== 0) {
        // copy old object
        let value = Object.assign({}, data.stream.props, { seleted: false, writeable: true })
        let old = Object.assign({}, data.stream, { writeable: true, seleted: false })
        value.muted = !volumn
        // delete specific key
        delete value["seleted"]
        delete value["writeable"]
        old.props = value
        delete old["seleted"]
        delete old["writeable"]
        // create new object
        // to handle new data
        let arr = [...audio]
        let obj = {
            stream: old,
            audio: data.audio,
            mic: false
        }
        arr[i] = obj
        return arr
    }
}
