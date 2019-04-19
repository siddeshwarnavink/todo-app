import React, { Component } from "react";

import classes from "./Main.module.css";
import axios from "../../../axios";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { BrowserView } from "react-device-detect";
import authRequired from "../../../hoc/authRequired/authRequired";
import Spinner from "../../../components/UI/Spinner/Spinner";
import CompanyEmployees from "./CompanyEmployees/CompanyEmployees";
import CompanyGroups from "./CompanyGroups/CompanyGroups";
import CompanyManage from "./CompanyManage/CompanyManage";

class Main extends Component {
  state = {
    loadingCompany: false,
    loadingMembers: false,
    loadingGroups: false,
    company: {},
    members: [],
    groups: []
  };

  loadMembers = () => {
    this.setState({ loadingMembers: true });

    axios
      .post(
        `/?token=${localStorage.getItem("token")}`,
        JSON.stringify({
          query: `
          {
            companyStaics {
              members {
                id
                username
                isAdmin
              }
            }
          }
        `
        })
      )
      .then(({ data }) => {
        this.setState({
          members: data.data.companyStaics.members,
          loadingMembers: false
        });
      });
  };

  loadGroups = () => {
    this.setState({ loadingGroups: true });

    axios
      .post(
        `/?token=${localStorage.getItem("token")}`,
        JSON.stringify({
          query: `
          {
            companyStaics {
              groups {
                id
                title
              }
            }
          }
        `
        })
      )
      .then(({ data }) => {
        this.setState({
          groups: data.data.companyStaics.groups,
          loadingGroups: false
        });
      });
  };

  render() {
    const company = this.state.company;

    return (
      <>
        {!this.state.loadingCompany ? (
          <>
            <main className={classes.Main}>
              <div className={classes.StatusCard}>
                <div className={classes.TopStatusCard}>
                  <img
                    src={company.logo}
                    alt="Company`s logo"
                    className={classes.Logo}
                  />
                  <BrowserView>
                    <h1>{company.title}</h1>
                  </BrowserView>
                </div>

                <div className={classes.Spacer} />

                <div className={classes.Status}>
                  <span className={classes.Count}>{company.groupsCount}</span>
                  <span className={classes.SubTitle}>Groups</span>
                </div>

                <div className={classes.Status}>
                  <span className={classes.Count}>{company.membersCount}</span>
                  <span className={classes.SubTitle}>Employees</span>
                </div>
              </div>
            </main>

            <Tabs>
              <TabList>
                <Tab>
                  <i className="material-icons">group</i>
                  <span>Users</span>
                </Tab>

                <Tab onClick={this.loadGroups}>
                  <i className="material-icons">group_work</i>
                  <span>Groups</span>
                </Tab>

                <Tab onClick={this.loadGroups}>
                  <i className="material-icons">data_usage</i>
                  <span>Manage</span>
                </Tab>
              </TabList>

              <main className={classes.Main} style={{ marginTop: "1px" }}>
                <TabPanel>
                  <CompanyEmployees
                    loading={this.state.loadingMembers}
                    members={this.state.members}
                    loadMembers={this.loadMembers}
                  />
                </TabPanel>

                <TabPanel>
                  <CompanyGroups
                    loading={this.state.loadingGroups}
                    groups={this.state.groups}
                    members={this.state.members}
                    loadGroups={this.loadGroups}
                  />
                </TabPanel>

                <TabPanel>
                  <CompanyManage />
                </TabPanel>
              </main>
            </Tabs>
          </>
        ) : (
          <Spinner />
        )}
      </>
    );
  }

  componentDidMount() {
    this.loadMembers();
    this.setState({ loadingCompany: true });

    axios
      .post(
        `/?token=${localStorage.getItem("token")}`,
        JSON.stringify({
          query: `
        {
          companyStaics {
            title,
            logo
            membersCount
            groupsCount
          }
        }
      `
        })
      )
      .then(({ data }) => {
        this.setState({
          company: data.data.companyStaics,
          loadingCompany: false
        });
      });
  }
}

export default authRequired(Main);
