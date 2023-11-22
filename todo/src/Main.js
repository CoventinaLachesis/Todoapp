import SideBar from './SideBar'
import * as React from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import './index.css';

function Main() {


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType , setSnackbarType]=useState("success");
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSnackbar = (message,type) => {
        setSnackbarMessage(message);
        setSnackbarType(type)
        setSnackbarOpen(true);
    };
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
        { title: "กิจกรรม", field: "name" },
        {
          title: "วันเวลา",
          field: "when",
          editComponent: (props) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Basic date time picker"
                selected={props.value || null}
                onChange={props.onChange}
                // You can add any other props you need here
              />
            </LocalizationProvider>
          ),
          render: (rowData) => {
            // Parse the 'rowData.when' value using the appropriate format
            const parsedDate = parseISO(rowData.when);
      
            // Check if the parsed date is a valid Date object
            if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
              // Format the parsed date using the Thai locale and the 'dd MMM yy HH:mm' format
              const thaiDateFormat = format(parsedDate, "dd MMM yy HH:mm", { locale: th });
      
              return <TextField value={thaiDateFormat} />;
            } else {
              // Return an empty string if the parsed date is not valid
              return <TextField value="" />;
            }
          },
        },
      ]);
    
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

    const customTheme = createTheme({
        typography: {
          fontFamily: 'Kanit', // Replace with your desired font-family
        },
      });
    return (
        <div id="outer-container">
            <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'}/> 
            <div id="page-wrap">
                <ThemeProvider theme={customTheme}>
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
                                        console.log(newData.name);

                                        axios
                                            .post('/activities', { name: newData.name, when: newData.when }, { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 })
                                            .then((response) => {
                                            newData.id = response.data.id;
                                            newData.when = response.data.when; // Update 'when' property with server response
                                            console.log('debugging!');
                                            setData([...data, newData]);
                                            handleSnackbar('Success! Activity added.', 'success');
                                            })
                                            .catch((error) => {
                                            if (error.code === 'ECONNABORTED') {
                                                console.log('timeout');
                                                handleSnackbar('Error Something went wrong.', 'error');
                                            } else {
                                                console.log(error.response.status);
                                                handleSnackbar('Error Something went wrong.', 'error');
                                            }
                                            });

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
                                            handleSnackbar('Success! Activity Update.','success');
                                        }).catch((error) => {
                                            if (error.code === 'ECONNABORTED') {
                                                console.log('timeout')
                                                handleSnackbar('Error Something went wrong.','error');
                                            } else {
                                                console.log(error.response.status)
                                                handleSnackbar('Error Something went wrong.','error');
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
                                            handleSnackbar('Success! Activity Delete.','success');
                                        }).catch((error) => {
                                            if (error.code === 'ECONNABORTED') {
                                                console.log('timeout')
                                                handleSnackbar('Error Something went wrong.','error');
                                            } else {
                                                console.log(error.response.status)
                                                handleSnackbar('Error Something went wrong.','error');
                                            }
                                        })                                
                                        resolve();
                                    }, 1000);
                                })                                        
                        }}
                    />
                    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbarType}
        variant="filled"
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
                </ThemeProvider>      
            </div>    
      </div>
    )
  }
  
  export default Main