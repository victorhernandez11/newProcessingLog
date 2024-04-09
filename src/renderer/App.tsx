import { useEffect, useState } from 'react';
import './App.css';
import { Autocomplete, Checkbox, TextField, Button } from '@mui/material';

interface DataItem {
  Dataset: string;
  ObservationID: number;
  processingCode: string | null;
  submissionChecked: number;
  comment: string;
}

function App() {
  const [data, setData] = useState<{ result: DataItem[] }>({ result: [] });
  const [options, setOptions] = useState<{ value: string; label: string; }[]>([]);

  useEffect(() => {
    fetch('http://localhost:5010/obs/statusUnknown')
      .then(response => response.json())
      .then(data => {
        const updatedData = data.result.map((item: DataItem) => ({
          ...item,
          processingCode: null,
          submissionChecked: false,
          comment: ''
        }));
        setData({ result: updatedData });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  useEffect(() => {
    fetch('http://localhost:5010/obs/statusUnknown')
      .then(response => response.json())
      .then(data => {
        const updatedData = data.result.map((item: DataItem) => ({
          ...item,
          processingCode: null,
          submissionChecked: false,
          comment: ''
        }));
        setData({ result: updatedData });
      })
      .catch(error => console.error('Error fetching data:', error));

    // Fetch options from the API
    fetch('http://localhost:5010/obs/codes')
      .then(response => response.json())
      .then(data => {
        const formattedOptions = data.map((item: { id: number; code: string; description: string; }) => ({
          value: item.code,
          label: item.description
        }));
        setOptions(formattedOptions);
      })
      .catch(error => console.error('Error fetching options:', error));
  }, []);

  const handleSelectChange = (index: number, selectedOptions: ReadonlyArray<{ value: string; label: string; }>) => {
    const updatedData = [...data.result];
    updatedData[index].processingCode = selectedOptions.map(option => option.value).join(', ');
    setData({ result: updatedData });
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updatedData = [...data.result];
    updatedData[index].submissionChecked = checked ? 1 : -1;
    setData({ result: updatedData });
  };

  const handleCommentChange = (index: number, comment: string) => {
    const updatedData = [...data.result];
    updatedData[index].comment = comment;
    setData({ result: updatedData });
  };

  // Function for testing the handleSubmit logic
  const handleSubmit = () => {
    const update = data.result.map((item: DataItem) => ({
      obs_id: item.ObservationID,
      processing_code: item.processingCode ? item.processingCode : null,
      submission_code: item.submissionChecked ? 'submitted' : 'not_submitted',
      comment: item.comment
    }));

    console.log(JSON.stringify({ update }));
  };

  // const handleSubmit = () => {
  //   const update = data.result.map((item: DataItem) => ({
  //     obs_id: item.ObservationID,
  //     processing_code: item.processingCode ? item.processingCode.join(',') : null,
  //     submission_code: item.submissionChecked ? 'submitted' : 'not_submitted',
  //     comment: item.comment
  //   }));

  //   fetch('http://localhost:5010/obs/update', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ update }),
  //   })
  //     .then(response => response.json())
  //     .then(responseData => {
  //       console.log('Submit response:', responseData);
  //     })
  //     .catch(error => {
  //       console.error('Error submitting data:', error);
  //     });
  // };
  // this one is for testing the handleSubmit function

  return (
    <div className="App">
      <div className="title-section">
        <h1 className="title">Processing Log</h1>
        <p className="subtitle">Record the outcomes of your observation processing</p>
      </div>
      <div className='table-container'>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '17.5%' }}>Name</th>
              <th style={{ width: '37.5%' }}>Code</th>
              <th style={{ width: '12.5%' }}>Submit</th>
              <th style={{ width: '32.5%' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {data.result.map((item: DataItem, index: number) => (
              <tr key={index}>
                <td>
                  {item.Dataset.split('_')[0]}
                </td>
                <td>
                  <Autocomplete
                    multiple
                    options={options}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => handleSelectChange(index, newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </td>
                <td>
                  <Checkbox
                    checked={item.submissionChecked === 1}
                    onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                  />
                </td>
                <td>
                  <TextField
                    multiline
                    placeholder="Comments"
                    value={item.comment}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            float: 'right',
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px',
            marginBottom: '80px',
            backgroundColor: '#333333',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#444444',
            },
          }}
        >
          Submit
        </Button>

        <Button
          variant="outlined"
          sx={{
            float: 'right',
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px',
            marginBottom: '80px',
            marginRight: '16px',
            backgroundColor: '#ffffff',
            color: '#333333',
            borderColor: '#333333',
            '&:hover': {
              backgroundColor: '#f0f0f0',
              borderColor: '#888888',
            },
          }}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
}

export default App;


