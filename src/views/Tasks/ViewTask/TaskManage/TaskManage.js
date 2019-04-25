import React from 'react';

import CanvasJSReact from '../../../../assets/canvasjs.react';
import EditTask from '../../../../components/Tasks/EditTask/EditTask';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const taskManage = props => {
     const totalMembers = props.taskMembers.length;
     const completed = props.taskMembers.filter(m => m.completed).length;
     const notCompleted = props.taskMembers.filter(m => !m.completed).length;

     const options = {
          exportEnabled: true,
          exportFileName: `"${props.task.title}" Task Report`,
          animationEnabled: true,
          title: {
               text: 'Task Report',
          },
          data: [
               {
                    type: 'pie',
                    startAngle: 75,
                    toolTipContent: '<b>{label}</b>: {y}%',
                    showInLegend: 'true',
                    legendText: '{label}',
                    indexLabelFontSize: 12,
                    indexLabel: '{label} - {y}%',
                    dataPoints: [
                         {
                              y: Math.round((completed / totalMembers) * 100),
                              label: 'Completed',
                         },
                         {
                              y: Math.round(
                                   (notCompleted / totalMembers) * 100,
                              ),
                              label: 'Not Completed',
                         },
                    ],
               },
          ],
     };

     return (
          <main>
               {!props.isTodo && <CanvasJSChart options={options} />}
               {props.task.members || props.isTodo ? (
                    <EditTask
                         groupId={props.isTodo ? 0 : props.task.group.id}
                         goFunc={props.goFunc}
                         taskId={props.taskId}
                         taskData={props.task}
                         taskMembers={
                              props.isTodo
                                   ? []
                                   : props.task.members.map(m => m.user.id)
                         }
                         isTodo={props.isTodo}
                    />
               ) : null}
          </main>
     );
};

export default taskManage;
