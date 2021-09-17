import { Table, Tbody, Th, Thead, Tr, Td, TableCaption } from '@chakra-ui/table';
import { chakra } from "@chakra-ui/react"
import React, { useMemo } from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useTable, useSortBy } from 'react-table';

const must = (v, ...args) => {
    if (!v) return;
    if (typeof v === 'function') return v(...args);
    return v;
};

const normalizeData = (data, headers, baseIndex = 0) => {
    let hrs = [];
    let items = [];

    if (Array.isArray(data)) {
        // array
        if (data.length === 0) return [];

        if (typeof data[0] === 'object') {
            items = [...data];

            const keys = Object.keys(data[0]);
            hrs = keys.map(k => ({
                Header: must(headers[k]) || k,
                accessor: k,
                isNumeric: /^[0-9.]*$/.test(data[0][k]),
            }));

            return [hrs, items];
        } else {
            let k = 'value';
            hrs = [
                {
                    Header: must(headers[k]) || k,
                    accessor: k,
                },
            ];

            data.forEach((i, idx) => {
                items.push({ value: i });
            });
        }
    } else if (typeof data === 'object') {
        hrs = ['key', 'value'].map(x => ({
            Header: must(headers[x]) || x,
            accessor: x,
        }));

        // build items
        Object.keys(data).forEach((k, idx) =>
            items.push({ key: k, value: data[k] })
        );
    }
    return [hrs, items];
};

const __empty__array = []
export default ({ children, headers = {}, data = __empty__array, caption, ...props }) => {
    const [columns = __empty__array, items = __empty__array] = useMemo(() => normalizeData(data, headers), [data])

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
            useTable({ columns, data: items }, useSortBy);

    if (items.length === 0 || Object.keys(items[0]).length === 0) {
        return children
    }

    return (
        <Table {...getTableProps()} style={{tableLayout: "fixed"}} {...props}>
            {caption && <TableCaption children={caption} />}
            <Thead>
                {headerGroups.map(headerGroup => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <Th
                                {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                )}
                                isNumeric={column.isNumeric}
                            >
                                {column.render('Header')}
                                <chakra.span pl="4">
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label="sorted descending" />
                                        ) : (
                                            <TriangleUpIcon aria-label="sorted ascending" />
                                        )
                                    ) : null}
                                </chakra.span>
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <Td
                                    {...cell.getCellProps()}
                                    isNumeric={cell.column.isNumeric}
                                >
                                    {cell.render('Cell')}
                                </Td>
                            ))}
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
};
