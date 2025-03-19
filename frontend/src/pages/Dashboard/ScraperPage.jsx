import {
    Container,
    Heading,
} from "@chakra-ui/react"
import AddWebpage from "@/features/Dashboard/Scraper/AddWebpage"
import WebpagesTable from "@/features/Dashboard/Scraper/WebpagesTable"
export default function ScraperPage() {
    return (
		<Container maxW="full">
			<Heading size="2xl" textAlign={{ base: "center", md: "left" }} pt={12}>
				Web Scraper
			</Heading>
            <AddWebpage />
            <WebpagesTable />
		</Container>
	)
}