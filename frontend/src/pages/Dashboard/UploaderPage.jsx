import {
    Container,
    Heading,
} from "@chakra-ui/react"
import AddFile from "@/features/Dashboard/Uploader/AddFile"

export default function UploaderPage() {
    return (
		<Container maxW="full">
			<Heading size="2xl" textAlign={{ base: "center", md: "left" }} pt={12}>
				File Uploader
			</Heading>
            <AddFile />
		</Container>
	)
}