import React from 'react';
import rebase from '../base';
import PropTypes from 'prop-types';
import Landing from './Landing';
import { Button, Form, FormGroup, Label, Input, FormText, Container, Row, Col } from 'reactstrap';

class Header extends React.Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.goToPrintPage = this.goToPrintPage.bind(this);
    this.goToTrackerPage = this.goToTrackerPage.bind(this);
  }

  goToPrintPage() {
    rebase.app.auth().onAuthStateChanged((authData, error) => {
      if(authData) {
        const userID = authData.user.uid;
        this.props.location.pathname = `/UserPage/${userID}`;
        this.props.history.push(`/UserPage/${userID}`);
        this.props.history.replace(`/UserPage/${userID}`);
      }
    });
  }

  logout() {
    rebase.app.auth().signout().then(() => {
      this.setState({uid: null});
    });
    if(!this.state.uid) {
      this.props.location.pathname = `/Landing`;
      this.props.history.push(`/Landing`);
      this.props.history.replace(`/Landing`);
    }
  }

  goToTrackerPage() {
    rebase.app.auth().onAuthStateChanged((authData, error) => {
      if(authData) {
        const userID = authData.user.uid;
        this.props.location.pathname = `/UserPage/${userID}`;
        this.props.history.push(`/UserPage/${userID}`);
        this.props.history.replace(`/UserPage/${userID}`);
      }
    });
  }

  render() {
    return(
      <nav className="navbar fixed-top navbar-toggleable-sm bg-faded">
      <button className="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
        <span> </span>
        <span> </span>
        <span> </span>
      </button>
      <Col className="hidden-sm-down navbar-brand" lg="3" md="3" sm="3" xs="12">
        <b><p className="navHeading">TestTrakker</p></b>
      </Col>
      <div className="collapse navbar-collapse" id="collapsingNavbar">
        <ul className="nav navbar-nav">
          <li className="nav-item">
            {/* <b><p className="col-lg-3 col-md-3 col-sm-3 col-xs-12 navHeading">{{time | date: 'short'}}</p></b> */}
          </li>
          <li className="nav-item">
            {/* <button ui-sref="testDataPrintout" className="menuBtn menu-one col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <p className="linkText">print</p>
            </button> */}
          </li>
          <li className="nav-item">
            {/* <button ng-click="warnClose()" className="menuBtn menu-two col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <p className="linkText">logout</p>
            </button> */}
          </li>
        </ul>
      </div>
    </nav>
    )
  }

}

Header.propTypes = {
  // tagline: 'React.PropTypes.string' is the old syntax.  As of React v15.5, propTypes has become a library that should be imported ('import PropTypes from 'prop-types';').  Syntax has dropped 'React'.
  // tagline: PropTypes.string.isRequired
}

export default Header;
