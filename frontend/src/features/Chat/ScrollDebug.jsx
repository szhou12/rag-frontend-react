// ScrollDebug.jsx
import { useEffect, useState } from 'react'
import { Text } from "@chakra-ui/react"

function ScrollDebug({ scrollRef }) {
    const [measurements, setMeasurements] = useState({
        scrollHeight: 'N/A',
        clientHeight: 'N/A',
        scrollTop: 'N/A'
    })

    useEffect(() => {
        if (!scrollRef.current) return

        const updateMeasurements = () => {
            setMeasurements({
                scrollHeight: scrollRef.current.scrollHeight,
                clientHeight: scrollRef.current.clientHeight,
                scrollTop: scrollRef.current.scrollTop
            })
        }

        // Update on mount
        updateMeasurements()

        // Update on scroll
        scrollRef.current.addEventListener('scroll', updateMeasurements)
        
        // Update on resize
        const resizeObserver = new ResizeObserver(updateMeasurements)
        resizeObserver.observe(scrollRef.current)

        return () => {
            if (scrollRef.current) {
                scrollRef.current.removeEventListener('scroll', updateMeasurements)
            }
            resizeObserver.disconnect()
        }
    }, [scrollRef])

    return (
        <Text fontSize="sm" color="gray.500">
            {`Scroll Debug:
            scrollHeight: ${measurements.scrollHeight}
            clientHeight: ${measurements.clientHeight}
            scrollTop: ${measurements.scrollTop}`}
        </Text>
    )
}

export default ScrollDebug