import {
    Badge,
    Box,
    Container,
    Flex,
    Heading,
    Link,
    Table,
    VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"

import { Tooltip } from "@/components/ui"
import DataTableLayout from "../DataTableLayout"
import WebpageActionsMenu from "./WebpageActionsMenu"


const PER_PAGE = 5

function WebpagesTable() {
    // ... data fetching logic ...

    return (
        <DataTableLayout>
            <Table.Root size={{ base: "sm", md: "md" }}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w="sm">URL</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Date Updated</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Language</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Frequency (Days)</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {webpages?.map((webpage) => {
                        <Table.Row key={webpage.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={webpage.url}
                                    showArrow
                                >
                                    <Link variant="underline" href={webpage.url}>
                                        {webpage.url}
                                    </Link>
                                </Tooltip>
                            </Table.Cell>

                            <Table.Cell>
                                {webpage.date_updated}
                            </Table.Cell>

                            <Table.Cell>
                                {webpage.language==="en" ? "English" : "中文"}
                            </Table.Cell>

                            <Table.Cell>
                                {webpage.frequency}
                            </Table.Cell>

                            <Table.Cell>
                                <WebpageActionsMenu
                                    webpage={webpage}
                                />
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table.Root>
        </DataTableLayout>
    )
    
    
}

export default WebpagesTable