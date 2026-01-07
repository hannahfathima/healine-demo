import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Input, Uploader } from 'rsuite';
import { Table } from 'rsuite';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useDeprecatedAnimatedState } from 'framer-motion';
import "bootstrap/dist/css/bootstrap.min.css";
import {useState} from 'react';
// import { Button } from 'react-bootstrap';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    // debugger
    addData()
    setOpen(false);
  };

const [formData, setFormData] = React.useState({
  icon : "C:\\fakepath\\9cf1588786e84516b96ec65ed057545b-0001 (1).jpg"
})
const [value, setValue] = React.useState([]);

const handleFormData = (key, e) => {
  formData[key] = e
}

const [data, setData] = React.useState([])


const getList = (e) => {
  
  axios.get({
    url: "https://www.healine.com/api/v1/specialities?page_no=1&items_per_page=10&search_text",
    // Content-Type: 'application/json',
    headers: {
      'Content-Type': 'application/json',
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsImVtYWlsIjoic3VyYWouYWtoYWRlQGdtYWlsLmNvbSIsImlhdCI6MTY3MzM0MTg5OSwiZXhwIjoxNzA0ODc3ODk5fQ.faJ4vlKXpcDr5y8fDp_NNX2AMf5o37ePPIBEcE-03Eo",
    },
  })
  .then((res) => { setData(res.data); console.log(res)})
    .catch((err) => {console.log(err)});
}

const addData = (e) => {
  debugger
  axios.post({
    url: "https://www.healine.com/api/v1/specialities",
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept' : "application/json",
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsImVtYWlsIjoic3VyYWouYWtoYWRlQGdtYWlsLmNvbSIsImlhdCI6MTY3MzM0MTg5OSwiZXhwIjoxNzA0ODc3ODk5fQ.faJ4vlKXpcDr5y8fDp_NNX2AMf5o37ePPIBEcE-03Eo"
    },
    formData
  })
  .then((res) => { setData(res.data); console.log(res)})
    .catch((err) => { console.log(err)});
}

const deleteData = (id) => {
  axios.delete({
    url: `https://www.healine.com/api/v1/specialities/${id}`,
    headers: {
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsImVtYWlsIjoic3VyYWouYWtoYWRlQGdtYWlsLmNvbSIsImlhdCI6MTY3MzM0MTg5OSwiZXhwIjoxNzA0ODc3ODk5fQ.faJ4vlKXpcDr5y8fDp_NNX2AMf5o37ePPIBEcE-03Eo",
    },
  })
  .then((res) => { setData(res.data); console.log(res)})
    .catch((err) => {console.log(err)});
}

const udateData = (id) => {
  axios.post({
    url: `https://www.healine.com/api/v1/specialities/${id}`,
    headers: {
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsImVtYWlsIjoic3VyYWouYWtoYWRlQGdtYWlsLmNvbSIsImlhdCI6MTY3MzM0MTg5OSwiZXhwIjoxNzA0ODc3ODk5fQ.faJ4vlKXpcDr5y8fDp_NNX2AMf5o37ePPIBEcE-03Eo",
    },
    formData
  })
  .then((res) => { setData(res.data); console.log(res)})
    .catch((err) => {console.log(err)});
}

React.useEffect(() => {
  getList()
}, []);

console.log(formData)
  return (
    <div className='min-width'>
      <div style={{display:"flex", justifyContent:"end", marginBottom:"8px"}}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Specialties
      </Button>
      </div>

      <div className="row">
                <div className="table-responsive " >
                 <table className="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tier</th>
                            <th>Icon</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr>
                            <td>Rual Octo</td>
                            <td>Tier 1</td>
                            <td><a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a></td>
                            <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</td>
                            <td>
                               {/* <a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a> */}
                                <a href="#" className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{color:"red"}}><i className="material-icons">&#xE872;</i></a>
                                 
                            </td>
                        </tr>
                        <tr>
                            {/* <td>2</td> */}
                            <td>Demark</td>
                            <td>Tier 2</td>
                            <td><a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a></td>
                            <td> Ipsum is simply dummy text of the printing and typesetting industry. </td>
                            <td>
                            {/* <a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a> */}
                                <a href="#" className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{color:"red"}}><i className="material-icons">&#xE872;</i></a>
                            </td>
                        </tr>
                         
 
                        <tr>
                            {/* <td>3</td> */}
                            <td>Richa Deba</td>
                            <td>Tier 3</td>
                            <td><a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a></td>
                            <td> is simply dummy text of the printing and typesetting industry. </td>
                            <td>
                            {/* <a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a> */}
                                <a href="#" className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{color:"red"}}><i className="material-icons">&#xE872;</i></a>
                            </td>
                        </tr>
 
                        <tr>
                            {/* <td>4</td> */}
                            <td>James Cott</td>
                            <td>Tier 4</td>
                            <td><a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a></td>
                            <td>  simply dummy text of the printing and typesetting industry. </td>
                            <td>
                            {/* <a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a> */}
                                <a href="#" className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{color:"red"}}><i className="material-icons">&#xE872;</i></a>
                            </td>
                        </tr>
 
 
                        <tr>
                            {/* <td>5</td> */}
                            <td>Dheraj</td>
                            <td>Tier 5</td>
                            <td><a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a></td>
                            <td>  It is a long established fact that a reader will be distracted </td>
                            <td>
                            {/* <a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a> */}
                                <a href="#" className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{color:"red"}}><i className="material-icons">&#xE872;</i></a>
                            </td>
                        </tr>
 
 
                        <tr>
                            {/* <td>6</td> */}
                            <td>Maria James</td>
                            <td>Tier 6</td>
                            <td><a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a></td>
                            <td>distracted by the readable content of a page when looking at its layout</td>
                            <td>
                            {/* <a href="#" className="view" title="View" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a> */}
                                <a href="#" className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{color:"red"}}><i className="material-icons">&#xE872;</i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>   
        </div>  

      {/* <table className="table min-width">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Tier</th>
            <th scope="col">Icon</th>
            <th scope="col">Description</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
              return (
                <tr>
                  <th scope="row">{item.name}</th>
                  <td>{item.tier}</td>
                  <td><img src={item.icon}/></td>
                  <td>{item.description}</td>
                  <td onClick={() => handleClickOpen ()}>EDIT</td>
                  <td>DELETE</td>
                </tr>
              )
            }) 
          }
        </tbody>
      </table> */}


      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add Specialty
        </BootstrapDialogTitle>
        <DialogContent dividers>


          <Input placeholder="name" defaultValue={formData.name} onChange={(e) => handleFormData("name", e)}  style={{width:"49%", margin:"5px"}}/>
          <Input placeholder="tier" defaultValue={formData.name} onChange={(e) => handleFormData("tier", e)} style={{width:"49%"}}/>
          <Input placeholder="description" value={formData.description} style={{width:"99%", margin:"5px"}}/>
          <input type="file" id="icon" name="icon" onChange={(e) => handleFormData("icon", e.target.value)} style={{width:"99%"}}/>
          




        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose()}>
            Create
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
// export default Dashboard;
