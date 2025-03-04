import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useAnimation, useInView } from 'framer-motion';
import { motion } from 'framer-motion';
import { chakra } from '@chakra-ui/react';

const MotionBox = motion(chakra.div);


export const HeroRevealAnimation = ({ children, width = 'fit-content' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const mainControls = useAnimation();
    const sideControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start('visible');
            sideControls.start('visible');
        }
    }, [isInView, mainControls, sideControls]);

    return (
        <Box ref={ref} position="relative" width={width} overflow="hidden">
            {/* Main content reveal animation */}
            <MotionBox
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.8, delay: 0.25 }}
            >
                {children}
            </MotionBox>

            {/* Slide-out overlay animation */}
            <MotionBox
                variants={{
                    hidden: { left: '0%' },
                    visible: { left: '100%' },
                }}
                initial="hidden"
                animate={sideControls}
                transition={{ duration: 0.5, ease: 'easeIn' }}
                style={{
                    position: 'absolute',
                    top: 4,
                    bottom: 4,
                    left: 0,
                    right: 0,
                    background: '#009688',
                    zIndex: 20,
                }}
            />
        </Box>
    )
}
