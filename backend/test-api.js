const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://localhost:4000/api/v1/shops/init-create', {
      name: 'Test Shop',
      ownerId: '000000000000000000000000',
      email: 'test@test.com'
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
})();
