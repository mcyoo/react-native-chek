import axios from 'axios';

const callApi = async (method, path, data, jwt) => {
  const headers = {
    Authorization: jwt,
    'Content-Type': 'application/json',
  };
  const baseUrl = 'http://a0209269538d.ngrok.io'; //to do version url
  const fullUrl = `${baseUrl}${path}`;
  if (method === 'get' || method === 'delete') {
    return axios[method](fullUrl, {headers});
  } else {
    return axios[method](fullUrl, data, {headers});
  }
};

export default {
  urls: token => callApi('get', '/users/token/', '', token),
  register: form => callApi('post', '/users/token/', form),
};
