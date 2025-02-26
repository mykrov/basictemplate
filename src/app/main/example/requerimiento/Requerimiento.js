import { FormControl } from '@material-ui/core';
import { useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

const serverapi = process.env.REACT_APP_SERVERAPI;
const useStyles = makeStyles({
	layoutRoot: {      
    },
    FormControl:{
        margin: '8px solid black',
        color:'pink'
    },
    formControl: {
        margin: 10,
        minWidth: 150,
      },
    selectEmpty: {
        marginTop: '10px',
    },
});
const formElement = {
    margin: '1rem',
};
const formElement2 = {
   minWidth : '300px',
   marginTop : '2rem'
};



function Requerimiento() {
    
    let contac = 0
    let empre = 0
    let tipor = 0

    const dispatch = useDispatch();
	const classes = useStyles();
    const [loading1, setLoading1] = useState(true); 
    const [loading2, setLoading2] = useState(true); 
    const [loading3, setLoading3] = useState(true);   
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [data,setData] = useState({        
        idempresa : 0,
        tipo : 0,
        contacto : 0,
        creado : new Date(),
        descripcion: ""
    })   
    
    function handle(e) {       
        setData({
            ...data,
            [e.target.name]: e.target.value            
        })
        //console.log(data)
    } 

    function setearBasicos(){
        setData({
            ...data,
            idempresa: empre,
            tipo : tipor,
            contacto:contac
        })
    }

    const [empresaList,setEmpresa] = useState([
        { label: "Cargando...", value: "Cargando" }
    ]);

    const [contactosList,setContactos] = useState([
        { label: "Cargando...", value: "Cargando" }
    ]);
    
    const [tipoTickerList,setTipoTicket] = useState([
        { label: "Cargando...", value: "Cargando" }
    ]);
    
   
    
    useEffect(()=>{        
        async function getEmpresa() {
            axios.get(`${serverapi}/listarempresa`)
            .then(res => {                
                const dataC = res.data  
                empre = res.data.data[0].idempresa              
                setEmpresa(dataC.data.map(({ nombre_empresa:nombreEmpresa,idempresa }) => ({ label: nombreEmpresa, value: idempresa })));
                setLoading1(false); 
                setearBasicos()                    
            })                 
        }       
        getEmpresa();        
    },[]);

    useEffect(()=>{
                          
        async function getTipoTicket() {
            axios.get(`${serverapi}/tipoticket`)
            .then(res => {                
                const dataC = res.data
                tipor = res.data.data[0].idtipo_ticket
                setTipoTicket(dataC.data.map(({ tipo,idtipo_ticket:tipoTicket }) => ({ label: tipo, value: tipoTicket })));
                setLoading2(false); 
                setearBasicos()
                                        
            })
               
        }       
        getTipoTicket();  
           
    },[]);

    useEffect(()=>{             
        async function getContactos() {
            axios.get(`${serverapi}/listarcontacto`)
            .then(res => {                
                const dataC = res.data
                contac = res.data.data[0].idcontacto
                setContactos(dataC.data.map(({ nombre_contacto:nombreContacto,idcontacto }) => ({ label: nombreContacto, value: idcontacto })));
                setLoading3(false);
                setearBasicos()
            })
        }       
        getContactos();
    },[]);

    
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setData({
            ...data
                                
        })
        console.log(date)
    };
    
    
    const onSubmit = function(e){        
        e.preventDefault()
        const dataForm = data

        try{            
            axios({
                url : `${serverapi}/grabarticket`,
                method : 'POST',
                data : dataForm                
            })
            .then((response) => {
                const dataResponse = response.data
                const numT = dataResponse.data[0].nticket
                if(numT != null){
                   dispatch(showMessage({
                        message:`Requerimiento número ${ numT } almacenado.`,
                        variant:'success',
                        autoHideDuration:2000,
                        anchorOrigin: {
                            vertical  : 'bottom',//top bottom
                            horizontal: 'center'//left center right
                        },

                    }));
                }
                
            }, (error) => {
                dispatch(showMessage({
                    message:`Inconvenientes al almacenar requerimiento`,
                    variant:'error',
                    autoHideDuration:5000,
                    anchorOrigin: {
                        vertical  : 'top',//top bottom
                        horizontal: 'center'//left center right
                    },

                }));
                console.log(error);
            });
            
        }catch(err){
            console.log(err)
        }
    }  

    
	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="p-24">
					<h4>Requerimiento</h4>
				</div>
			}
			contentToolbar={
				<div className="px-24">
					<h4>Formulario de Ingreso.</h4>
				</div>
			}
			content={
                <Grid container justify="space-around">
                   
                    <div className="p-24">
                        <form className = {classes.root} onSubmit={onSubmit} >
                            <div>
                                <FormControl className={classes.formControl} >
                                    <InputLabel id="empresainput">Empresa</InputLabel>
                                    <Select
                                        labelId="empresainput"
                                        id="idempresa"
                                        value={data.idempresa}
                                        disabled={loading1}
                                        onChange={(e) => handle(e)}
                                        inputProps={{
                                            name: 'idempresa',
                                            id: 'idempresa',
                                        }}
                                    >
                                    {
                                        empresaList.map(({ label, value }) => (
                                            <MenuItem key={value} value={value}>{label.toUpperCase()}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormControl>
                                
                                <FormControl className={classes.formControl} >
                                    <InputLabel id="tiporequerimiento">Tipo Requerimiento.</InputLabel>
                                    <Select
                                        labelId="tiporequerimiento"
                                        id="tipo"
                                        value={data.tipo}
                                        disabled={loading2}
                                        onChange={(e) => handle(e)}
                                        inputProps={{
                                            name: 'tipo',
                                            id: 'tipo',
                                        }}
                                    >
                                    {
                                        tipoTickerList.map(({ label, value }) => (
                                            <MenuItem key={value+value} value={value}>{label.toUpperCase()}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl} >
                                    <InputLabel id="contactoInput">Contacto</InputLabel>
                                    <Select
                                        labelId="contactoInput"
                                        id="contacto"
                                        value={data.contacto}
                                        disabled={loading3}
                                        onChange={(e) => handle(e)}
                                        inputProps={{
                                            name: 'contacto',
                                            id: 'contacto',
                                        }}
                                    >
                                    {
                                        contactosList.map(({ label, value }) => (
                                            <MenuItem key={value+value} value={value}>{label.toUpperCase()}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormControl>
                            </div>
                            <div>                            
                                <FormControl style={formElement}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="creado"
                                        label="Fecha de Creación"
                                        format="dd/MM/yyyy"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </FormControl>
                            </div>                    
                            <div>
                                <FormControl style={formElement2}>
                                    <TextField
                                        id="descripcion"
                                        name="descripcion"
                                        label="Descripción"
                                        multiline
                                        rows={4}                                        
                                        variant="outlined"
                                        value ={data.descripcion}
                                        onChange={(e) => handle(e)}
                                    />
                                </FormControl>
                            </div>     
                            <div className="p-10 flex flex-center">
                                <Button variant="contained" color="primary" type="submit">
                                    Guardar
                                </Button>    
                            </div>                                          
                        </form>
                    </div>
                </Grid>
			}
		/>
	);
}
export default Requerimiento;

/* eslint-disable camelcase */