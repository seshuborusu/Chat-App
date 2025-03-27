import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '',
  boxShadow: 24,
  p: 4, 
  
};

export default function Successmodal({ modelo, closeModel }) {
  return (
    <Modal
      open={modelo}  // Modal will open when 'modelo' is true
      onClose={closeModel}  // Close the modal when clicked outside or pressing ESC
    >
      <Box sx={style} className="text-center text-success rounded-3">
        <Typography variant="h6" component="h6" fontSize={"19px"} className='fw-bold' >
          Registration Successfull
        </Typography>

        <button className='mt-3 px-3 p-1 rounded-2' onClick={closeModel}>Login</button> {/* Close button to trigger modal closing */}
      </Box>
    </Modal>
  );
}
