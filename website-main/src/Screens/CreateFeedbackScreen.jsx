import React from 'react';
import NavBar from '../Components/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import * as color from '../Assets/Colors/color';

export default function CreateFeedbackScreen() {
  return (
    <div style={{ height: '100vh', backgroundColor: color.darkBackground }}>
      <div style={{ backgroundColor: '#e3f2fd', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='roboto-black' style={{ color: '#42a5f5', fontSize: 45, width: '20%', textAlign: 'left', margin: 10 }}>
          Create New Feedback
        </div>
      </div>

      <NavBar />

      <div className='middle' style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          id="feedback"
          label="Feedback"
          multiline
          rows={6}
          variant="outlined"
          style={{ width: '80%', marginBottom: '10px', backgroundColor: color.lightText2, borderWidth: 2, borderRadius: '10px', borderColor: color.secondaryDarkYellow, borderStyle: 'solid', color: color.secondaryDarkYellow }}
          InputLabelProps={{ style: { fontSize: 18, fontWeight: 'bold', color: color.primaryDarkOrange } }}
        />
        <div style={{ width: '80%', marginBottom: '10px', color: color.primaryDarkOrange, textAlign: 'left', fontSize: 18, fontWeight: 'bold' }}>
          Anonymous:
        </div>
        <FormControl component="fieldset" style={{ width: '80%', marginBottom: '10px' }}>
          <RadioGroup aria-label="Anonymous" name="anonymous" style={{ flexDirection: 'row' }}>
          <FormControlLabel value="Yes" control={<Radio style={{ color: color.primaryDarkOrange }} />} label="Yes" style={{ color: color.secondaryDarkYellow }} />
            <FormControlLabel value="No" control={<Radio style={{ color: color.primaryDarkOrange }} />} label="No" style={{ color: color.secondaryDarkYellow }} />
          </RadioGroup>
        </FormControl>
        <div style={{ width: '80%', marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
