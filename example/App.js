import React, { useState } from "react";
import { StyleSheet, View, Switch } from "react-native";

import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input-plus";

const Sty = StyleSheet.create({
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

const ExampleApp = () => {
  const [liteView, setLiteView] = useState(false);

  const onChange = (formData) => {
    console.log(JSON.stringify(formData, null, " "));
  };

  const onFocus = (field) => {
    console.log("focusing", field);
  };

  return (
    <View style={Sty.container}>
      <Switch
        style={Sty.switch}
        onValueChange={() => setLiteView((prev) => !prev)}
        value={liteView}
      />

      {liteView ? (
        <LiteCreditCardInput
          autoFocus
          inputStyle={Sty.input}
          validColor={"black"}
          invalidColor={"red"}
          placeholderColor={"darkgray"}
          onFocus={onFocus}
          onChange={onChange}
        />
      ) : (
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          // horizontalScroll={false}
          requiresPostalCode
          labelStyle={Sty.label}
          inputStyle={Sty.input}
          validColor={"black"}
          invalidColor={"red"}
          style
          placeholderColor={"darkgray"}
          onFocus={onFocus}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default ExampleApp;
