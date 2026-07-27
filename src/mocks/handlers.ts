import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('/api', () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Out Of Service',
    });
  }),
];
