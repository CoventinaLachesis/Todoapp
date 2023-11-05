import SideBar from './SideBar'

import MaterialTable from 'material-table'
import { ThemeProvider, createTheme } from '@mui/material';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import { useState, useEffect } from 'react';
import { DateTimePicker} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {TextField} from '@mui/material'
import axios from 'axios'
import { useCookies } from 'react-cookie'

function Main() {

    
    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    }

    const [columns, setColumns] = useState([
        { title: 'เลขระเบียน', field: 'id', editable: 'never' },
        { title: 'กิจกรรม', field: 'name' },
        {
            title: 'วันเวลา',
            field: 'when',
            initialEditValue: 'yyyy-MM-ddTHH:mm:ss'
          },
    ])
    
    const [data, setData] = useState([])
        
    const defaultMaterialTheme = createTheme()

    let [cookies] = useCookies(['token'])

    useEffect(() => {
        axios.get('/activities',
            { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
        ).then((response) => {
            setData(response.data)
        }).catch((error) => {
            if (error.code === 'ECONNABORTED') {
                console.log('timeout')
            } else {
                console.log(error.response.status)
            }
        })
	}, [])

    return (
        <div id="outer-container">
            <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'}/> 
            <div id="page-wrap">
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                        icons={tableIcons}
                        title={<h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To Do</h1>}
                        columns={columns}
                        data={data}
                        editable={{
                            onRowAddCancelled: rowData => { /* do nothing */ },
                            onRowUpdateCancelled: rowData => { /* do nothing */ },
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {  
                                        console.log(newData.name)                              
                                        axios.post('/activities',
                                            { name: newData.name, when: newData.when},
                                            { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
                                        ).then((response) => {                                    
                                            newData.id = response.data.id
                                            console.log('debugging!')
                                            console.log('1 = ' + response.data.id)
                                            console.log('2 = ' + newData)
                                            setData([...data, newData])
                                        }).catch((error) => {
                                            if (error.code === 'ECONNABORTED') {
                                                console.log('timeout')
                                            } else {
                                                console.log(error.response.status)
                                            }
                                        })
                                        resolve();
                                    }, 1000);
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        axios.put('/activities/' + oldData.id,
                                            { name: newData.name, when: newData.when },
                                            { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
                                        ).then((response) => {
                                            const dataUpdate = [...data];
                                            const index = oldData.tableData.id;
                                            dataUpdate[index] = newData;
                                            setData([...dataUpdate]);
                                        }).catch((error) => {
                                            if (error.code === 'ECONNABORTED') {
                                                console.log('timeout')
                                            } else {
                                                console.log(error.response.status)
                                            }
                                        })                                
                                        resolve();
                                    }, 1000);
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        axios.delete('/activities/' + oldData.id,
                                            { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
                                        ).then((response) => {
                                            const dataDelete = [...data];
                                            const index = oldData.tableData.id;
                                            dataDelete.splice(index, 1);
                                            setData([...dataDelete]);
                                        }).catch((error) => {
                                            if (error.code === 'ECONNABORTED') {
                                                console.log('timeout')
                                            } else {
                                                console.log(error.response.status)
                                            }
                                        })                                
                                        resolve();
                                    }, 1000);
                                })                                        
                        }}
                    />
                </ThemeProvider>      
            </div>    
      </div>
    )
  }
  
  export default Main