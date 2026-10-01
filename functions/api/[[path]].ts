import { json } from '../../server/http';

export const onRequest: PagesFunction = () => json({ error: 'API endpoint not found.' }, 404);
