export const emojiInput = (ref, emo, text) => {
    if (ref) {
        ref.focus()
        const start = text.substring(0, ref.selectionStart)
        const end = text.substring(ref.selectionEnd)
        const message = start + emo.native + end
        return { message, position: start.length + emo.native.length }
    }
}
