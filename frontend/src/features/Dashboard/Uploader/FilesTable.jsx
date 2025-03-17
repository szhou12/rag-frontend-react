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
import FileActionsMenu from "./FileActionsMenu"

function FilesTable() {
    // ... data fetching logic ...

    return (
        <DataTableLayout>
            <Table.Root size={{ base: "sm", md: "md" }}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w="sm">File Name</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Date Added</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Language</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Pages</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Size</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {files?.map((file) => {
                        <Table.Row key={file.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={file.name}
                                    showArrow
                                >
                                    <Box as="span" isTruncated>
                                        {file.name}
                                    </Box>
                                </Tooltip>
                                {file.name}
                            </Table.Cell>

                            <Table.Cell>
                                {file.date_added}
                            </Table.Cell>

                            <Table.Cell>
                                {file.language==="en" ? "English" : "中文"}
                            </Table.Cell>

                            <Table.Cell>
                                {file.pages}
                            </Table.Cell>

                            <Table.Cell>
                                `${file.size} MB`
                            </Table.Cell>

                            <Table.Cell>
                                <FileActionsMenu
                                    file={file}
                                />
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table.Root>
        </DataTableLayout>
    )

}

export default FilesTable