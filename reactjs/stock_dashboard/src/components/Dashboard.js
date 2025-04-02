import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Chart } from 'react-google-charts';
import { Collect } from '../services/Collect'
import './Dashboard.css'

const Dashboard = () => {

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

    const Constants = {
        COLLECT: 'collect',
        COLLECTING: 'collecting...',
        ALERT_DANGER: ' alert-danger',
        BUTTON_BLINK: ' button-blink',
        EMPTY_STRING: ''
    }

    var resultInterval;
    var stockResult = [];

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

    const collect = () => {
        setAlert(() => changeAlertState(alert.className.replace(Constants.ALERT_DANGER, Constants.EMPTY_STRING), Constants.EMPTY_STRING, true));
        setButton(() => changeButtonState(button.className.concat(Constants.BUTTON_BLINK), Constants.COLLECTING, true));

        Collect('/collect')
            .then(result => {
                if (result.status === 200) {
                    check();
                } else {
                    setAlert(() => changeAlertState(alert.className.concat(Constants.ALERT_DANGER), result.message, false));
                    setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
                }
            });
    }

    //todo refactory method
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
                            chart.render(<Chart chartType="LineChart" data={stockResult} options={{
                                title: "Company Performance",
                                legend: { position: "none" },
                              }}/>);

                            setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
                        } else {
                            check();
                        }
                    } else {
                        clearInterval(resultInterval);
                        setAlert(() => changeAlertState(alert.className.concat(Constants.ALERT_DANGER), result.message, false));
                        setButton(() => changeButtonState(button.className.replace(Constants.BUTTON_BLINK, Constants.EMPTY_STRING), Constants.COLLECT, false));
                    }
                }
            });
    }

    return (
        <div className="main text-center">
            <div className="row">
                <div className="col">
                    <div className="p-3">
                        <div className={alert.className} hidden={alert.hidden} role="alert">{alert.label}</div>
                        <button className={button.className} onClick={collect} disabled={button.disabled}>{button.label}</button>
                    </div>
                </div>
            </div>
            <div className="row gy-5">
                <div className="col-6">
                    <div id="chart" className="p-3">

                    </div>
                </div>
                <div className="col-6">
                    {/* <div id="chart" className="p-3">
                        
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Dashboard