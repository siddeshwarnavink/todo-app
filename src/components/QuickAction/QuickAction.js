import React, { useContext } from 'react';

import QuickActionContext from '../../context/quickAction-context';
import classes from './QuickAction.module.css';

const QuickAction = (props) => {
    const quickActionContext = useContext(QuickActionContext);

    return (
        <div className={classes.QuickAction}>
            <ul>
                <li>
                    <button onClick={quickActionContext.onClear}>
                        <i className='material-icons'>close</i>
                    </button>
                </li>
                <li>
                    <button onClick={quickActionContext.onDelete}>
                        <i className='material-icons'>delete</i>
                    </button>
                </li>
                {quickActionContext.payload === 'task' && <li>
                    <button onClick={quickActionContext.onComplete}>
                        <i className='material-icons'>done</i>
                    </button>
                </li>}
            </ul>
        </div>
    );
}

export default QuickAction;