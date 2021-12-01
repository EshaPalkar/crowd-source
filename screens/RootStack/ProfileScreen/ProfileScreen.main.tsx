import React, { useState, useEffect } from "react";
import { Image, Platform, View, Keyboard, TouchableWithoutFeedback} from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example
import * as ImagePicker from "expo-image-picker";
import { styles } from "./ProfileScreen.styles";

import firebase from "firebase/app";
import "firebase/firestore";
import { UserProfileModel } from "../../../models/profile";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "ProfileScreen">;
}
export default function ProfileScreen({ navigation, route }: Props) {
  const { profile } = route.params;
  // Event details.
  const [image, setImage] = useState<string | undefined>(undefined);
  // Snackbar.
  const [message, setMessage] = useState("");
  // Loading state for submit button
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const currentUserId = firebase.auth().currentUser!.uid;

  // Code for ImagePicker (from docs)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  // Code for ImagePicker (from docs)
  const pickImage = async () => {
    console.log("picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("done");
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  // Code for SnackBar (from docs)
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  // This method is called AFTER all fields have been validated.
  const save = async () => {
    if (!image) {
      showError("Please choose an image.");
      return;
    } else {
      setLoading(true);
    }

    try {
      // Firestore wants a File Object, so we first convert the file path
      // saved in eventImage to a file object.
      console.log("getting file object");
      const object: Blob = (await getFileObjectAsync(image)) as Blob;
      // Generate a brand new doc ID by calling .doc() on the  userprofile.
      const userProfileRef = firebase.firestore().collection("userprofile").doc(currentUserId);
      console.log("putting file object");
      const result = await firebase
        .storage()
        .ref()
        .child(userProfileRef.id + ".jpg")
        .put(object);
      console.log("getting download url");
      const downloadURL = await result.ref.getDownloadURL();
      // TODO: You may want to update this SocialModel's default
      // fields by adding one or two attributes to help you with
      // interested/likes & deletes
      const doc: ProfileModel = {
        avatar: downloadURL,
        userID: currentUserId,
        rewards: 5
      };
      console.log("setting download url");
      await userProfileRef.set(doc,true);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      showError(error.toString());
    }
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        <Image
          style={styles.userImage}
          source={ {uri: !image ? profile.avatar : image}}
        />
        <Button mode="outlined" onPress={pickImage} style={{ marginTop: 20 }}>
          {image ? "Change Image" : "Pick an Image"}
        </Button>
        <Button icon = {require('../../../assets/money.png')} > 5 </Button>
        <Button
          mode="contained"
          onPress={save}
          style={{ marginTop: 20 }}
          loading={loading}
        >
          Save 
        </Button>
        <Snackbar
          duration={3000}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {message}
        </Snackbar>
      </View>
    </>
  );
}
