import React from 'react';
import NavBar from '../Components/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

import * as color from '../Assets/Colors/color';

export default function CreateReportScreen() {
  return (
    <div style={{ height: '100vh', backgroundColor: color.darkBackground }}>
      <div style={{ backgroundColor: '#e3f2fd', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='roboto-black' style={{ color: '#42a5f5', fontSize: 45, width: '20%', textAlign: 'left', margin: 10 }}>
          Create New Report
        </div>
      </div>

      <NavBar />

      <div className='middle' style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField id="subject" label="Subject" variant="outlined" style={{ width: '80%', marginBottom: '10px', backgroundColor: color.lightText2, borderWidth: 2, borderRadius: '10px', borderColor: color.secondaryDarkYellow, borderStyle: 'solid', color: color.secondaryDarkYellow }} InputLabelProps={{ style: { fontSize: 18, fontWeight: 'bold', color: color.primaryDarkOrange } }} />
        <TextField
          id="description"
          label="Description"
          multiline
          rows={4}
          variant="outlined"
          style={{ width: '80%', marginBottom: '10px', backgroundColor: color.lightText2, borderWidth: 2, borderRadius: '10px', borderColor: color.secondaryDarkYellow, borderStyle: 'solid', color: color.secondaryDarkYellow }} InputLabelProps={{ style: { fontSize: 18, fontWeight: 'bold', color: color.primaryDarkOrange } }}
        />
        <div style={{ width: '80%', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <Button
            variant="text"
            component="label"
            startIcon={<AttachFileIcon />}
          >
            Attach File
            <input type="file" hidden />
          </Button>
        </div>
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
