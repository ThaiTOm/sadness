exports.generatePath = (req, originalname, file) => {
    let fileArrOri = originalname.split(".")
    let mix = fileArrOri[0]

    let type = file.split("/")
    switch (type[0]) {
        case "image":
            return mix + ".jpeg"
        case "audio":
            return mix + ".mp3"
        case "video":
            return mix + ".mp4"
        default:
            return fileArrOri
    }
}