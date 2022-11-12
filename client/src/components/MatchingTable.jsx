import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
} from '@chakra-ui/react';
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './style.css';

export const MatchingTable = ({ columnsNames }) => {
    const [names, setNames] = React.useState([]);
    const [fileNames, setFileNames] = React.useState([]);
    const [indexes, setIndexes] = React.useState([]);

    const url = 'http://localhost:4002';

    const sendNewOrder = React.useCallback(() => {
        fetch(url + '/sendNewOrder', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: indexes.slice(0, names.length),
            }),
        });
    });

    React.useEffect(() => {
        setFileNames(columnsNames);
        setIndexes(Array(columnsNames.length)
            .fill()
            .map((e, i) => i));
        fetch(url + '/getColumnsNames', {
            method: 'POST',
            body: {},
        })
        .then((data) => data.json())
        .then((result) => {
            setNames(result.bdNames);
        });
    }, []);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        console.log('startIndex', startIndex);
        console.log('endIndex', endIndex);

        return result;
    };

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const newNames = reorder(fileNames, result.source.index, result.destination.index);
        const newIndexes = reorder(indexes, result.source.index, result.destination.index);

        setFileNames(newNames);
        setIndexes(newIndexes);
    }

    return (
        <div className="container">
            <div className="tablesWrapper">
                <div className="originalList">
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Требуемые заголовки (статичны)</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {names?.map((name) => (
                                    <Tr key={name}>
                                        <Td>{name}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </div>

                <div>
                    <div className="originalList">
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Столбцы из файла (сопоставьте данные)</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="list">
                                            {provided => (
                                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                                    {fileNames?.map((name, index) => (
                                                        <Draggable
                                                            draggableId={'key_' + name} index={index}
                                                            key={name}
                                                        >
                                                            {provided => (
                                                                <Tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <Td>{name}</Td>
                                                                </Tr>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>

            <div className="applyButton">
                <Button
                    onClick={sendNewOrder}
                    size='md'
                    colorScheme='teal'
                    variant='outline'
                >
                    Apply
                </Button>
            </div>
        </div>
    )
}