import { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import './Dashboard.css'

const Dashboard = () => {

    var webSocket;
    var connectionInterval;
    var index = 0;

    const Constants = {
        COLLECT: 'collect',
        COLLECTING: 'collecting...',
        CONNECTION_CLOSED: 'Connection closed!',
        DEFINE_PERIOD_INTERVAL: 'Define a Period and/or Interval!',
        ALERT_DANGER: ' alert-danger',
        ALERT_SUCCESS: ' alert-success',
        BUTTON_BLINK: ' button-blink',
        EMPTY_STRING: '',
        EVENT_COMPLETED: 'COMPLETED',
        EVENT_GPT_ERROR: 'GPT_ERROR',
        EVENT_ERROR: 'ERROR'
    }

    const [period, setPeriod] = useState('');
    const [interval, setInterval] = useState('');

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
    const [visibleChart, setVisibleChart] = useState([]);

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
                setAlert(() => changeAlertState(alert.className.concat(Constants.ALERT_DANGER), Constants.CONNECTION_CLOSED, false));
                clearInterval(connectionInterval);
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
                    const stocks = JSON.parse(event.data);
                    const data = [];

                    stocks.forEach(stock => {
                        const category = stock.category;
                        const result = stock.result;

                        const dataChartColumn = [['Day', 'Dividends', { role: "style" }]];
                        const dataChartLine = [['Day', 'Profitability']];
                        result.forEach(r => {
                            const day = (interval === '1d' ? r.Day + '/' : '') + r.Month + '/' + r.Year.toString()
                            const color = (r.Dividends > 0 ? '#3cb371' : '#ff0000')
                            const dataForColumn = [day, r.Dividends, color]
                            const dataForLine = [day, r.Profitability]
                            dataChartColumn.push(dataForColumn);
                            dataChartLine.push(dataForLine);
                        });

                        data.push({
                            title: stock.code + ' - ' + stock.name + ' [' + category.name + ']',
                            dataChartColumn: dataChartColumn,
                            dataChartLine: dataChartLine
                        })
                    });
                    setChart(data)
                }
            }
        };
    }

    const sendCollect = () => {
        const message = JSON.stringify({
            period: period,
            interval: interval
        });

        webSocket.send(message);
    }

    const collect = () => {
        if (period && interval) {
            console.log({
                period: period,
                interval: interval
            })
            setButton(() => changeButtonState(button.className.concat(Constants.BUTTON_BLINK), Constants.COLLECTING, true));
            setAlert(() => changeAlertState(alert.className.replace(Constants.ALERT_DANGER, Constants.EMPTY_STRING), Constants.EMPTY_STRING, true));
            setChart([]);
            setVisibleChart([]);
            index = 0;
            openConnectionToWS();
        } else {
            setAlert(() => changeAlertState(alert.className.concat(Constants.ALERT_DANGER), Constants.DEFINE_PERIOD_INTERVAL, false));
        }

    }

    useEffect(() => {
        if (chart.length > 0) {
            const i = setInterval(() => {
                setVisibleChart((prev) => [...prev, chart[index++]]);

                if (chart.length === index) {
                    clearInterval(i);
                    setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
                }
            }, 1000)
        }
    }, [chart])

    return (
        <div className="main text-center">
            <div className="row">
                <div className="col">
                    <div className={alert.className} hidden={alert.hidden} role="alert">{alert.label}</div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <label>Period: </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptionsPeriod" id="inlineRadioOneYear" value="1y" onChange={e => setPeriod(e.target.value)} />
                        <label className="form-check-label" htmlFor="inlineRadioOneYear">1 year</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptionsPeriod" id="inlineRadioThreeYear" value="3y" onChange={e => setPeriod(e.target.value)} />
                        <label className="form-check-label" htmlFor="inlineRadioThreeYear">3 years</label>
                    </div>
                </div>

                <div className="col">
                    <div className="form-check form-check-inline">
                        <label>Interval: </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptionsInterval" id="inlineRadioByDay" value="1d" onChange={e => setInterval(e.target.value)} />
                        <label className="form-check-label" htmlFor="inlineRadioByDay">By day</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptionsInterval" id="inlineRadioByMonth" value="1mo" onChange={e => setInterval(e.target.value)} />
                        <label className="form-check-label" htmlFor="inlineRadioByMonth">By month</label>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="p-3">
                        <button className={button.className} onClick={collect} disabled={button.disabled}>{button.label}</button><br />
                    </div>
                </div>
            </div>
            <div id="chart">
                <ul style={{ listStyle: "none" }}>
                    {
                        visibleChart.map((item, index) => (
                            <li key={index} className="li-fade-out">
                                <div className="row">
                                    <div className="col">
                                        <span>{item.title}</span>
                                    </div>
                                </div>
                                <div className="row row-cols-2 text-bg-light p-3">
                                    <div className="col">
                                        <Chart
                                            chartType="ColumnChart" data={item.dataChartColumn}
                                            options={{
                                                legend: { position: "none" },
                                                hAxis: { textPosition: 'none' }
                                            }} />
                                    </div>
                                    <div className="col">
                                        <Chart
                                            chartType="LineChart" data={item.dataChartLine}
                                            options={{
                                                legend: { position: "none" },
                                                hAxis: { textPosition: 'none' }
                                            }} />
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default Dashboard