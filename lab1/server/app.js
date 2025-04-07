import {app} from './src/express.js'
import 'dotenv/config.js';



// Start Server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

