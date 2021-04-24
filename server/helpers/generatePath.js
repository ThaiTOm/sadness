exports.generatePath = (req, originalname) => {
    let fileArrOri = originalname.split(".")
    let mix = fileArrOri[0]
    return mix + ".jpeg"
}