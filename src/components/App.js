import React from 'react';
import Header from './Header';
import Order from './Order';
import Landing from './Landing';
import Student from './Student';
import AddStudentForm from './AddStudentForm';
import sampleStudentes from '../sample-students.js';
import rebase from '../base';

class App extends React.Component {
  constructor() {
    super();
    this.getTeacherName = this.getTeacherName.bind(this);
    this.logout = this.logout.bind(this);
    this.addStudent = this.addStudent.bind(this);
    this.updateStudent = this.updateStudent.bind(this);
    this.removeStudent = this.removeStudent.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    this.deleteAllStudents = this.deleteAllStudents.bind(this);
    this.warnClose = this.warnClose.bind(this);
    this.addHoursAndMinutes = this.addHoursAndMinutes.bind(this);
    this.toggleInvert = this.toggleInvert.bind(this);
    this.alertON = this.alertON.bind(this);
    this.alertOFF = this.alertON.bind(this);
    this.tick = this.tick.bind(this);
    this.dbTimeout = this.dbTimeout.bind(this);
    this.dbTimeErase = this.dbTimeErase.bind(this);
    this.warningRejection = this.warningRejection.bind(this);
    this.startSelectedTests = this.startSelectedTests.bind(this);
    this.switchControl = this.switchControl.bind(this);
    this.toggleSelectForDelete = this.toggleSelectForDelete.bind(this);
    this.renderHeader = this.renderHeader.bind(this);

    // getinitialState
    this.state = {
      printPage: false,
      students: {},
      alert: false,
      selectAll: true,
      clickedToDelete: false,
      deleteAppear: false,
      clearSelected: false,
      warn: false,
      alert: false,
      time: 0,
      waitOption: 1800000,
      timeoutStarted: false,
      info: false,
      selStudents: [],
      selTests: [],
      selectAll: true,
      invertSelect: false,

    };
  }

  componentWillMount() {
    this.ref = rebase.base.syncState(`${this.props.match.params.userID}/students`, {
      context: this,
      state: 'students'
    });
  }

  componentWillUnmount() {
    rebase.base.removeBinding(this.ref);
  }

  getTeacherName(string) {
    var string = string.trim();
    var spaceIndex = string.indexOf(string.match(/\s/));
    var lastName = string.slice(spaceIndex + 1, string.length);
    return lastName;
  }

  // componentWillUpdate(nextProps, nextState) {
  //   localStorage.setItem(`order-${this.props.match.params.storeID}`, JSON.stringify(nextState.order));
  // }

// BEGIN Functions to be distributed to various Children

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

  addHoursAndMinutes(hours, minutes) {
    const timeInMillisecs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    return timeInMillisecs;
  }

  warnClose() {
    this.setState({ warn: true });
  }

  dbTimeout() {
    this.setState({ warn: true });
  }

  dbTimeErase() {
    this.logout();
  }

  componentDidMount() {
    if(!this.state.timeoutStarted) {
      setTimeout(
        () => this.dbTimeout(),
        this.state.waitOption);
      setTimeout(
        () => this.dbTimeErase(),
        this.state.waitOption)
    }
  }

  warningRejection() {
    this.setState({ warn          : false,
                    waitOption    : this.state.waitOption + 1800000,
                    timeoutStarted: false
    });
  }

  alertON() {
    this.setState({ alert: true});
  }

  alertOFF() {
    this.setState({ alert: false});
  }

// END Functions to be distributed to various Children

// BEGIN Student selection functions

  toggleInvert() {
    this.unsafeCount = 0;
    this.safeCount = 0;

    Object
      .keys(this.state.students)
      .map(key => {
        const students = this.state.students;
        if(students[key] & students[key].isSafeToDelete) {
          this.safeCount++;
        } else if(students[key] && !students[key].isSafeToDelete) {
          this.unsafeCount++;
        }
      });

    this.setState({
      clickedToDelete: false
    });

    if(this.safeCount > 0) {
      this.setState({
        clickedToDelete: true
      });

      setTimeout(
        () => this.setState({
          deleteAppear: true
        }),
      1000);
    } else {
      this.setState({
        deleteAppear: true
      });

      setTimeout(
        () => this.setState({
          clickedToDelete: true
        }),
      1000);
    }
    console.log("clickedToDelete: " + this.state.clickedToDelete);

    if (this.safeCount > 0 && this.unsafeCount > 1) {
      this.setState({
        invertSelect: true,
        selectAll   : false
      });
      console.log("safeCount: " + this.safeCount);
      console.log("invertSelect is" + this.state.invertSelect + "; selectAll is " + this.state.selectAll);
    } else if (this.safeCount > 0 && this.safeCount == Object.keys(this.state.students).length) {
        this.setState({
          invertSelect   : false,
          selectAll      : false,
          clearSelected  : true,
          clickedToDelete: true
        });
      console.log("invertSelect " + this.state.invertSelect + "; selectAll is " + this.state.selectAll);
    } else if (this.safeCount == 0) {
      this.setState({
        invertSelect   : true,
        selectAll      : true,
        clickedToDelete: false
      });
      console.log("invertSelect " + this.state.invertSelect + " is false; selectAll is " + this.state.selectAll);
    }
  }



// END Student selection functions

// BEGIN Clock Functions

  tick() {
    this.setState({
      time: Date.now()
    });
  }

  componentDidMount() {
    this.clock = setInterval(
      () => this.tick(),
      1000
    );
  }


// END Clock Functions

// BEGIN Student CRUD functions

  addStudent(student) {
    // update our state
    const students = {...this.state.students};
    // add in our new student
    const timestamp = Date.now();
    students[`student-${timestamp}`] = student;
    // you can do this: this.state.students.student1 = student;
    // set state
    // this is more standard, grabbing the state and updating it: this.setState({ students: students})
    // the below is the most advanced syntax, ES6
    this.setState({ students });
    console.log("this.state.students = ", this.state.students);
    setTimeout(
      () => this.setState({
        alert: false
      }),
      5000
    )
  }

  updateStudent(key, updatedStudent) {
    const students = {...this.state.students};
    students[key] = updatedStudent;
    this.setState({ students });
    // alternative syntax for the above: this.setState({students: students})
  }

  removeStudent(key) {
    const students = {...this.state.students};
    students[key] = null;
    this.setState({ students });
    this.setState({ selectAll       : true,
                    clickedToDelete : false,
                    deleteAppear    : false
    });
    console.log("student has been removed");
  }

  deleteSelected() {
    this.setState({ clearSelected   : false,
                    deleteAppear    : false
    });
    setTimeout(
      () => this.setState({ selectAll       : true,
                            clickedToDelete : false
      }),
      1000);

    const students = this.state.students;

    Object
      .keys(students)
      .map(key => {

        if(students[key].isSafeToDelete) {
          students[key] = null;
        }
      });

    // const students = Object.keys(this.state.students);
    //
    // for (var i = 0; i < students.length; i++) {
    //   if (students[i].isSafeToDelete) {
    //     students[i] = null;
    //   }
    // }
    this.setState({ students });

  }

  deleteAllStudents() {
    this.setState({ warn: false });
    const students = this.state.students;
    Object
      .keys(students)
      .map(key => {
        students[key] = null;
      });

    this.setState({ students });

  }

  toggleSelectForDelete() {
    const students = this.state.students;
    Object
      .keys(students)
      .map(key => {
        if (!students[key].isSafeToDelete) {
          students[key].isSafeToDelete = true;
        } else if (students[key].isSafeToDelete) {
          students[key].isSafeToDelete = false;
        }
        this.updateStudent(key, students[key]);
      });
  }

// END Student CRUD functions

// BEGIN (collective) students functions

startSelectedTests() {
  const students = {...this.state.students};
  Object
    .keys(this.state.students)
    .map(key => {
      const student = students[key];
      if (student.isSafeToDelete) {
        const tests = student.tests;
        Object
        .keys(tests)
        .map(key =>{
          if(!tests[key].hasTimerStarted && !tests[key].isOver) {
            this.setState({
              selTests: this.state.selTests.push(tests[key]),
              selStudents: this.state.selStudents.push(student)
            });
          }
        });

      }
    });
    this.setState({
      info: true
    });
    setTimeout(
      () => this.setState({
        info: false
      }),
      5000
    )
}

switchControl() {
  if (this.state.selectAll && !this.state.invertSelect) {
    this.toggleSelectForDelete();
    this.setState({
        selectAll: false,
        invertSelect: false,
        clickedToDelete: true
    });
    setTimeout(
      () => this.setState({
        clearSelected: true}),
      1000
    );
    setTimeout(
      () => this.setState({
        deleteAppear: true}),
      1000
    );

  } else if (this.state.clearSelected) {

    this.toggleSelectForDelete();
    this.setState({
      clearSelected: false,
      deleteAppear: false
    });
    setTimeout(
      () => this.setState({
        selectAll: true}),
      1000
    );
    setTimeout(
      () => this.setState({
        clickedToDelete: false}),
      1000
    );

  } else if (this.state.invertSelect) {
    this.toggleSelectForDelete();
  }
}

renderHeader() {
  return (
    <Header
      age="5000"
      state={this.state}
      logout={this.logout}
      printPage={this.state.printPage}
    />
  )
}

// END (collective) students functions

// BEGIN render

  render() {
    return (
      <div className="main-frame">
        {this.renderHeader()}
        <div className="list-group">
          <div className={"alert alert-danger" + (this.state.warn) ? "" : "hidden"} role="alert">
            <div className="alert-message">Do you wish to erase student list and close session?
              <div className="yesNoContainer">
                <button className="yesBtn" onClick={() => this.logout()}><p>close session</p></button>
                <button className="noBtn" onClick={() => this.warningRejection()}><p>not yet</p></button>
              </div>
            </div>
          </div>
          <div className={"alert alert-warning" + (this.state.alert) ? "" : "hidden"} role="alert">
            <i className="fa fa-exclamation" aria-hidden="true"></i>
            <i className="fa fa-exclamation" aria-hidden="true"></i>
            <i className="fa fa-exclamation" aria-hidden="true"></i> oops! At minimum, please enter student name and testing extension multiple.
            <i className="fa fa-exclamation" aria-hidden="true"></i>
            <i className="fa fa-exclamation" aria-hidden="true"></i>
            <i className="fa fa-exclamation" aria-hidden="true"></i>
          </div>

          <div className={"alert alert-info" + (this.state.info) ? "" : "hidden"} role="alert">There are no tests ready to start at this time.</div>

{/*begin Student Display*/}
          <div className="container-fluid main-body w3-panel w3-card-2">
{/*SELECT / DELETE CONTROLS*/}
            <div className={"row formControls marginLeft marginRight" + (Object.keys(this.state.students).length < 2) ? "hidden" : ""} >
              <div className={(this.state.clickedToDelete) ? 'col-lg-4 col-md-4 col-sm-4 col-xs-4 mainBtn' : 'col-lg-12 col-md-12 col-sm-12 col-xs-12 mainBtn'}>
                <button className="controlBtn selectAll clearAll invertSelection" onClick={() => this.switchControl(this.state.students)}>
                  <p className={(this.state.alert) ? "" : "hidden"} role="alert"></p>
                  <p ng-show="selectAll && !invertSelect">select all</p>
                  <p ng-show="clearSelected && !invertSelect">clear selected</p>
                  <p ng-show="invertSelect">invert selection</p>
                </button>
              </div>
              <div className={(this.state.deleteAppear) ? "col-lg-4 col-md-4 col-sm-4 col-xs-4 deleteSelectedStudents IIndaryBtnYes" : "col-lg-4 col-md-4 col-sm-4 col-xs-4 deleteSelectedStudents IIndaryBtnNo"}>
                <button className="controlBtn deleteSelected" onClick={() => this.deleteSelected()}>
                  <p>delete selected</p>
                </button>
              </div>
              <div className={(this.state.deleteAppear) ? "col-lg-4 col-md-4 col-sm-4 col-xs-4 startSelectedTests IIndaryBtnYes" : "col-lg-4 col-md-4 col-sm-4 col-xs-4 startSelectedTests IIndaryBtnNo"}>
                <button className="controlBtn deleteSelected" onClick={() => this.startSelectedTests()}>
                  <p>start selected tests</p>
                </button>
              </div>
            </div>

            <ul className="TrackerPage">{
              Object
                .keys(this.state.students)
                .map(key => <Student
                              key={key}
                              index={key}
                              students={this.state.students}
                              student={this.state.students[key]}
                              selTests={this.state.selTests}
                              selStudents={this.state.selStudents}
                              toggleInvert={this.toggleInvert}
                              time={this.state.time}
                              updateStudent={this.updateStudent}
                              removeStudent={this.removeStudent}
                            />)
            }</ul>
          </div> {/* END CONTAINER-FLUID MAIN-BODY */}
          <div className={(this.state.printPage) ? "hidden" : ""}>
            <AddStudentForm
              students={this.state.students}
              addStudent={this.addStudent}
              addHoursAndMinutes={this.addHoursAndMinutes}
              toggleInvert={this.toggleInvert}
              alertON={this.alertON}
              alertOFF={this.alertOFF}
            />
          </div>
        </div>
    </div>
    )
  }
}

export default App;
