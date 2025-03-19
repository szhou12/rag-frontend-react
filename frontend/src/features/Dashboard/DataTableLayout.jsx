import {
    Container,
    EmptyState,
    Flex,
    Heading,
    Table,
    VStack,
  } from "@chakra-ui/react"
  import { FiSearch } from "react-icons/fi"

  import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
  } from "@/components/ui/pagination"

const DataTableLayout = ({
    isLoading,
    pendingComponent,
    isEmpty,
    emptyStateProps,
    paginationProps,
    children,
}) => {

    if (isLoading) {
        return pendingComponent;
    }

    if (isEmpty && emptyStateProps) {
        return (
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        {emptyStateProps.icon || <FiSearch />}
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>{emptyStateProps.title}</EmptyState.Title>
                        <EmptyState.Description>
                            {emptyStateProps.description}
                        </EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        )
    }

    return (
        <>
            {children}
            
            <Flex justifyContent="flex-end" mt={4}>
                <PaginationRoot
                    count={paginationProps.count}
                    pageSize={paginationProps.pageSize}
                    onPageChange={paginationProps.onPageChange}
                >
                    <Flex>
                        <PaginationPrevTrigger />
                        <PaginationItems />
                        <PaginationNextTrigger />
                    </Flex>
                </PaginationRoot>
            </Flex>
        </>
    )


}

export default DataTableLayout;