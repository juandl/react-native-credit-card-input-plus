import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

import {
  TextInputPropTypes,
  ViewPropTypes,
} from "deprecated-react-native-prop-types";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {},
  cardViewContainer: {
    alignItems: "center",
  },
  form: {
    marginTop: 20,
  },
  formContainer: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
});

const CVC_INPUT_WIDTH = 70;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH =
  Dimensions.get("window").width -
  EXPIRY_INPUT_WIDTH -
  CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    inputStyle: TextInputPropTypes.style,
    labelStyle: TextInputPropTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,
    horizontalScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInputPropTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {},
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    horizontalScroll: true,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  UNSAFE_componentWillReceiveProps = (newProps) => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = (field) => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      (e) => {
        throw e;
      },
      (x) => {
        scrollResponder.scrollTo({
          x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0),
          animated: true,
        });
        this.refs[field].focus();
      }
    );
  };

  _inputProps = (field) => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  getStylesCCInput = ({ defaultWidth }) => {
    let _styles = [s.inputContainer];

    // If horizontal is opn
    if (this.props.horizontalScroll) {
      _styles.push({
        marginLeft: 10,
        width: defaultWidth,
      });
    }

    if (this.props.inputContainerStyle) {
      _styles.push(this.props.inputContainerStyle);
    }

    return _styles;
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      values: { number, expiry, cvc, name, type },
      focused,
      allowScroll,
      horizontalScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
    } = this.props;

    return (
      <View style={s.container}>
        <View style={s.cardViewContainer}>
          <CreditCard
            focused={focused}
            brand={type}
            scale={cardScale}
            fontFamily={cardFontFamily}
            imageFront={cardImageFront}
            imageBack={cardImageBack}
            customIcons={cardBrandIcons}
            name={requiresName ? name : " "}
            number={number}
            expiry={expiry}
            cvc={cvc}
          />
        </View>

        <ScrollView
          ref="Form"
          horizontal={horizontalScroll}
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={s.form}
          contentContainerStyle={s.formContainer}
        >
          <CCInput
            {...this._inputProps("number")}
            keyboardType="numeric"
            containerStyle={this.getStylesCCInput({
              defaultWidth: CARD_NUMBER_INPUT_WIDTH,
            })}
          />
          <CCInput
            {...this._inputProps("expiry")}
            keyboardType="numeric"
            containerStyle={this.getStylesCCInput({
              defaultWidth: EXPIRY_INPUT_WIDTH,
            })}
          />
          {requiresCVC && (
            <CCInput
              {...this._inputProps("cvc")}
              keyboardType="numeric"
              containerStyle={this.getStylesCCInput({
                defaultWidth: CVC_INPUT_WIDTH,
              })}
            />
          )}
          {requiresName && (
            <CCInput
              {...this._inputProps("name")}
              containerStyle={this.getStylesCCInput({
                defaultWidth: NAME_INPUT_WIDTH,
              })}
            />
          )}
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={this.getStylesCCInput({
                defaultWidth: POSTAL_CODE_INPUT_WIDTH,
              })}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}
