import express, {Express} from 'express';
import env from '@/env';
import {getContacts,createContact} from '@/controllers/contacts';
import {errorHandler} from '@/middlewares/errorHandler';

const app: Express = express();


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.route('/contacts').get(getContacts).post(createContact)


app.all('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

app.use(errorHandler);

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});




