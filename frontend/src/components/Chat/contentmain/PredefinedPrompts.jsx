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
                Summarize the core characteristics and current development trends of power batteries used in electric vehicles and energy storage.
            </PromptButton>

            <PromptButton 
                icon={<HiMap />}
                onClick={onPromptSelect}
            >
                What are the major technological development pathways for modern heat pump systems? Please include current advancements and comparative pros/cons.
            </PromptButton>
            
            <PromptButton 
                icon={<HiCubeTransparent />}
                onClick={onPromptSelect}
            >
                Identify the main application scenarios of direct electrolysis technology, especially in the context of hydrogen production and industrial decarbonization.
            </PromptButton>

            <PromptButton 
                icon={<HiBookOpen />}
                onClick={onPromptSelect}
            >
                Analyze the market development trends of flow battery energy storage systems. Include potential drivers, limitations, and adoption outlook.
            </PromptButton>
        </SimpleGrid>
    )
}