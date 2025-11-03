// frontend/src/utilities/events-api.js
import sendRequest from './sendRequest';
export const getEvents = () => sendRequest('/events/');
export const createEvent = (data) => sendRequest('/events/', 'POST', data);