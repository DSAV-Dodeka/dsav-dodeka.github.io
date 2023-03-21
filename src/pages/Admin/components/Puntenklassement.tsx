import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './table.scss';
import Papa from "papaparse";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table'
import {UserData, ud_request, catch_api, PuntenKlassementData, EventType, RoleInfo} from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";
import "./Puntenklassement.scss";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {queryError, useSignedUpQuery, useUserDataQuery} from "../../../functions/queries";


const columnHelper = createColumnHelper<PuntenKlassementData>()

const columns = [
    columnHelper.accessor('Naam', {
        header: () => 'Naam',
    }),
    columnHelper.accessor('Punten', {
        header: () => 'Punten',
    })
]

const smallColumns = [
    columnHelper.accessor('Naam', {
        
    })
]

const defaultData: PuntenKlassementData[] = [
    {
        Naam: 'Brnold het Aardvarken',
        Punten: 11,
    },
    {
        Naam: 'Arnold het Aardvarken',
        Punten: 12,
    },
    {
        Naam: 'Arnold het Aardvarken',
        Punten: 12,
    },
    {
        Naam: 'Brnold het Aardvarken',
        Punten: 11,
    },
    {
        Naam: 'Arnold het Aardvarken',
        Punten: 12,
    },
    {
        Naam: 'Arnold het Aardvarken',
        Punten: 12,
    },
]

const eventTypes: EventType[] = [
    {
        type: "Borrel",
        default_points: 1
    },
    {
        type: "Saxiviteit",
        default_points: 3
    },
    {
        type: "NSK",
        default_points: 5
    }
]

const Puntenklassement = () => {
    const {authState, setAuthState} = useContext(AuthContext);
    const [newEvent, setNewEvent] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [CSVData, setCSVData] = useState();

    // const q = useUserDataQuery({ authState, setAuthState })
    // const data = queryError(q, defaultData, "User Info Query Error")
    const data = defaultData;

    const table = useReactTable<PuntenKlassementData>({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    })

    const smallTable = useReactTable<PuntenKlassementData>({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    })

    const handleFileUpload = (e: any) => {
        const files = e.target.files;
        console.log(files);
        if (files) {
            Papa.parse(files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    console.log(results.data);
                    const rowsArray = [];
                    const valuesArray = [];

                    // Iterating data to get column name and their values
                    results.data.map((d) => {
                        rowsArray.push(Object.keys(d));
                        valuesArray.push(Object.values(d));
                    });
                    console.log(valuesArray);
                }
            })
        }
    }

    return (
        <div>
            <table className="leden_table">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div onClick={header.column.getToggleSortingHandler()} className={(header.column.getCanSort() ? "canSort" : "")}>
                                                
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' ↑',
                                                desc: ' ↓'
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        )}
                                    </th>
                                )
                            })}
                            <th ><p className="leden_table_header_button" onClick={() => setNewEvent(true)}>Nieuw evenement</p></th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.length === 0 && (
                    <tr>
                        <td colSpan={5}>Er zijn helaas geen nieuwe aanmeldingen</td>
                    </tr>
                )}
                {table.getRowModel().rows.map(row => (
                    <Fragment key={row.id}>
                        <tr>
                            {/* first row is a normal row */}
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                            <td>
                                <p className="leden_table_row_link">Bekijk behaalde punten</p>
                            </td>
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/><br/>
            {newEvent && 
                <>
                <div className="new_event_container" />
                <div className="new_event">
                <svg xmlns="http://www.w3.org/2000/svg" className="new_event_cross" onClick={() => setNewEvent(false)} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
                    <p className="new_event_title">Voeg een nieuw evenement toe</p>
                    <form className="new_event_form">
                        <input className="new_event_input" type="text" placeholder="Naam evenement"></input>
                        <div className="new_event_half">
                            <p className="new_event_label">Datum:</p>
                            <input className="new_event_date" type="date"></input><br/>
                        </div>
                        
                        <div className="new_event_half">
                        <p className="new_event_label_type">Type:</p>
                        <select className="new_event_select">
                            {eventTypes.map((item) => {
                                return <option>{item.type}</option>;
                            })}
                        </select>
                        </div>
                        <div className="new_event_half">
                            <p className="new_event_label">Aantal punten:</p>
                            <input className="new_event_points" type="number" min="1" max="12" defaultValue="0"></input>
                        </div>
                        
                        <p className="new_event_header">Selecteer leden</p>
                        {/* <table>
                            {smallTable.getRowModel().rows.map(row => (
                                <Fragment key={row.id}>
                                <tr>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                    
                                </tr>
                            </Fragment>
                            ))}
                        </table> */}
                        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload}></input>
                        <button className="leden_table_row_button">Voeg toe</button>
                    </form>

                </div>
                </>
                
            }
        </div>
    )
}

export default Puntenklassement;
