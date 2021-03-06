import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
// import { addHoursAndMinutes, processTime, parseTime } from '../helpers';
import { mountNumberInput, addHoursAndMinutes, processTime, parseTime } from '../helpers';
import PropTypes from 'prop-types';

class Test extends React.Component {
  constructor() {
    super();
    // this.handleToggle = this.handleToggle.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderBarText = this.renderBarText.bind(this);
    this.renderBars = this.renderBars.bind(this);
    this.timer = this.timer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.resumeTimer = this.resumeTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
    this.fullBarStyle = this.fullBarStyle.bind(this);
    this.standardBarStyle = this.standardBarStyle.bind(this);
    this.extendBarStyle = this.extendBarStyle.bind(this);
    this.extendZeroBarStyle = this.extendZeroBarStyle.bind(this);
    this.state = {
      startTest: false,
      addInlinetest: false,
      hideFinishedtest: false,
      redHover: false,
      topBarDividend: 0,
      bottomBarDividend: 0,
      topBarRatio: 0,
      bottomBarRatio: 0,
      topBarWidth: 0,
      bottomBarWidth: 0,
      countdown: 0,
      dueTime: 0,
      time: new Date()
    }
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

// BEGIN Lifecycle Hooks

  componentDidMount() {

    const { student, students, studentKey } = this.props;

    // this.clock = setInterval(
    //   () => this.tick(),
    //   1000
    // );
    // const students = this.props.students;
    // const studentKey = index;

    // this.numberInput = setTimeout(
    //   () => mountNumberInput(),
    //   0
    // );

    mountNumberInput();

    for (var i = 0; i < this.props.selectedTests.length; i++) {
      if (students[this.props.studentKey] == this.props.selectedStudents[i]) {
        this.startTimer(this.props.selectedStudents[i], this.props.selectedTests[i]);
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { student, students, studentKey, test } = this.props;

    if(this.state.startTest) {
      this.timerVar = setInterval(
        () => this.timer(studentKey, test),
        1000
      );
    }

    mountNumberInput();

    // this.numberInput = setTimeout(
    //   () => mountNumberInput(),
    //   0
    // );

    // if(nextProps.student.isSafeToDelete && test.total > 0 && !this.state.addInlinetest && !this.state.hideFinishedTest){
    // if(nextProps.student.isSafeToDelete){
    //   // $(ReactDOM.findDOMNode(this.refs.safeDeleteHighlighft)).css({'padding-left': '1em',
    //   //   'transition': 'all 1s ease-in-out'});
    //   ReactDOM.findDOMNode(this.refs.safeDeleteHighlighft).css({'padding-left': '1em',
    //     'transition': 'all 1s ease-in-out'});
    // } else {
    //   ReactDOM.findDOMNode(this.refs.safeDeleteHighlight).css({'padding-left': '0',
    //   'transition': 'all 1s ease-in-out'});
    // }

  }

  componentWillUnmount() {
    clearTimeout(this.numberInput);
    clearInterval(this.clock);

    if(!this.state.startTest) {
      clearInterval(this.timeVar);
    }
  }

//  END Lifecycle Hooks

// BEGIN click handlers

handleToggle(e, boolean) {
  this.setState({
    [e.target.name]: e.target.value
  });
  // console.log("e.target.name = " + e.target.name)
  // console.log("e.target.value = " + e.target.value)
  // console.log("e.target.name = " + e.target.name + " (value = " + e.target.value + ")")
}

// handleChange(e, key) {
//   const target = e.target;
//   const value = target.type === 'checkbox' ? target.checked : target.value;
//   const { student } = this.props;
//   // take a copy of that student and update it with the new data
//   const updatedStudent = {
//     ...student,
//     [e.target.name]: value
//   }
//   this.props.updateStudent(key, updatedStudent);
//
//   if(target.type === 'checkbox') {
//     this.props.toggleInvert();
//   }
// }

  // handleHourChange(e, test) {
  //   const { student } = this.props;
  //   // take a copy of that student and update it with the new data
  //   this.setState({
  //     hour: e.target.value
  //   });
  // }
  //
  // handleMinuteChange(e, key, test) {
  //   const { student } = this.props;
  //   // take a copy of that student and update it with the new data
  //   const hoursAndMinutes = addHoursAndMinutes(this.state.hour, e.target.value);
  //   const updatedStudent = {
  //     ...student,
  //     [e.target.name]: hoursAndMinutes,
  //     [test.total]: hoursAndMinutes * student.extendTime
  //   }
  //
  //   this.props.updateStudent(key, updatedStudent);
  //
  //   // reset hour state for other inline number inputs to use
  //   this.setState({
  //     hour: 0
  //   });
  // }

  relay(value, boolean) {
    return {
      boolean: boolean,
      value: value
    }
  }

// END click handlers

// BEGIN Student Test TIMER variables and functions

  startTimer(key, test) {

    if (test.startTime == 0) {
      const { student } = this.props;
      const updatedStudent = {
        ...student,
        [test.hasTimerStarted]: true,
        [test.startTime]      : Date.now(),
        [test.startRec]       : (test.pausedTotal == 0) ? Date.now() : 0
      }
      this.props.updateStudent(key, updatedStudent);
    } else {
      console.log("path 3 chosen");
      return this.timer(key, test);
    }

    this.setState({ startTest: true });

  }

  timer(key, test) {
    const { student } = this.props;
    const extendTime = student.extendTime;

    const testStartTime = test.startTime;
    const totalTime = test.total;
    const testTime = test.time;
    const extension = (testTime * extendTime) - testTime;
    const actualTestTime = totalTime - extension;

    if (actualTestTime > 0) {
      this.actualExtension = totalTime - actualTestTime;
    } else if (actualTestTime <= 0) {
      this.actualExtension = totalTime;
    }

    this.setState({
      bottomBarRatio: extension / (testTime * extendTime)
    });
    this.setState({
      topBarRatio: 1 - this.state.bottomBarRatio
    });

    // in case timer has not started yet (test 1) OR: timer has ended
    if ((test.startTime == 0 && !test.isOver && !test.isTimerPaused) || test.isOver) {

      this.setState({
        topBarWidth   : this.state.topBarRatio * 100,
        bottomBarWidth: this.state.bottomBarRatio * 100,
        countdown     : processTime(totalTime, 19)
      });

    // timer 1 runs out to zero
  } else if (totalTime + testStartTime - Date.now() <= 0 && !test.isTimerPaused && !test.isOver) {

      this.setState({
        topBarWidth   : 0,
        bottomBarWidth: 0,
        countdown     : 18000000
      });

      const updatedStudent = {
        ...student,
        [student.test.isOver]: true,
        [student.test.isTimerPaused]: false
      }
      this.props.updateStudent(key, updatedStudent);

    // timer is counting down (test 1)
  } else if (!test.isTimerPaused && !test.isOver) {

      this.setState({
        topBarDividend   : testStartTime + actualTestTime - this.props.time
      });
      this.setState({
        topBarWidth      : (this.topBarDividend > 0) ? this.topBarDividend / testTime * 100 * this.topBarRatio : 0,
        bottomBarDividend: (this.topBarDividend > 0) ? extension : testStartTime + totalTime - this.props.time
      });
      // ultimate outputs
      this.setState({
        bottomBarWidth: this.bottomBarDividend / extension * 100 * this.bottomBarRatio,
        dueTime: this.processTime(testStartTime + totalTime, 19)
      });
      this.setState({
        countdown: this.dueTime - this.props.time
      });

    // timer is paused (test 1)
  } else if (!test.isOver && test.isTimerPaused) {
      this.setState({
        topBarWidth: (actualTestTime > 0) ? actualTestTime / testTime * 100 * this.topBarRatio : 0,
        bottomBarDividend: (actualTestTime > 0) ? extension : this.actualExtension
      });
      this.setState({
        bottomBarWidth: this.bottomBarDividend / extension * 100 * this.bottomBarRatio,
        countdown: this.processTime(totalTime, 19)
      });
    }

    // return {
    //   countdown: this.state.countdown,
    //   top: this.state.topBarWidth,
    //   bottom: this.state.bottomBarWidth,
    //   topBarDividend: this.state.topBarDividend,
    //   bottomBarDividend: this.state.bottomBarDividend
    // }

  }

  pauseTimer(key, test) {
    const { student } = this.props;
    const updatedStudent = {
      ...student,
      [test.isTimerPaused]: true,
      [test.total]: (test.startTime + test.total) - Date.now(),
      [test.startTime]: 0,
      [test.pausedTime]: Date.now()

    }
    this.props.updateStudent(key, updatedStudent);

    // this.setState((prevState, props) => {
    //   test.isTimerPaused: true,
    //   test.total: (prevState.student.tests.test.total + test.startTme) - Date.now(),
    //   test.startTime: 0,
    //   test.pausedTime: Date.now()
    // }));

    this.relay(test, false);

    this.timer(key, test);
  }

  resumeTimer(key, test) {
    const { student } = this.props;
    const updatedStudent = {
      ...student,
      [test.isTimerPaused]: false,
      [test.pausedTotal]: test.pausedTotal + Date.now() - test.pausedTime

    }
    this.props.updateStudent(key, updatedStudent);

    // this.setState((prevState, props) => {
    //   test.isTimerPaused: false,
    //   test.pausedTotal: prevState.student.tests.test.pausedTotal + Date.now() - prevState.student.tests.test.pausedTime,
    //   test.startTime: 0,
    //   test.pausedTime: Date.now()
    // }));

    this.startTimer(key, test)
  }


  resetTimer(key, test) {
    const { student } = this.props;
    const updatedStudent = {
      ...student,
      [test.isTimerPaused]: false,
      [test.total]: test.time * student.extendTime,
      [test.pausedTime]: 0,
      [test.pausedTotal]: 0,
      [test.startTime]: 0,
      [test.hasTimerStarted]: false

    }
    this.props.updateStudent(key, updatedStudent);

    // this.setState((prevState, props) => {
    //   test.isTimerPaused: false,
    //   test.pausedTotal: prevState.student.tests.test.pausedTotal + Date.now() - prevState.student.tests.test.pausedTime,
    //   test.startTime: 0,
    //   test.pausedTime: Date.now()
    // }));

    clearInterval(this.timerVar);
  }

  endTimer(key, test) {
    const { student } = this.props;
    const updatedStudent = {
      ...student,
      [test.isTestOneOver]: true,
      [test.endedAt]: Date.now(),

    }
    this.props.updateStudent(key, updatedStudent);

    // this.setState({
    //   test.isTestOneOver: true,
    //   test.endedAt: Date.now()
    // });

    clearInterval(this.timerVar);
  }

// END Student Test TIMER variables and functions

// BEGIN Test Display Functions


  fullBarStyle(studentKey, test) {
    return {
      width: this.state.bottomBarWidth + this.state.topBarWidth + '%'
    }
  }

  standardBarStyle(studentKey, test) {
    return {
      width: this.state.bottomBarWidth + '%'
    }
  }

  extendBarStyle(studentKey, test) {
    return {
      width: this.state.topBarWidth + '%'
    }
  }

  extendZeroBarStyle() {
    return {
      width: 0 + '%'
    }
  }

  renderButton() {
    // const { student, students, studentKey, test, tests } = this.props;
    const { studentKey, test } = this.props;

    if(!test.hasTimerStarted && !test.isOver) {
      return (
        <div className="buttonContainer col-xs-12">
          {/* <div className={"buttonContainer col-xs-12" + () ? "" : "hidden"}> */}
          <button className="countBtn" onClick={() => this.startTimer(studentKey, test)}>
            <p className="countBtnText">
              start {test.name} test
            </p>
          </button>
        </div>
      )
    } else if(test.isOver && test.total > 0) {
      return (
        <div className="buttonContainer col-xs-12">
        {/* <div className={"buttonContainer col-xs-12" + () ? "" : "hidden"}> */}
          <button className="redBtn">
            <p className="countBtnText">
              {test.name} test is over
            </p>
          </button>
        </div>
      )
    } else if(test.hasTimerStarted && !test.isTimerPaused && !test.isOver) {
      return (
        <div className="buttonContainer col-xs-12">
          {/* <div className={"buttonContainer col-xs-12" + () ? "" : "hidden"}> */}
          <button className="pauseBtn" onClick={() => this.pauseTimer(studentKey, test)}>
            <p className="pauseBtnText">
              pause {test.name} test
            </p>
          </button>
        </div>
      )
    } else if(test.hasTimerStarted && test.isTimerPaused && !test.isOver) {
      return (
        <div className="buttonContainer col-xs-12">
          {/* <div className={"buttonContainer col-xs-12" + () ? "" : "hidden"}> */}
          <button className="resumeBtn col-lg-4 col-md-4 col-sm-4 col-xs-4" onClick={() => this.resumeTimer(studentKey, test)}>
            <p className="resumeBtnText">
              resume
            </p>
          </button>
          <button className="resetBtn col-lg-4 col-md-4 col-sm-4 col-xs-4" onClick={() => this.resetTimer(studentKey, test)}>
            <p className="resetBtnText">
              reset
            </p>
          </button>
          <button className="endBtn col-lg-4 col-md-4 col-sm-4 col-xs-4" onClick={() => this.endTimer(studentKey, test)}>
            <p className="endBtnText">
              end
            </p>
          </button>
        </div>
      )
    }
  }

  renderBarText() {
    const { student, students, studentKey, test, tests } = this.props;
    if(this.state.countdown - this.props.testTime(studentKey, test, "extended") > 0) {
      return (
        <p>
          {this.props.testTime(studentKey, test, "extended")}
        </p>
      )
    } else if(this.state.countdown - this.props.testTime(studentKey, test, "extended") <= 0) {
      return (
        <p>
          {/* {timer(studentKey, test).countdown} */}
          {this.state.countdown}
        </p>
      )
    }
  }

  renderBars() {
    const { student, students, studentKey, test, tests } = this.props;
    if(this.state.countdown - this.props.testTime(studentKey, test, "extended") > 0) {
      return (
        <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style={this.extendBarStyle(studentKey, test)}>
          <p className="barLabel">
            {/* {timer(studentKey, test).countdown - this.props.testTime(studentKey, "testOneExtBar")} */}
            {this.state.countdown - this.props.testTime(studentKey, test, "extendedBar")}
          </p>
        </div>
      )
    } else if(this.state.countdown - this.props.testTime(studentKey, test, "extended") <= 0) {
      return (
        <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style={this.extendZeroBarStyle()}>
        </div>
      )
    }
  }

  render() {
    const { student, students, studentKey, test, tests } = this.props;
    // console.log("student = " + student);
    // console.log("students = " + students);
    // console.log("studentKey = " + studentKey);
    // console.log("tests = " + tests);
    // console.log("test = " + test);

    // The console.logs above contain defined variables



//     if(test.total == 0 && !this.state.addInlinetest) {
//       return (
//         <div key={test.id} className="addTest dataButtonsAndBars col-xs-12">
//           <div>
//             <button className="fa fa-plus addInlinetestBtn" aria-hidden="true" name="addInlinetest" value={this.state.addInlinetest} onClick={(e) => this.handleToggle(e, true)}></button>
//           </div>
//         </div>
//       )
//     } else if(test.total == 0 && this.state.addInlinetest) {
//       return (
//         <div key={test.id} className="inlineForm buttonsAndBars">
//           <div className="inlineNameForm col-lg-6 col-md-6 col-sm-6 col-xs-6">
//             <input type="text" className="form-control testNameInput" value={test.name} placeholder="test name" onChange={(e) => this.props.handleChange(e, studentKey)}/>
//           </div>
//           <div className="inlineTestTimeForm col-lg-6 col-md-6 col-sm-6 col-xs-6">
//             <div className="quantity">
//               <input className="hourInput" type="number" min="0" max="6" step="1" value="0" onChange={(e) => this.props.handleHourChange(e, test)}/>
//             </div>
//             <div className="quantity">
//               <input className="minuteInput" type="number" min="00" max="55" step="5" value="00" onChange={(e) => this.props.handleMinuteChange(e, studentKey, test)}/>
//             </div>
//           </div>
//           {/* <div className="testTimeForm smallWidthMargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
//             <div className="quantity">
//               <input className="hourInput" type="number" min="0" max="6" step="1" defaultValue="0" ref={(input) => this.AtestHour = input}/>
//             </div>
//             <div className="quantity">
//               <input className="minuteInput" type="number" min="00" max="55" step="5" defaultValue="00" ref={(input) => this.AtestMinute = input}/>
//             </div>
//           </div> */}
//           <button type="submit" type="button" aria-hidden="true" className="fa fa-check checkAdd addTestBtn col-lg-1 col-md-1 col-sm-1 col-xs-1" name="addInlinetest" value="this.state.addInlinetest" onClick={(e) => this.handleToggle(e, false)}></button>
//         </div>
//       )
//     } else if(test.total > 0 && !this.state.addInlinetest && !this.state.hideFinishedTest) {
//       // TEST ONE DATA
//       return (
//         <div key={test.id} className="dataButtonsAndBars col-xs-12">
//         {/* <div key={test.id} className="dataButtonsAndBars col-xs-12" ref="safeDeleteHighlight" name="redHover" value="this.state.redhover" onMouseOver={(e) => this.handleToggle(e, true)} onMouseLeave={(e) => this.handleToggle(e, false)}> */}
//         {/* <div className={"dataButtonsAndBars col-xs-12" + (student.isSafeToDelete) ? "deleteHighlight" : ""} onMouseOver={() => this.changeState(this.state.redHover, true)} onMouseLeave={() => this.changeState(this.state.redHover, false)}> */}
//           <div className="testTimeData">
// {/* test hide */}
//             {/* <div className="hideTest col-lg-1 col-md-1 col-sm-1 col-xs-1"> */}
//             {/* <div className="hideTest col-lg-1 col-md-1 col-sm-1 col-xs-1" ref = "redHover"> */}
//             {/* <div className={"hideTest col-lg-1 col-md-1 col-sm-1 col-xs-1" + (this.state.redHover && test.isOver) ? "hidden" : ""}> */}
//               {/* <div> */}
//                 {/* <i className="fa fa-minus" aria-hidden="true" onClick={() => this.changeState(this.state.hideFinishedTest, true)}></i> */}
//                 {/* <button className="fa fa-minus hideFinishedTestBtn" aria-hidden="true" name="hideFinishedTest" value="this.state.hideFinishedTest" onClick={(e) => this.handleToggle(e, true)}></button> */}
//               {/* </div> */}
//             {/* </div> */}
//             <div className="testTimeCell marginLeft marginRight col-xs-12">
//               <p className="dataPointLabel col-lg-5 col-md-5 col-sm-5 col-xs-12">
//                 started:
//               </p>
//               <p className="dataPoint col-lg-7 col-md-7 col-sm-7 col-xs-12">
//                 {this.props.startTime(test)}
//               </p>
//             </div>
//             <div className= "testTimeCell marginLeft marginRight col-xs-12">
//               <p className="dataPointLabel col-lg-5 col-md-5 col-sm-5 col-xs-12">
//                 paused:
//               </p>
//               <p className="dataPoint col-lg-6 col-md-6 col-sm-6 col-xs-6">
//                 {parseTime(test.pausedTotal).hourMinSec}
//               </p>
//             </div>
//             <div className="testTimeCell marginLeft marginRight col-xs-12">
//               <p className="dataPointLabel col-lg-5 col-md-5 col-sm-5 col-xs-12">
//                 std. end:
//               </p>
//               <p className="dataPoint col-lg-7 col-md-7 col-sm-7 col-xs-12">
//                 {this.props.endTime(test, "standard")}
//               </p>
//             </div>
//             <div className="testTimeCell marginLeft marginRight col-xs-12">
//               <p className="dataPointLabel col-lg-5 col-md-5 col-sm-5 col-xs-12">
//                 ext. end:
//               </p>
//               <p className="dataPoint col-lg-6 col-md-6 col-sm-6 col-xs-6">
//                 {this.props.endTime(test, "extended")}
//               </p>
//             </div>
//           </div>
// {/* TEST ONE NAME */}
//           <div className="buttonsAndBars">
//             <div className="testNameCell marginRight marginLeft">
//               {this.renderButton()}
//             </div>
// {/* BEGIN TEST ONE BARS */}
//             <div className="bars col-xs-12">
//               <div className="progress fullBar">
//                 <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style={this.fullBarStyle(studentKey, test)}>
//                   <p className="barLabel">
//                     {/* {timer(studentKey, test).countdown} */}
//                     {this.state.countdown}
//                   </p>
//                 </div>
//               </div>
//               <div className="progress splitBar"> {/* Begin Bars */}
//                 <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style={this.standardBarStyle(studentKey, test)}>
//                   {this.renderBarText()}
//                 </div>
//                 {this.renderBars()}
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }
  } // end of renderTests

} // end of Test class

Test.propTypes = {
  test: PropTypes.object.isRequired,
  // addToOrder: PropTypes.func.isRequired
}


export default Test;
