import collect  from './controllers/collector.js'
import result  from './controllers/result.js'

export default function addRoutes(app) {
    app.get('/collect', collect);
    app.get('/result', result);
}