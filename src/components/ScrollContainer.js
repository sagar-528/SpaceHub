import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export function ScrollContainer(props) {
  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        // automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        contentContainerStyle={{ ...props.style, ...styles.keyboard }}
      >
        {props.children}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    // height:scaleHeight('100%'),
    flexGrow: 1,
  },
});
