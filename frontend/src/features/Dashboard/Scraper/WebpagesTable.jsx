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
import DataTableLayout from "../DataTableLayout"
import WebpageActionsMenu from "./WebpageActionsMenu"
import { PendingDataTable } from "@/components/Dashboard/PendingDataTable"
import { Route } from "@/routes/_dashboard-layout/scraper"
import { usePagination } from "@/hooks/usePagination"


// TODO: DELETE when backend is ready
// Fake webpage data
const MOCK_WEBPAGES = Array.from({ length: 18 }, (_, index) => ({
    id: index + 1,
    url: `https://example${index + 1}.com/page-${index + 1}`,
    date_updated: new Date(2024, 0, index + 1).toLocaleDateString(),
    language: index % 3 === 0 ? 'zh' : 'en', // Mix of English and Chinese
    refresh_frequency: [0, 3, 7, 14, 30][Math.floor(Math.random() * 5)], // Random frequency in days
    auto_download: index % 3 === 0 ? true : false,
}));

// TODO: DELETE when backend is ready
// Mock service that simulates API calls
const MockWebpagesService = {
    readWebpages: ({ skip, limit }) => {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: MOCK_WEBPAGES.slice(skip, skip + limit),
                    count: MOCK_WEBPAGES.length
                });
            }, 800); // 0.8 second delay
        });
    }
};



const PER_PAGE = 5

// TODO: Comment off when backend is ready
function getWebpagesQueryOptions({ page }) {
    return {
        queryFn: () => 
            // WebpagesService.readWebpages({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
            MockWebpagesService.readWebpages({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),

        queryKey: ["webpages", page], // give data table a namespace/key ["webpages"]
    }
}

function WebpagesTable() {
    // Set new page number in the URL
    const { setPage } = usePagination({ from: Route.fullPath })

    // Get current page number from the URL: /scraper?page=2 -> {page: 2}
    const { page } = Route.useSearch()

    // Fetch webpages data from the backend
    const { data, isLoading, isPlaceholderData } = useQuery({
        ...getWebpagesQueryOptions({ page }),
        placeholderData: (prevData) => prevData,
    })

    const webpages = data?.data.slice(0, PER_PAGE) ?? []
    const count = data?.count ?? 0

    const columnHeaders = [
        "URL",
        "Date Updated",
        "Language",
        "Update Freq (Days)",
        "Auto-Download",
        "Actions",
    ]

    return (
        <DataTableLayout
            isLoading={isLoading}
            isEmpty={webpages.length === 0}
            pendingComponent={<PendingDataTable columnHeaders={columnHeaders} />}
            emptyStateProps={{
                title: "No webpages found in Database",
                description: "Scrape a webpage to get started"
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
                    {webpages?.map((webpage) => (
                        <Table.Row key={webpage.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={webpage.url}
                                    showArrow
                                    positioning={{ placement: "left-end" }}
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
                                {webpage.refresh_frequency}
                            </Table.Cell>

                            <Table.Cell>
                                {webpage.auto_download ? "✅" : "❌"}
                            </Table.Cell>

                            <Table.Cell>
                                <WebpageActionsMenu
                                    webpage={webpage}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </DataTableLayout>
    )
    
    
}

export default WebpagesTable