import twilio from 'twilio';
import { config } from 'dotenv';

config();

export const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
