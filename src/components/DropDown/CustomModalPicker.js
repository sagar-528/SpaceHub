import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { colors, typography } from "../../themes";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function CustomModalPicker(props) {
  const {
    setSelectedValue,
    selectedValue,
    changeModalVisibility,
    setData,
    OPTIONS,
    title,
  } = props;

  const onPressItem = (option) => {
    // console.log(option, " backing");
    changeModalVisibility(false);
    setData(option);
  };

  function nFormatter(num) {
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
       return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
       return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

  const option = OPTIONS.map((item, index) => {
    // console.log(item, index, "inside");
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => {
          onPressItem(item);
          // console.log(item, "selected item");
        }}
      >
        <Text style={styles.text}>{nFormatter(item)}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => changeModalVisibility(false)}
      style={styles.container}
    >
      <View style={[styles.modal, { width: WIDTH - 60, height: HEIGHT / 2.5 }]}>
        <ScrollView showsVerticalScrollIndicator={true}>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  option: {
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
    margin: 10,
    color: 'black',
    fontWeight: '600',
    fontFamily: typography.secondary,
  },
});
