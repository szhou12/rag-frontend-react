// ThreeLayerLayout.jsx
import { Box } from '@chakra-ui/react';

/**
 * Sticky Top
 */
const TopLayer = ({ children, ...props }) => (
    <Box position="sticky" top="0" zIndex="sticky" {...props}>
        {children}
    </Box>
);

/**
 * Scrollable Main Area
 */
const MainLayer = ({ children, ...props }) => (
    <Box flex="1" overflowY="auto" p={2} {...props}>
        {children}
    </Box>
);

/**
 * Sticky Bottom
 */
const BottomLayer = ({ children, ...props }) => (
    <Box position="sticky" bottom="0" zIndex="sticky" {...props}>
        {children}
    </Box>
);


export const ThreeLayerLayout = ({ 
    top,
    topProps = {}, 
    main,
    mainProps = {}, 
    bottom,
    bottomProps = {},
}) => {
    return (
        <>
            {top && <TopLayer {...topProps}>{top}</TopLayer>}
            {main && <MainLayer {...mainProps}>{main}</MainLayer>}
            {bottom && <BottomLayer {...bottomProps}>{bottom}</BottomLayer>}
        </>
    );
};
