import axios from 'axios';

export default axios.create({
    // ToDo: get from local storage
    baseURL: 'https://kutt.it',
});
