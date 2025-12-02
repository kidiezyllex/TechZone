import axios from 'axios';

const run = async () => {
  try {
    const res = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'admin@techzone.vn',
      password: 'Admin@123'
    });

    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Request error:', err.message);
    }
    process.exitCode = 1;
  }
};

run();


