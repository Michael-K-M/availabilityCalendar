import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import "./index.css"; // Theme

// creating the components for the table
const CalendarComponet = () => {
  const todayDate = '2016-05-18'
  const [selectedValue, setSelectedValue] = useState(1);
  //mapping the int value to the display value
  const timeTable = {
    9: "09:00-10:00",
    10: "10:00-11:00",
    11: "11:00-12:00",
    12: "12:00-13:00",
    13: "13:00-14:00",
    14: "14:00-15:00",
    15: "15:00-16:00",
    16: "16:00-17:00",
    17: "17:00-18:00"
  }

  // change colour for the cells 
  const cellRules = {
    "cell-full": params => params.value === "FULL",
    "cell-unavalible": params => params.value === "UNAVAILABLE",
    "cell-avalible": params => params.value === "AVAILABLE",
    "cell-selected": params => params.value === "SELECTED"
  };

  // create arrays with modified data adding short date
  const modifiedData = []
  // Dynamacly creates the colomn headers
  const colDefs = [];
  GenerateGrid();
  // Dynamacly creates row data into the table based on allocated hours
  const [rowData, setRowData] = useState(UpdateColumns(selectedValue));



  function UpdateColumns(selectedLength){
    let newGridData = []
    // Index represents the available hours
    for (let index = 9; index < 18; index++) {
        
      let dataToDisplay = {Time: timeTable[index]};
      
      modifiedData.forEach(data => {
        dataToDisplay[data["ShortDate"]] = CheckSlotAvailability(index, selectedLength, data["Date"], data['HoursAvailable'])
      });
      newGridData.push(dataToDisplay);
    }

    return newGridData
  }

  function GenerateGrid(){
    const existingData = 
    [
      {
      "Date": "2016-05-18",
      "HoursAvailable": [9, 10, 11, 12, 13, 14, 17]
      },
      {
      "Date": "2016-05-19",
      "HoursAvailable": [9, 10, 11, 12, 14, 15, 16, 17]
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

      existingData.forEach(data => {
        modifiedData.push({'ShortDate': formatDate(data['Date']), 'Date': data['Date'], 'HoursAvailable': data['HoursAvailable']});
      });

      //Generate table header columns
      colDefs.push({field: 'Time',  headerClass: 'hidden-header'});

      modifiedData.forEach(data => {
        colDefs.push({field: data['ShortDate'], cellClassRules: cellRules});
      });
  }

  function CheckSlotAvailability(time, jobLength, date, availability){
        
    let index = availability.indexOf(time);

    if(index === -1)
    {
        return "FULL";
    }

    let preBuffer = time === 9|| time === 17? 0:1;
    let postBuffer = time === 9|| time === 17? 0:1;

    if(date === todayDate) //currentDate
    {
        preBuffer += 1;
    }

    // Validate pre buffer
    if(index - preBuffer <= -1 || availability[index - preBuffer] !== time - preBuffer)
    {
        return "UNAVAILABLE";
    }
    
    // -1 to joblength as the first cell already counts as 1h
    if(index + jobLength-1 + postBuffer >= availability.length || availability[index + jobLength -1 + postBuffer] !== time + jobLength-1 + postBuffer)
    {
        return "UNAVAILABLE";
    }

    return "AVAILABLE";
  }

  function formatDate(inputDate) {
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


  const cellClicked = useCallback( params => {
    let columnIndex = params.api.getFocusedCell().column.instanceId
    let rowIndex = params.rowIndex
    
    if(columnIndex === 0)
    return

    let dataOnGrid = UpdateColumns(selectedValue)

    let shortDate = modifiedData[columnIndex-1].ShortDate
    
    let value = dataOnGrid[rowIndex][shortDate]

    if(value === "AVAILABLE"){

    let time = null;
    for (const key in timeTable) {
      if (timeTable[key] === dataOnGrid[rowIndex]["Time"]) {
        time = parseInt(key);
        break; // Stop the loop when a match is found
      }
    }

    let preBuffer = time === 9|| time === 17? 0:1;
    let postBuffer = time === 9|| time === 17? 0:1;

    if(modifiedData[columnIndex-1].Date === todayDate)
        preBuffer += 1;
    

    for (let index = time-preBuffer; index < time + selectedValue + postBuffer; index++) {
      dataOnGrid[index-9][shortDate] = "SELECTED"
    }
  }
    
    setRowData(dataOnGrid)
  })

  const getRowId = useCallback( params => {
    return params.data.Time
  })

  // update selected hours based on slider
  const handleSliderChange = (event) => {
    setSelectedValue(parseInt(event.target.value));
    setRowData(UpdateColumns(parseInt(event.target.value)));
  };

  // Render Grid to HTML
  return (
    <div style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div>
          <label htmlFor="slider">Step 1. Use the slider to esitmate how long the job will take.</label>
          <p>{selectedValue} HR/s</p>
          <input
            type="range"
            id="slider"
            min="1"
            max="5"
            step="1"
            value={selectedValue}
            onChange={handleSliderChange}
          />
        </div>
      <div
        className={
          "ag-theme-quartz"
        }
        style={{ width: '100%', height: 500 }}>
          <label htmlFor="agGrid">Step 2. Select an arrival time</label>
        <AgGridReact id="agGrid" rowData={rowData} columnDefs={colDefs} getRowId={getRowId} onCellClicked={cellClicked} rowSelection='single'/>
      </div>
    </div>
  );
};

//Find Element Root and render CalendarComponet
const root = createRoot(document.getElementById('root'));
root.render(<CalendarComponet />);