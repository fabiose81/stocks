import axios from 'axios'

export  function Collect(service) {
    let url = 'http://localhost:4000'.concat(service);

    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true
            },
        })
        .then(result => {
           resolve(result.data)
        })
        .catch((error) => {
            reject(error)
        });
    });
}