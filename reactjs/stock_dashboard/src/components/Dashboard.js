import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Chart } from 'react-google-charts';
import { Collect } from '../rest/Collect'

const Dashboard = () => {

    var resultInterval;
    var stockResult = [];

    const [alert, setAlert] = useState({
        text: '',
        hidden: true
    });

    const [button, setButton] = useState({
        text: 'collect',
        status: false
    });

    const collect = () => {
        setAlert(previousState => {
            return { ...previousState, text: '', hidden: true }
        });
        setButton(previousState => {
            return { ...previousState, text: "collecting...", status: true }
        });

        Collect('/collect')
            .then(result => {
                if (result.status === 200) {
                    resultInterval = setInterval(() => {
                        check();
                    }, 1000)
                } else {
                    setAlert(previousState => {
                        return { ...previousState, text: result.message, hidden: false }
                    });
                    setButton(previousState => {
                        return { ...previousState, text: "collect", status: false }
                    });
                }
            });
    }

    //todo error check
    const check = () => {
        Collect('/result')
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        const stocks = result.message;
                        if (stocks.length > 0) {
                            clearInterval(resultInterval);
                            stockResult = [['Day', 'Profitability']];

                            stocks.forEach(stock => {
                                stock.result.forEach(r => {
                                    const day = r.Day + '/' + r.Month + '/' + r.Year
                                    const data = [day, r.Profitability]
                                    stockResult.push(data);
                                });
                            });

                            const chart = createRoot(
                                document.getElementById('chart')
                            );
                            chart.render(<Chart chartType="LineChart" data={stockResult} />);

                            setButton(previousState => {
                                return { ...previousState, text: "collect", status: false }
                            });
                        }
                    } else {
                        clearInterval(resultInterval);
                        setButton(previousState => {
                            return { ...previousState, text: "collect", status: false }
                        });
                        setAlert(previousState => {
                            return { ...previousState, text: result.message, hidden: false }
                        });
                    }
                }
            });
    }

    return (
        <>
            <h1>Dashboard</h1>
            <div className="alert alert-danger" role="alert" hidden={alert.hidden}>
                {alert.text}
            </div>
            <button id="collectButton" type="button" className="btn btn-primary" onClick={collect} disabled={button.status}>
                <span id="spinner" className="spinner-grow spinner-grow-sm" aria-hidden="true" hidden={!button.status}></span>
                <span id="collectLabel" role="status">{button.text}</span>
            </button>
            <br />

            <div id="chart" className="py-10"></div>
        </>
    )
}

export default Dashboard