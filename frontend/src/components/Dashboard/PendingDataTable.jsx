import { Table, SkeletonText } from "@chakra-ui/react"

export const PendingDataTable = ({columnHeaders}) => {
    return (
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
                {[...Array(5)].map((_, rowIndex) => (
                    <Table.Row key={rowIndex}>
                        {columnHeaders.map((_, colIndex) => (
                            <Table.Cell key={colIndex}>
                                <SkeletonText noOfLines={1} />
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}

            </Table.Body>
        </Table.Root>
    )
    
}