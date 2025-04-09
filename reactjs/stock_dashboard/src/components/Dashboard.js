import { useState,  Fragment } from 'react';
import { Chart } from 'react-google-charts';
import { Collect } from '../services/Collect'
import './Dashboard.css'

const Dashboard = () => {

    var webSocket;
    var connectionInterval;

    const Constants = {
        COLLECT: 'collect',
        COLLECTING: 'collecting...',
        ALERT_DANGER: ' alert-danger',
        BUTTON_BLINK: ' button-blink',
        EMPTY_STRING: ''
    }

    const [alert, setAlert] = useState({
        className: 'alert alert-body',
        label: '',
        hidden: true
    });

    const [button, setButton] = useState({
        className: 'btn-primary btn button-body',
        label: 'collect',
        disabled: false
    });

    const [collectRequested, setCollectRequested] = useState({
        requested: false
    });

    const [statusWS, setStatusWS] = useState({
        connected: false
    });

    const [chart, setChart] = useState([]);

    const changeAlertState = (className, label, hidden) => {
        return {
            className: className,
            label: label,
            hidden: hidden
        }
    }

    const changeButtonState = (className, label, disabled) => {
        return {
            className: className,
            label: label,
            disabled: disabled
        }
    }

    const openConnectionToWS = () => {
        if (!webSocket) {
            webSocket = new WebSocket('ws://localhost:8080');
        }

        webSocket.onopen = () => {
            console.log('Connected to server');

            listenMessageFromWS();
            checkConnection();

            setStatusWS({
                connected: true
            });

            if (!collectRequested.requested) {
                sendCollect();
                setCollectRequested({
                    requested: true
                });
            }
        };
    }

    const closeConnectionWS = () => {
        webSocket.close();
        webSocket.onclose = () => {
            console.log('Connection to server closed');
            setStatusWS({
                connected: false
            });
            setCollectRequested({
                requested: false
            });
        };
    }

    const checkConnection = () => {
        connectionInterval = setInterval(() => {
            if (webSocket.readyState === WebSocket.CLOSED && !statusWS.connected) {
                openConnectionToWS();
            }
        }, 1000);
    }

    const listenMessageFromWS = () => {
        webSocket.onmessage = (event) => {
            if (event.data === 'COMPLETED') {
                clearInterval(connectionInterval);
                closeConnectionWS();

                setCollectRequested({
                    requested: false
                });

                setStatusWS({
                    connected: false
                });

                setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
            } else if (event.data === 'GPT ERROR') {
                sendCollect();
            } else if (event.data === 'ERROR') {
                //do nothing
            } else {
                const stock = JSON.parse(event.data);
                const result = stock.stock.result;

                if (result.length > 0) {
                    const dataChart = [['Day', 'Profitability']];
                    result.forEach(r => {
                        const day = r.Day + '/' + r.Month + '/' + r.Year
                        const data = [day, r.Profitability]
                        dataChart.push(data);
                    });

                    setChart(currInputs => [...currInputs, { g: dataChart }]);
                    setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
                }
            }
        };
    }

    const sendCollect = () => {
        const message = JSON.stringify({
            period: '1y',
            interval: '1mo'
        });

        webSocket.send(message);
    }

    const ChartFragment = (props) => {
        return (
            <Fragment>
                <div className="row gy-5">
                    <div className="col-6">
                        <div className="p-6">
                            <Chart chartType="LineChart" data={chart[props.index].g} options={{
                                title: "Company Performance",
                                legend: { position: "none" },
                            }} />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }


    const collect = () => {
        setButton(() => changeButtonState(button.className.concat(Constants.BUTTON_BLINK), Constants.COLLECTING, true));
        openConnectionToWS();

        //    Collect('/collect').then(result => {
        //     // if (result.status === 200) {
        //     //     // check();
        //     // } else {
        //     //     setAlert(() => changeAlertState(alert.className.concat(Constants.ALERT_DANGER), result.message, false));
        //     //     setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
        //     // }
        // });


        // setAlert(() => changeAlertState(alert.className.replace(Constants.ALERT_DANGER, Constants.EMPTY_STRING), Constants.EMPTY_STRING, true));
        // 


        // Collect('/collect/', params).then(result => {
        //     if (result.status === 200) {
        //         // check();
        //     } else {
        //         setAlert(() => changeAlertState(alert.className.concat(Constants.ALERT_DANGER), result.message, false));
        //         setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
        //     }
        // });
    }

    return (
        <div className="main text-center">
            <div className="row">
                <div className="col">
                    <div className="p-3">
                        <div className={alert.className} hidden={alert.hidden} role="alert">{alert.label}</div>
                        <button className={button.className} onClick={collect} disabled={button.disabled}>{button.label}</button><br />
                    </div>
                </div>
            </div>
            <div id="chart">
                <ul style={{ listStyle: "none" }}>
                    <li>
                        {chart.map((num, index) => <ChartFragment index={index} />)}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Dashboard