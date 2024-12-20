
import './History.css';
import React, { useState,useEffect  } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';


function History() {
      const[value,setValue]=useState([]);
    const link="http://ronsky.ro:5000/invoices";
    //const link="http://localhost:3000/invoices";

    useEffect(() => {
        axios.get(link)
          .then(response => {
            const sortedValue = response.data.invoices.sort((a, b) => b.id - a.id);
            setValue(sortedValue);
            
          })
          .catch(error => {
            alert("Something went wrong!!!");
          });
      }, []);

      const openInvoiceLink = (invoiceId) => {
        const link = `http://ronsky.ro:5000/invoice/${invoiceId}`;
        window.open(link, '_blank');
      };

      const handlerButton = (id)=>{
        openInvoiceLink(id);
    }

  return (
    <div className="container">
          {value.map((item, index) => (
          <div key={index} className='row'>
            <p>{item.name}</p>
            <p>{item.date}</p>
            <Button  className="bpdf" icon="pi pi-file-pdf"  onClick={()=>handlerButton(item.id)}/>
          </div>
        ))}
    </div>
  );
}

export default History;
