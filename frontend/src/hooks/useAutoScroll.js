import { useEffect, useLayoutEffect, useRef } from "react"

const SCROLL_THRESHOLD = 10

function useAutoScroll(active) {
    const scrollContentRef = useRef(null)
    const isDisabled = useRef(false)
    const prevScrollTop = useRef(null)

    useEffect(() => {

        const resizeObserver = new ResizeObserver(() => {
            const { scrollHeight, clientHeight, scrollTop } = document.documentElement
            if (!isDisabled.current && scrollHeight - clientHeight > scrollTop) {
                document.documentElement.scrollTo({
                    top: scrollHeight - clientHeight,
                    hehavior: 'smooth'
                })
            }
            
        })
        if (scrollContentRef.current) {
            resizeObserver.observe(scrollContentRef.current)
        }
    
        return () => resizeObserver.disconnect()
    }, [])

    useLayoutEffect(() => {
        if (!active) {
            isDisabled.current = true
            return
        }

        function onScroll() {

            const { scrollHeight, clientHeight, scrollTop } = document.documentElement

            // Case 1: scrolling up AND not close to the bottom of the page, isDisabled becomes true
            // Case 2: scrolling down close to the bottom (<= threshold), isDisabled becomes false 
            if ( 
                !isDisabled.current &&
                window.scrollY < prevScrollTop.current && 
                scrollHeight - clientHeight - scrollTop > SCROLL_THRESHOLD
            ) {
                isDisabled.current = true
            } else if (
                isDisabled.current &&
                scrollHeight - clientHeight - scrollTop <= SCROLL_THRESHOLD
            ) {
                isDisabled.current = false
            }
            // Save the scroll position for next time
            prevScrollTop.current = window.scrollY
        }

        // initial value setup: enable auto-scroll the first time the component mounts or active becomes true
        isDisabled.current = false
        prevScrollTop.current = document.documentElement.scrollTop

        // The effect tracks window scroll events before the browser paints
        // onScroll takes over the responsibility of setting isDisabled 
        window.addEventListener('scroll', onScroll)

        // Removes the listener when active changes or component unmounts
        return () => window.removeEventListener('scroll', onScroll)

    }, [active])

    return scrollContentRef

}

export default useAutoScroll