import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


var JSXParser = require("../helpers/jsxparser");

class MyPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            htmlText: ''
        }

    }
  componentWillMount() {
      var jsxParser = new JSXParser();
      var htmlText = jsxParser.render([
          {
              data: {
                  xyz: "123"
              },
              template:`<div>{xyz}</div>`
          },
          {
              data: {
                  xyz: "123",
                  item: { text: `Hello` }
              },
              template:
                  `<div>{xyz}<span className="span-class">{item.text}</span></div>`
          }
      ]);

      this.setState({
          htmlText: htmlText
      })
  }


  render() {
      return (<div>
                <p>{this.state.htmlText}</p>
          </div>

          )

  }
}

export default MyPage