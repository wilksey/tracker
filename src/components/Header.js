import React from 'react';
import rebase from '../base';
import PropTypes from 'prop-types';
import Clock from './Clock';
// import Landing from './Landing';

class Header extends React.Component {
  constructor() {
    super();
    this.goToPrintPage = this.goToPrintPage.bind(this);
    this.goToTrackerPage = this.goToTrackerPage.bind(this);
    this.getTeacherName = this.getTeacherName.bind(this);
    this.state = {
      time: new Date()
    }
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  componentDidMount() {
    this.clock = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }

  getTeacherName(string) {
    var str = string.trim();
    var spaceIndex = str.indexOf(str.match(/\s/));
    var lastName = str.slice(spaceIndex + 1, str.length);
    return lastName;
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

  // another way: (from UserPage.js)

  // logout() {
  //   rebase.app.auth().signOut().then(() => {
  //     console.log("should have been logged out");
  //   });
  //   this.setState({ uid: null });
  // }

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
      <div className="hidden-sm-down navbar-brand col-lg-3 col-md-3 col-sm-3 col-xs-12">
        <b><p className="navHeading">TestTrakker</p></b>
      </div>
      <div className="collapse navbar-collapse" id="collapsingNavbar">
        <ul className="nav navbar-nav">
          <li className="nav-item">
            {/* <b><p className="col-sm-3 col-xs-12 navHeading">{this.state.time.toLocaleTimeString()}</p></b> */}
            {/* <b><p className="col-lg-3 col-md-3 col-sm-3 col-xs-12 navHeading">{this.props.time.toLocaleTimeString()}</p></b> */}
            <Clock/>
          </li>
          <li className="nav-item">
            {/* <button ui-sref="testDataPrintout" className="menuBtn menu-one col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <p className="linkText">print</p>
            </button> */}
          </li>
          <li className="nav-item">
            {/* <button ng-click="warnClose()" className="menuBtn menu-two col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <p className="linkText">logout</p>
              {this.props.logout}
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
