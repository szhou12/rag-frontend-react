import { useState, useLayoutEffect, useRef } from 'react'

// This hook creates an auto-sizing textarea/input that grows height with its content, without any visual jumps or flickers (no re-renders)
function useAutoSize(value) {
    const ref = useRef(null)
    const [borderWidth, setBorderWidth] = useState(0)

    // Get the border width (top + bottom border thickness) of the textarea
    useLayoutEffect(() => {
        const style = window.getComputedStyle(ref.current)
        setBorderWidth(parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth))
    }, []) // Runs once on mount

    // Set the height of textarea = content height + border width
    // ensure texts don't get cut off by the border
    useLayoutEffect(() => {
        // First reset height to let it shrink if needed
        ref.current.style.height = 'inherit'

        // set new height of textarea
        // scrollHeight = content height (user input text height)
        ref.current.style.height = `${ref.current.scrollHeight + borderWidth}px`
    }, [value, borderWidth]) // Runs when value (user input texts) or borderWidth changes

    return ref
}

export default useAutoSize