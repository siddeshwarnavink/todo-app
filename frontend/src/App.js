import React, { Suspense, useState } from "react";
import "./App.css";
import "blueprint-css/dist/blueprint.min.css";

import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";
import Spinner from "./components/UI/Spinner/Spinner";

import Homepage from "./views/Homepage";
import AuthPage from "./views/Auth/Auth";
import ViewGroup from "./views/Group/ViewGroup/ViewGroup";
import ViewTask from "./views/Tasks/ViewTask/ViewTask";
import ViewUser from "./views/User/ViewUser/ViewUser";
import Notification from "./views/Notification/Notification";
import MenuContext from "./context/menu-context";

const AdminMain = React.lazy(() => import("./views/Admin/Main/Main"));

const App = props => {
  const [menuItems, setMenuItems] = useState([]);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        setMenuItems
      }}
    >
      <Layout>
        <Switch>
          {/* Auth Page */}
          <Route exact path="/auth" component={AuthPage} />

          {/* Home page */}
          <Route exact path="/" component={Homepage} />

          {/* Group page */}
          <Route exact path="/group/:id" component={ViewGroup} />

          {/* Tasks */}
          <Route exact path="/task/:id" component={ViewTask} />

          {/* User  */}
          <Route exact path="/user/:id" component={ViewUser} />

          {/* Admin */}

          <Route
            exact
            path="/admin/"
            render={innerProps => (
              <>
                <Suspense fallback={<Spinner />}>
                  <AdminMain {...innerProps} />
                </Suspense>
              </>
            )}
          />

          {/* Notification */}
          <Route exact path="/notification" component={Notification} />

          <Route
            exact
            path="/profile"
            render={() => <Redirect to="/user/current-user" />}
          />

          <Redirect to="/" />
        </Switch>
      </Layout>
    </MenuContext.Provider>
  );
};
export default App;
