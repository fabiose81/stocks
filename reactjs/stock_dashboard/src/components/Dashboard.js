import { useState, Fragment } from 'react';
import { Chart } from 'react-google-charts';
import './Dashboard.css'

const Dashboard = () => {

    var webSocket;
    var connectionInterval;

    const Constants = {
        COLLECT: 'collect',
        COLLECTING: 'collecting...',
        ALERT_DANGER: ' alert-danger',
        ALERT_SUCCESS: ' alert-success',
        BUTTON_BLINK: ' button-blink',
        EMPTY_STRING: '',
        EVENT_COMPLETED: 'COMPLETED',
        EVENT_GPT_ERROR: 'GPT_ERROR',
        EVENT_ERROR: 'ERROR'
    }

    const [alert, setAlert] = useState({
        className: 'alert alert-body',
        label: Constants.EMPTY_STRING,
        hidden: true
    });

    const [button, setButton] = useState({
        className: 'btn-primary btn button-body',
        label: Constants.COLLECT,
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
            switch (event.data) {
                case Constants.EVENT_COMPLETED: {
                    clearInterval(connectionInterval);
                    closeConnectionWS();

                    setCollectRequested({
                        requested: false
                    });

                    setStatusWS({
                        connected: false
                    });

                    setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
                    break;
                }

                case Constants.EVENT_GPT_ERROR: {
                    sendCollect();
                    break;
                }

                case Constants.EVENT_ERROR: {
                    closeConnectionWS();
                    clearInterval(connectionInterval);
                    setAlert(() => changeAlertState(alert.className.concat(Constants.ALERT_DANGER), Constants.EVENT_ERROR, false));
                    setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
                    break;
                }

                default: {
                    const stock = JSON.parse(event.data);
                    const category = stock.category;
                    const result = stock.result;

                    if (result.length > 0) {
                        const dataChart = [['Day', 'Profitability']];
                        result.forEach(r => {
                            const day = r.Month + '/' + r.Year
                            const data = [day, r.Profitability]
                            dataChart.push(data);
                        });

                        setChart(currInputs => [...currInputs,
                        {
                            category: category.name,
                            code: stock.code,
                            name: stock.name,
                        },
                        {

                            data: dataChart
                        }
                        ]);
                    }
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

    const collect = () => {
        setButton(() => changeButtonState(button.className.concat(Constants.BUTTON_BLINK), Constants.COLLECTING, true));
        setAlert(() => changeAlertState(alert.className.replace(Constants.ALERT_DANGER, Constants.EMPTY_STRING), Constants.EMPTY_STRING, true));
        setChart([]);
        openConnectionToWS();
    }

    const ChartFragment = (props) => {
        return (
            <Fragment>
                <div className="row gy-5">
                    <div className="col-6">
                        <div className="p-6">
                            <Chart className={(chart.length - 1) === props.index ? 'li-fade-out' : ''}
                                chartType="LineChart" data={chart[props.index].data}
                                options={{
                                    title: "Company Performance",
                                    legend: { position: "none" },
                                }} />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-6">
                            <h3>{props.category}</h3>
                            <h4>{props.code} - {props.name}</h4>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
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
                        {chart.map((val, index) => <ChartFragment category={val.category} code={val.code} name={val.name} index={index} />)}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Dashboard