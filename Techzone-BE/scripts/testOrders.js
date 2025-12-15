import axios from 'axios';

const run = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:8000/api/auth/login', {
            email: 'admin@techzone.vn',
            password: 'Admin@123'
        });
        const token = loginRes.data.accessToken; // Adjust if the token key is different
        console.log('Login successful. Token obtained.');

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Test Cases
        const testCases = [
            {
                name: 'Pending Orders',
                url: 'http://localhost:8000/api/orders/all/list?page=1&limit=10&orderStatus=pending'
            },
            {
                name: 'Date Range (Dec 14-15)',
                url: 'http://localhost:8000/api/orders/all/list?page=1&limit=10&startDate=2025-12-14&endDate=2025-12-15'
            },
            {
                name: 'Combined Cancelled & Date',
                url: 'http://localhost:8000/api/orders/all/list?page=1&limit=10&orderStatus=cancelled&startDate=2025-11-30&endDate=2025-12-31'
            }
        ];

        for (const test of testCases) {
            console.log(`\nTesting: ${test.name}`);
            console.log(`URL: ${test.url}`);
            try {
                const res = await axios.get(test.url, { headers });
                console.log(`Status: ${res.status}`);
                console.log(`Total: ${res.data.pagination?.total}`);
                console.log(`Returned Items: ${res.data.data?.length}`);
                if (res.data.data?.length > 0) {
                    console.log(`First Order Status: ${res.data.data[0].status}`);
                    console.log(`First Order Created At: ${res.data.data[0].created_at}`);
                }
            } catch (err) {
                console.error(`Failed ${test.name}:`, err.response?.data || err.message);
            }
        }

    } catch (err) {
        if (err.response) {
            console.error('Login Error status:', err.response.status);
            console.error('Error data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Request error:', err.message);
        }
    }
};

run();
