import { useEffect, useLayoutEffect, useRef } from "react"

const SCROLL_THRESHOLD = 10

/**
 * KEY CHANGES:
 * Changed all document.documentElement references to use scrollContentRef.current instead
 * Changed window.scrollY to use the container's scrollTop
 * Changed scroll event listener from window to the container element
 * Added null checks for scrollContentRef.current
 * Fixed a typo in behavior (was hehavior)
 * Updated comments to reflect container-specific behavior
 */

function useAutoScrollChat(active) {
    const scrollContentRef = useRef(null)
    const isDisabled = useRef(false)
    const prevScrollTop = useRef(null)

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (!scrollContentRef.current) return

            console.log('ResizeObserver triggered')
            const { scrollHeight, clientHeight, scrollTop } = scrollContentRef.current
            console.log('Current scroll position:', { scrollHeight, clientHeight, scrollTop })
            
            if (!isDisabled.current && scrollHeight - clientHeight > scrollTop) {
                console.log('Auto-scrolling to bottom')
                scrollContentRef.current.scrollTo({
                    top: scrollHeight - clientHeight,
                    behavior: 'smooth'
                })
            } else {
                console.log('Not auto-scrolling because:', {
                    isDisabled: isDisabled.current,
                    isAtBottom: scrollHeight - clientHeight <= scrollTop
                })
            }
        })

        if (scrollContentRef.current) {
            console.log('Setting up ResizeObserver')
            resizeObserver.observe(scrollContentRef.current)
        }
    
        return () => resizeObserver.disconnect()
    }, [])

    useLayoutEffect(() => {
        if (!active || !scrollContentRef.current) {
            console.log('Auto-scroll disabled:', { active, hasRef: !!scrollContentRef.current })
            isDisabled.current = true
            return
        }

        function onScroll() {
            if (!scrollContentRef.current) return

            const { scrollHeight, clientHeight, scrollTop } = scrollContentRef.current

            // Case 1: scrolling up AND not close to the bottom of the container, isDisabled becomes true
            // Case 2: scrolling down close to the bottom (<= threshold), isDisabled becomes false 
            if ( 
                !isDisabled.current &&
                scrollTop < prevScrollTop.current && 
                scrollHeight - clientHeight - scrollTop > SCROLL_THRESHOLD
            ) {
                console.log('Disabling auto-scroll: user scrolled up')
                isDisabled.current = true
            } else if (
                isDisabled.current &&
                scrollHeight - clientHeight - scrollTop <= SCROLL_THRESHOLD
            ) {
                console.log('Enabling auto-scroll: user scrolled to bottom')
                isDisabled.current = false
            }
            // Save the scroll position for next time
            prevScrollTop.current = scrollTop
        }

        // initial value setup: enable auto-scroll the first time the component mounts or active becomes true
        isDisabled.current = false
        prevScrollTop.current = scrollContentRef.current.scrollTop
        console.log('Auto-scroll enabled on mount/active change')

        // The effect tracks container scroll events before the browser paints
        scrollContentRef.current.addEventListener('scroll', onScroll)

        // Removes the listener when active changes or component unmounts
        return () => {
            if (scrollContentRef.current) {
                scrollContentRef.current.removeEventListener('scroll', onScroll)
            }
        }

    }, [active])

    return scrollContentRef
}

export default useAutoScrollChat
