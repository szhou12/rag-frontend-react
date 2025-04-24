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

import { Tooltip } from "@/components/ui/tooltip"
import FileActionsMenu from "./FileActionsMenu"
import { PendingDataTable } from "@/components/Dashboard/PendingDataTable"
import { Route } from "@/routes/_dashboard-layout/uploader"
import { usePagination } from "@/hooks/usePagination"
import { DataTableLayout } from "@/layouts/Dashboard/DataTableLayout"


// TODO: DELETE when frontend OpenAPI auto-generation is ready!!!
import axios from 'axios';

const API_URL = 'http://localhost:8001';

// TODO: DELETE when backend is ready
// Fake file data
// const MOCK_FILES = Array.from({ length: 16 }, (_, index) => ({
//     id: index + 1,
//     name: `document-${index + 1}${index % 2 === 0 ? '.pdf' : '.xlsx'}`,
//     date_added: new Date(2024, 0, index + 1).toLocaleDateString(),
//     language: index % 3 === 0 ? 'zh' : 'en', // Mix of English and Chinese
//     pages: Math.floor(Math.random() * 50) + 1, // Random pages between 1-50
//     size: (Math.random() * 10).toFixed(2), // Random size between 0-10 MB
//     author: `Author ${index + 1}`,
//     filename: `GivenFilename ${index + 1}`,
// }));

// TODO: DELETE when backend is ready
// Mock service that simulates API calls
// const MockFilesService = {
//     readFiles: ({ skip, limit }) => {
//         // Simulate API delay
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve({
//                     data: MOCK_FILES.slice(skip, skip + limit),
//                     count: MOCK_FILES.length
//                 });
//             }, 800); // 0.8 second delay
//         });
//     }
// };

export const FilesService = {
    readFiles: async ({ skip, limit }) => {
        const response = await axios.get(
            `${API_URL}/demo/uploads/`,
            {
                params: { skip, limit },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }
        );
        return response.data;
    }
}

const PER_PAGE = 5

// TODO: Comment off when backend is ready
function getFilesQueryOptions({ page }) {
    return {
        queryFn: () =>
            // FilesService.readFiles({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
            // MockFilesService.readFiles({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
            FilesService.readFiles({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),

        queryKey: ["files", page], // give data table a namespace/key ["files"]
    }
}

function FilesTable() {
    // Set new page number in the URL
    const { setPage } = usePagination({ from: Route.fullPath })

    // Get current page number from the URL: /uploader?page=2 -> {page: 2}
    const { page } = Route.useSearch()

    // Fetch files data from the backend
    const { data, isLoading, isPlaceholderData } = useQuery({
        ...getFilesQueryOptions({ page }),
        placeholderData: (prevData) => prevData,
    })

    const files = data?.data.slice(0, PER_PAGE) ?? []
    const count = data?.count ?? 0


    const columnHeaders = [
        "File Name",
        "Author(s)",
        "Date Added",
        "Language",
        "Pages",
        "Size",
        "Actions",
    ]
    
    return (
        <DataTableLayout
            isLoading={isLoading}
            isEmpty={files.length === 0}
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
                    {files?.map((file) => (
                        <Table.Row key={file.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={file.filename}
                                    showArrow
                                    positioning={{ placement: "left-end" }}
                                >
                                    <Box as="span" isTruncated>
                                        {file.filename}
                                    </Box>
                                </Tooltip>
                            </Table.Cell>

                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={file.author}
                                    showArrow
                                    positioning={{ placement: "left-end" }}
                                >
                                    <Box as="span" isTruncated>
                                        {file.author}
                                    </Box>
                                </Tooltip>
                            </Table.Cell>

                            <Table.Cell>
                                {/* {file.date} */}
                                {new Date(file.date).toLocaleDateString()}
                            </Table.Cell>

                            <Table.Cell>
                                {file.language==="en" ? "English" : "中文"}
                            </Table.Cell>

                            <Table.Cell>
                                {file.pages}
                            </Table.Cell>

                            <Table.Cell>
                                {`${file.size_mb} MB`}
                            </Table.Cell>

                            <Table.Cell>
                                <FileActionsMenu
                                    file={file}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </DataTableLayout>
    )

}

export default FilesTable