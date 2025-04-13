import axios from 'axios'

export function Collect(service, params) {
    //let url = process.env.REACT_APP_NOT_SECRET_CODE.concat(service);
    let url = 'http://localhost:4001'.concat(service);

    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            // params,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true
            },
        })
            .then(result => {
                console.log(result.data)
            })
            .catch((error) => {
                reject(error)
            });
    });
}