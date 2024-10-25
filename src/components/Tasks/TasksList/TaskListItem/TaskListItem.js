import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Swipeout from 'rc-swipeout';
import LongPress from 'react-long'

import QuickActionContext from '../../../../context/quickAction-context';
import classes from './TaskListItem.module.css';

const TaskListItem = props => {
     const quickActionContext = useContext(QuickActionContext);
     let swipeMenu = [];

     if (!props.isCompleted)
          swipeMenu.push({
               text: <i className='material-icons'>done</i>,
               className: classes.CompleteButton,
               onPress: props.completeTask,
          });
     

     return (
          <LongPress
               time={500}
               onLongPress={() => quickActionContext.onSelect(props.id, 'task')}
          >
               <Swipeout autoClose left={swipeMenu}>
                   <div>
                         {quickActionContext.selected.length > 0 && (<label style={{marginRight: '10px'}} className={["container", classes.SelectedCheck].join(' ')}>
                              <input type="checkbox" onChange={(e) => {
                                 if(e.target.checked) {
                                   quickActionContext.onSelect(props.id, 'task')
                                 } else {
                                   quickActionContext.onUnSelect(props.id);
                                 }
                              }} checked={(quickActionContext.payload === 'task' && quickActionContext.selected.find(e => e === props.id))} />
                              <span className="checkmark"></span>
                         </label>)}
                         <Link
                              to={
                                   props.isTodo
                                        ? `/task/${props.id}?isTodo=true`
                                        : `/task/${props.id}`
                              }
                              className={classes.Link}
                         >
                              <li 
                                   className={classes.TaskListItem} 
                                   style={(quickActionContext.payload === 'task' && quickActionContext.selected.find(e => e === props.id)) ? {backgroundColor: '#efefef'} : {}}
                                   onClick={quickActionContext.onClear}
                              >
                                   <div className={classes.DetailsDisplay}>
                                        <span className={classes.Title}>
                                             {props.title}
                                        </span>
                                        <span
                                             className={classes.Description}
                                        >{`${props.description
                                             .split(/\s+/)
                                             .slice(0, 5)
                                             .join(' ')}...`}</span>
                                   </div>
                              </li>
                         </Link>
                   </div>
               </Swipeout>
          </LongPress>
     );
};

export default TaskListItem;
