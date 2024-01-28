import React, { Component, useState } from 'react';
import {AgGridReact} from 'ag-grid-react'
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "./index.css"; // Theme

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    //this.formatDate("2016-05-18")


    const [rowData, setRowData] = useState([
      {make: 'Ford', model: 'Focus', price: 40000},
      {make: 'Toyota', model: 'Celica', price: 45000},
      {make: 'BMW', model: '4 Series', price: 50000}
    ])

    const [columnDef, setColumnDef] = useState([
      {field: 'make'},
      {field: 'model'},
      {field: 'price'}
    ])
  }

  
  render() {
    return(
      
      <div className="ag-theme-quartz" style={{ height: 500 }}>

      <input
        type="range"
        min="1"
        max="5"
        value="1"
        //onChange={handleSliderChange}
      />

        <AgGridReact
        rowData={this.rowData}
        columnDefs={this.columnDef}/>
      </div>
    )

  }

  formatDate(inputDate) {
    const options = { weekday: 'long' };
    const date = new Date(inputDate);
    const day = new Intl.DateTimeFormat('en-US', options).format(date);
  
    // Get the day of the month and add "st", "nd", "rd", or "th" based on the day
    const dayOfMonth = date.getDate();
    let daySuffix = 'th';
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      daySuffix = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      daySuffix = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      daySuffix = 'rd';
    }
  
    return `${day} ${dayOfMonth}${daySuffix}`;
  }


  fetchData(){
    return [
      {
      "Date": "2016-05-18",
      "HoursAvailable": [9, 10, 11, 12, 13, 14, 17]
      },
      {
      "Date": "2016-05-19",
      "HoursAvailable": [9, 10, 11, 12, 13, 14, 15, 16, 17]
      },
      {
      "Date": "2016-05-20",
      "HoursAvailable": [9, 10, 14, 15, 16, 17]
      },
      {
      "Date": "2016-05-21",
      "HoursAvailable": [9, 10, 11, 12, 13]
      },
      {
      "Date": "2016-05-23",
      "HoursAvailable": [13, 14, 15, 16]
      },
      {
      "Date": "2016-05-24",
      "HoursAvailable": [11, 12, 15, 16, 17]
      }
      ]
  }

  
}