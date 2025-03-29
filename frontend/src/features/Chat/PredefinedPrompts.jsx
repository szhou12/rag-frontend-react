import { SimpleGrid } from '@chakra-ui/react'
import { HiBookOpen, HiLightBulb, HiMap, HiCubeTransparent } from 'react-icons/hi'
import { PromptButton } from './PromptButton'

export const PredefinedPrompts = ({ onPromptSelect }) => {
    // TODO: move this function to features/Chat if fetch predefined prompts from backend

    
    return (
        <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
            <PromptButton 
                icon={<HiLightBulb />}
                onClick={onPromptSelect}
            >
                请分析动力电池的核心特性和发展趋势
            </PromptButton>

            <PromptButton 
                icon={<HiMap />}
                onClick={onPromptSelect}
            >
                当前热泵技术有哪些发展路线?
            </PromptButton>
            
            <PromptButton 
                icon={<HiCubeTransparent />}
                onClick={onPromptSelect}
            >
                请分析直接电解技术有哪些主要的应用场景
            </PromptButton>

            <PromptButton 
                icon={<HiBookOpen />}
                onClick={onPromptSelect}
            >
                请分析液流电池储能技术在市场的发展趋势
            </PromptButton>
        </SimpleGrid>
    )
}