import express, {Express} from 'express';
import env from '@/env';
import {getContacts,createContact} from '@/controllers/contacts';
import {errorHandler} from '@/middlewares/errorHandler';

const app: Express = express();

app.use(express.json());


app.get('/', (req, res) => res.send('Hello World'));

app.route('/contacts').get(getContacts).post(createContact)


// Route not found handler, must be the last route and before the global error handler, It will handle all routes that are not found
app.all('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler, must be the last middleware, It will handle all errors
app.use(errorHandler);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});




