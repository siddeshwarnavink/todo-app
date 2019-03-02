import React, { useEffect } from "react";
import authRequired from "../../hoc/authRequired/authRequired";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Spinner from "../../components/UI/Spinner/Spinner";
import NotificationCard from "../../components/Notification/Notification";
import Fab from "../../components/UI/Button/Fab/Fab";
import { Link } from "react-router-dom";

const Notification = props => {
  useEffect(() => {
    props.initNotifications();
  }, []);

  return (
    <main>
      <h1>Notification</h1>

      {props.loading ? (
        <Spinner />
      ) : (
        props.notifications.map((notification, index) => (
          <Link
            key={index}
            to={notification.link}
            style={{ textDecoration: "none", color: "#000" }}
          >
            <NotificationCard
              icon={notification.icon}
              content={notification.message}
            />
          </Link>
        ))
      )}

      <Fab clicked={props.clearNotification}>
        <i className="material-icons">clear_all</i>
      </Fab>
    </main>
  );
};

const mapStateToProps = state => ({
  loading: state.notification.loading,
  notifications: state.notification.notifications
});

const mapDispatchToProps = dispatch => ({
  initNotifications: () => dispatch(actions.initNotifications()),
  clearNotification: () => dispatch(actions.onClearNotifications())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(authRequired(Notification));
