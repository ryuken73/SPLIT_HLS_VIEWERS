import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioButtonsGroup() {
  return (
    <FormControl style={{border: '1px solid white', padding: '1rem'}}>
      <FormLabel style={{ color: 'white' }} id="demo-radio-buttons-group-label">
        Align Title
      </FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="right"
        name="radio-buttons-group"
      >
        <FormControlLabel value="right" control={<Radio />} label="Right" />
        <FormControlLabel value="left" control={<Radio />} label="Left" />
      </RadioGroup>
    </FormControl>
  );
}
