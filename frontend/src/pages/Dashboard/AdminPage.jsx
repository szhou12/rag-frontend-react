import {
    Container,
    Heading,
} from "@chakra-ui/react"
import AddUser from "@/features/Dashboard/Admin/AddUser"
import UsersTable from "@/features/Dashboard/Admin/UsersTable"


export default function AdminPage() {
    return (
		<Container maxW="full">
			<Heading size="2xl" textAlign={{ base: "center", md: "left" }} pt={12}>
				Users Management
			</Heading>
            <AddUser />
            <UsersTable />
		</Container>
	)
}