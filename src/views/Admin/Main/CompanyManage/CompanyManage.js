import React, { useState, useEffect } from 'react';

import checkValidation from '../../../../utility/checkValidation';
import axios from '../../../../axios';
import Input from '../../../../components/UI/Input/Input';
import CanvasJSReact from '../../../../assets/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const companyManage = () => {
     const [formData, setFormData] = useState({
          reportType: {
               elementType: 'select',
               elementConfig: {
                    label: 'Report data',
                    options: [
                         { value: 0, displayValue: 'Tasks' },
                         { value: 2, displayValue: 'Users' },
                    ],
               },
               value: 0,
               validation: {
                    required: true,
               },
               valid: true,
               touched: false,
          },

          reportDuration: {
               elementType: 'select',
               elementConfig: {
                    label: 'Report duration',
                    options: [
                         { value: 0, displayValue: 'This week' },
                         { value: 1, displayValue: 'This month' },
                         { value: 2, displayValue: 'This year' },
                    ],
               },
               value: 0,
               validation: {
                    required: true,
               },
               valid: true,
               touched: false,
          },
     });
     const [formIsValid, setFormIsValid] = useState(true);
     let [options, setOptions] = useState({
          animationEnabled: true,
          exportEnabled: true,
          title: {
               text: 'Overall report',
          },
          axisX: {
               valueFormatString: 'MMM',
          },
          axisY: {
               title: 'Tasks',
          },
          data: [
               {
                    type: 'spline',
                    dataPoints: [],
               },
          ],
     });

     const inputChangedHandler = (event, controlName) => {
          const updatedControls = {
               ...formData,
               [controlName]: {
                    ...formData[controlName],
                    value: event.target.value,
                    valid: checkValidation(
                         event.target.value,
                         formData[controlName].validation,
                    ),
                    touched: true,
               },
          };

          let updatedFormIsValid = true;

          Object.keys(updatedControls).forEach(controlName => {
               updatedFormIsValid =
                    updatedControls[controlName].valid && updatedFormIsValid;
          });

          setFormData(updatedControls);
          setFormIsValid(updatedFormIsValid);
     };
     const formElementArray = [];

     for (let key in formData) {
          formElementArray.push({
               id: key,
               config: formData[key],
          });
     }

     let form = formElementArray.map(formElement => (
          <Input
               key={formElement.id}
               elementType={formElement.config.elementType}
               elementConfig={formElement.config.elementConfig}
               value={formElement.config.value}
               invalid={!formElement.config.valid}
               shouldValidate={formElement.config.validation}
               touched={formElement.config.touched}
               changed={event => inputChangedHandler(event, formElement.id)}
          />
     ));

     const loadReport = () => {
          if (formIsValid) {
               axios.post(
                    `/?token=${localStorage.getItem('token')}`,
                    JSON.stringify({
                         query: `
              {
                companyReport(type: ${formData.reportType.value}, duration: ${
                              formData.reportDuration.value
                         }) {
                  Ydata
                }
              }
          `,
                    }),
               ).then(({ data }) => {
                    const Ydata = JSON.parse(data.data.companyReport.Ydata);

                    let title;

                    switch (parseInt(formData.reportType.value)) {
                         case 0:
                              title = 'Tasks';
                              break;
                         case 2:
                              title = 'Users';
                              break;
                         default:
                              title = null;
                              break;
                    }

                    let dataPoints;
                    switch (parseInt(formData.reportDuration.value)) {
                         case 0:
                              dataPoints = Ydata.map((date, i) => ({
                                   x: new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth(),
                                        i - 1,
                                   ),
                                   y: date,
                              }));

                              setOptions({
                                   ...options,
                                   dataType: formData.reportType.value,
                                   data: [
                                        {
                                             ...options.data[0],
                                             yValueFormatString: `#,### ${title}(s)`,
                                             xValueFormatString: 'DDD',
                                             type: 'spline',
                                             dataPoints,
                                        },
                                   ],
                                   axisY: {
                                        ...options.axisY,
                                        title,
                                   },
                                   axisX: {
                                        ...options.axisX,
                                        valueFormatString: 'DDD',
                                   },
                              });
                              break;

                         case 1:
                              dataPoints = Ydata.map((date, i) => ({
                                   x: new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth(),
                                        i + 1,
                                   ),
                                   y: date,
                              }));

                              setOptions({
                                   ...options,
                                   dataType: formData.reportType.value,
                                   data: [
                                        {
                                             ...options.data[0],
                                             yValueFormatString: `#,### ${title}(s)`,
                                             xValueFormatString: 'DDD',
                                             type: 'spline',
                                             dataPoints,
                                        },
                                   ],
                                   axisY: {
                                        ...options.axisY,
                                        title,
                                   },
                                   axisX: {
                                        ...options.axisX,
                                        valueFormatString: 'DDD',
                                   },
                              });
                              break;

                         case 2:
                              dataPoints = Ydata.map((date, i) => ({
                                   x: new Date(new Date().getFullYear(), i - 1),
                                   y: date,
                              }));

                              setOptions({
                                   ...options,
                                   dataType: formData.reportType.value,
                                   data: [
                                        {
                                             ...options.data[0],
                                             dataPoints,
                                             yValueFormatString: `#,### ${title}(s)`,
                                             xValueFormatString: 'MMMM',
                                             type: 'spline',
                                        },
                                   ],
                                   axisY: {
                                        ...options.axisY,
                                        title,
                                   },
                                   axisX: {
                                        ...options.axisX,
                                        valueFormatString: 'MMM',
                                   },
                              });
                              break;
                         default:
                              break;
                    }
               });
          }
     };

     useEffect(() => {
          loadReport();
     }, [formData]);

     return (
          <main>
               <CanvasJSChart options={options} />
               <form>{form}</form>
          </main>
     );
};

export default companyManage;
