import { StyleSheet } from "react-native";
import { AppStyles } from "../../../../AppStyles";

export const styles = StyleSheet.create({
  ...AppStyles,
  image: {
    width: 160,
    height: 160
  },
  logo: {
    alignSelf: 'flex-end',
    marginTop: -5,
    position: 'absolute', // add if dont work with above
  },
  button: {
    backgroundColor: "#F7C46B",
    borderRadius: 10,
    justifyContent: 'center',
    width: 200,
    height:40,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',

  },
  toggle: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: 200,
    height:40,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
