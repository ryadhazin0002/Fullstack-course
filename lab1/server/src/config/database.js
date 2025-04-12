import 'dotenv/config';

// This file is used to configure the database connection
export const config = {
    mongoURI: process.env.CONNECTION_URL
}