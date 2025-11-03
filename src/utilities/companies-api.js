// frontend/src/utilities/companies-api.js
import sendRequest from './sendRequest';
export const getCompanies = () => sendRequest('/companies/');
export const createCompany = (data) => sendRequest('/companies/', 'POST', data);