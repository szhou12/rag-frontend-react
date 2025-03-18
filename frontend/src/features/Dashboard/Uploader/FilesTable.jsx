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
import { PendingDataTable } from "@/components/Dashboard/PendingDataTable"

function FilesTable() {
    // ... data fetching logic ...

    const columnHeaders = [
        "File Name",
        "Date Added",
        "Language",
        "Pages",
        "Size",
        "Actions",
    ]
    
    return (
        <DataTableLayout
            isLoading={isLoading}
            isEmpty={items.length === 0}
            pendingComponent={<PendingDataTable columnHeaders={columnHeaders} />}
            emptyStateProps={{
                title: "No files found in Database",
                description: "Upload a file to get started"
            }}
            paginationProps={{
                count,
                pageSize: PER_PAGE,
                onPageChange: ({ page }) => setPage(page)
            }}
        >
            <Table.Root size={{ base: "sm", md: "md" }}>

                <Table.Header>
                    <Table.Row>
                        {columnHeaders.map((header, index) => (
                            <Table.ColumnHeader key={index} w="sm">
                                {header}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {files?.map((file) => {
                        <Table.Row key={file.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={file.name}
                                    showArrow
                                    positioning={{ placement: "left-end" }}
                                >
                                    <Box as="span" isTruncated>
                                        {file.name}
                                    </Box>
                                </Tooltip>
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