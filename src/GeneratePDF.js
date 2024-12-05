
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useForm } from "react-hook-form";
import React, { useState } from 'react';
import './GeneratePDF.css';  
import axios from 'axios';

const sendPDFToBackend = (pdfBlob,email) => {
  const formData = new FormData();
  formData.append("pdf", pdfBlob, "invoice.pdf"); 
  formData.append("email",email );  
  formData.append("subject", "Invoice from Demeter");  
  formData.append("message", "Hello , this invoice is for you !"); 

  axios.post("http://ronsky.ro:5000/send-email", formData)
    .then(response => {
      alert(response.data);
    })
    .catch(error => {
      alert(error);
    });
};
const insertTable = (doc, parameter) => {
  const columns = ["Item", "Quantity", "Price", "Total"];
  let data = parameter.table;
  console.log(data);

  let rez = 0;

  data.forEach(item => {
    const price = parseFloat(item.price);
    const quantity = parseFloat(item.quantity);

    if (!isNaN(price) && !isNaN(quantity)) {
      item.total = quantity * price;
      rez += item.total;

 
      item.price = `${price.toFixed(2)} €`;
      item.total = `${item.total.toFixed(2)} €`;
    } else {

      item.price = "0.00 €";
      item.total = "0.00 €";
    }
  });

  data.push({
    item: "",
    quantity: "",
    price: "TOTAL",
    total: `${rez.toFixed(2)} €` 
  });


  doc.autoTable({
    head: [columns],
    body: data.map(item => [item.item, item.quantity, item.price, item.total]), 
    theme: "grid",
    headStyles: { fillColor: [200, 200, 200] },
    styles: { cellPadding: 1, fontSize: 12, halign: 'center' },
    startY: doc.autoTable.previous.finalY + 63,
  });
};
const GeneratePDF = () => {
  const handleGeneratePDF = (parameter) => {
    const date = parameter.data;
    const var1 = parameter.name;
    const varNumberInvoice =parameter.numberInvoice;
    const varNumberOfViolin = parameter.numberOfViolin;
    const varNumberOfViola = parameter.numberOfViola;
    const varNumberOfCello = parameter.numberOfCello;
    const varNumberOfKontrabass = parameter.numberOfKontrabass;
    


    const text1 = "Demeter Violines S.R.L \nAnghel Alin Demeter \nIbanesti 623A \n545300 Reghin \nTel:+40746914263Romania";
    const text2 = "The invoice amount is payable and becomes due immediately on receipt of delivery/ the invoice. \nThank you for your order";
    const doc = new jsPDF();
    const tableRows = [[text1, date]];

    doc.setFont("plain", "normal");
    doc.setFontSize(12);

    doc.autoTable({
      body: tableRows,
      startY: 20,
      theme: 'plain',
      styles: {
        cellPadding: 5,
        lineWidth: 0, 
        lineColor: [255, 255, 255], 
      },
      columnStyles: {
        0: { halign: 'left' }, 
        1: { halign: 'center' },
      },
      margin: { top: 10 },
    });

    doc.setFont("plain", "normal"); 
    doc.setFontSize(12);
    doc.text(var1, 20, 55);

    doc.setFont("plain", "normal");
    doc.setFontSize(12);
    doc.text(var1, 20, 55);

    doc.setFont("plain", "bold");
    doc.setFontSize(14);
    doc.text("Invoice No.: " + varNumberInvoice, 20, 80);

    doc.setFont("plain", "normal");  
    doc.setFontSize(12);
    doc.text("You have ordered: ", 20, 85);
    doc.text("  Violin " + varNumberOfViolin + " Pcs", 20, 90);
    doc.text("  Viola " + varNumberOfViola + " Pcs", 20, 95);
    doc.text("  Cello " + varNumberOfCello + " Pcs", 20, 100);
    doc.text("  Kontrabass " + varNumberOfKontrabass + " Pcs", 20, 105);
    
    doc.setFont("plain", "normal");  
    doc.setFontSize(12);
    doc.text(text2, 20, 200);

    doc.setFont("plain", "bold");  
    doc.setFontSize(14);
    doc.text(parameter.info, 20, 215);

    doc.setFont("plain", "normal");  
    doc.setFontSize(12);

    doc.text("Payment:", 60, 235);
    doc.text("UniCredit Bank \nStr:Mihai Viteazul \nNR: 11 REGHIN ", 110, 235);

    doc.text("BIC (Swift) \nAccount/Iban ", 60, 255);
    doc.text("BACXROBU \nRO42BACX0000002252335002", 110, 255);

    doc.text("Wat Nr:RO3611082", 60, 270);
    doc.setFont("plain", "bold");  
    doc.text("USt-IdNr: "+parameter.ust, 110, 270);


    
    insertTable(doc,parameter);
   
    const pdfOutput = doc.output('blob');
    sendPDFToBackend(pdfOutput,parameter.email);
    //doc.save("tabel.pdf");
    setFormData(initialFormData);
  };
  const [rowTable, setRowTable] = useState(1);
  const row = [];

  const initialFormData = {
    email: '',
    name: '',
    data: '',
    table: [],
    numberInvoice: '',
    numberOfViolin: 0,
    numberOfKontrabass: 0,
    numberOfViola: 0,
    numberOfCello: 0,
    info: "",
    ust: "",
  };

  const [formData, setFormData] = useState(initialFormData);



 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.table(formData);
    console.log(formData)
    handleGeneratePDF(formData)





  };
  const addRow = () => {
    setFormData({
      ...formData,
      table: [...formData.table, { item: '', quantity: '', price: '' }],
    });
  };

  const removeRow = (index) => {
    const newTable = formData.table.filter((_, i) => i !== index);
    setFormData({ ...formData, table: newTable });
  };
  const handleChange = (e, index) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const newTable = [...prevData.table];
      newTable[index] = {
        ...newTable[index],
        [name]: value.trim(),
      };
  
      return {
        ...prevData,
        table: newTable,
      };
    });
  };

  const handleChangeNormal = (e) => {
    const { name, value } = e.target;
  

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  
    }));
  };



  return (
    <>
      <div >
        <form
          onSubmit={handleSubmit}
          className="formular"
        >
          <div className="input-container">
            <label htmlFor="email">Client email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChangeNormal}
              placeholder="Email"
            />
          </div>
        
          {/* Nume */}
          <div className="input-container">
            <label htmlFor="name">Name</label>
            <textarea
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChangeNormal}
              placeholder="Name"
            />
          </div>

          {/* Data */}
          <div className="input-container">
            <label htmlFor="data">Data</label>
            <input
              type="text"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChangeNormal}
              placeholder="Data"
            />
          </div>

          {/* Numar Factura */}
          <div className="input-container">
            <label htmlFor="numberInvoice">No. invoice</label>
            <input
              type="text"
              id="numberInvoice"
              name="numberInvoice"
              value={formData.numberInvoice}
              onChange={handleChangeNormal}
              placeholder="No. invoice"
            />
          </div>

          
      
          <div className="input-container">
            <label htmlFor="info">Info</label>
            <textarea
              type="text"
              id="info"
              name="info"
              value={formData.info}
              onChange={handleChangeNormal}
              placeholder="(cash/card)"
            />
          </div>

          <div className="input-container">
            <label htmlFor="ust">USt-IdNr</label>
            <input
              type="text"
              id="ust"
              name="ust"
              value={formData.ust}
              onChange={handleChangeNormal}
              placeholder="USt-IdNr:"
            />
          </div>


          <div className="subDiv">
            {/* Numar vioara */}
            <div className="input-container">
              <label htmlFor="numberOfViolin">Number of Violin</label>
              <input
                type="text"
                id="numberOfViolin"
                name="numberOfViolin"
                value={formData.numberOfViolin}
                onChange={handleChangeNormal}
                placeholder="Number of Violin"
              />
            </div>

            <div className="input-container">
              <label htmlFor="numberOfViola">Number of Viola</label>
              <input
                type="text"
                id="numberOfViola"
                name="numberOfViola"
                value={formData.numberOfViola}
                onChange={handleChangeNormal}
                placeholder="Number of Viola"
              />
            </div>


            <div className="input-container">
              <label htmlFor="numberOfCello">Number of Cello</label>
              <input
                type="text"
                id="numberOfCello"
                name="numberOfCello"
                value={formData.numberOfCello}
                onChange={handleChangeNormal}
                placeholder="Number of Cello"
              />
            </div>

            <div className="input-container">
              <label htmlFor="numberOfKontrabass">Number of Kontrabass</label>
              <input
                type="text"
                id="numberOfKontrabass"
                name="numberOfKontrabass"
                value={formData.numberOfKontrabass}
                onChange={handleChangeNormal}
                placeholder="Number of Kontrabass"
              />
            </div>
            </div>
            <div className="subDivTable">
              {formData.table.map((row, index) => (
                <div className="itemRow" key={index}>
                  <div className="input-container">
                    <label htmlFor="item">Item</label>
                    <input
                      type="text"
                      name="item"
                      value={row.item}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Item"
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="text"
                      name="quantity"
                      value={row.quantity}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Quantity"
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="price">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={row.price}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Price"
                    />
                  </div>

                  <button className="delete" type="button" onClick={() => removeRow(index)}>Remove Row</button>
                </div>
              ))}
              <button className="addRow"  type="button" onClick={addRow}>Add Row</button>

            </div>

          

          <button type="submit">Trimite</button>
        </form>
      </div>
    </>
  );
};


export default GeneratePDF;