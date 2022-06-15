import React from "react";
import { View, Text, Modal, ActivityIndicator, StyleSheet } from "react-native";
import { colors, typography } from "../themes";

export function Loader(props) {
  return (
    <Modal transparent={true} visible={props.visible} animationType="none">
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.darkSky} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#rgba(0,0,0,0.2)",
  },
  text: {
    color: colors.white,
    fontSize: 18,
    marginTop: 10,
    fontFamily: typography.ExtraBold
  },
});
