import {
	Box,
	Container,
	Flex,
	Heading,
	Icon,
	Stack,
	Text,
	LinkBox,
	LinkOverlay,
} from '@chakra-ui/react'
import {
	FcConferenceCall,
	FcFinePrint,
	FcGlobe,
} from 'react-icons/fc'
import { Link } from '@tanstack/react-router'
import useAuth from '@/hooks/useAuth'

// heading: string
// description: string
// icon: ReactElement
// href: string
const LinkCard = ({ heading, description, icon, href }) => {
  return (
    <LinkBox as="article">
      <Box
        w={'275px'}
        h={'225px'}
        borderWidth="2px"
        borderRadius="lg"
        overflow="hidden"
        p={5}
        _hover={{ 
          transform: 'translateY(-10px)',
          boxShadow: 'md',
          borderColor: 'ui.main'
        }}
        transition="all 0.2s">
        <Stack align={'start'} spacing={2} h="full">
          <Flex
            w={16}
            h={16}
            align={'center'}
            justify={'center'}
            color={'white'}
            rounded={'full'}
            >
            {icon}
          </Flex>
          <Box mt={2} flex="1" overflow="hidden">
            <LinkOverlay as={Link} to={href}>
              <Heading size="md" noOfLines={1}>{heading}</Heading>
            </LinkOverlay>
            <Text mt={1} fontSize={'sm'} noOfLines={2}>
              {description}
            </Text>
          </Box>
        </Stack>
      </Box>
    </LinkBox>
  )
}

function CardTable() {
	const { isAdmin } = useAuth()

	return (
		<>
			<Flex
				py={8}
				gap={4}
				flexWrap="wrap"
				justify={{ base: "center", md: "flex-start" }} // center on mobile, start from left on desktop
				maxW={{ base: "full", md: "2xl" }} // 2 cards per row in desktop
			>
				<LinkCard
					heading={'Scraper'}
					icon={<Icon as={FcGlobe} w={10} h={10} />}
					description={'Scrape data from the Internet.'}
					href={'/dashboard/scraper'}
				/>
				<LinkCard
					heading={'Uploader'}
					icon={<Icon as={FcFinePrint} w={10} h={10} />}
					description={'Upload file documents to the DB.'}
					href={'/dashboard/uploader'}
				/>
				
				{isAdmin() && (
					<LinkCard
						heading={'Admin'}
						icon={<Icon as={FcConferenceCall} w={10} h={10} />}
						description={'Manage currently registered users.'}
						href={'/dashboard/admin'}
					/>
				)}
			</Flex>
		</>
	)
}

export default function IndexPage() {
	return (
		<Container maxW="full">
			<Heading size="2xl" textAlign={{ base: "center", md: "left" }} pt={12}>
				Home
			</Heading>
			<CardTable />
		</Container>
	)
}