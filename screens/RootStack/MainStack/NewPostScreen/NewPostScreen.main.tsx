import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { ScrollView, Image, Text, View, Platform, Keyboard, TouchableWithoutFeedback  } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./NewPostScreen.styles";
import firebase from "firebase/app";
import "firebase/firestore";
import { PostModel } from "../../../models/post";
import * as ImagePicker from "expo-image-picker";
import NumberPlease from "react-native-number-please";
import { getFileObjectAsync } from "../../../../Utils";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "NewPostScreen">;
  route: RouteProp<MainStackParamList, "NewPostScreen">;
}

export default function NewPostScreen({ route, navigation }: Props) {

  const initialRewards = [{ id: "reward", value: 0 }];

  const { profile } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [reward, setReward] = useState(initialRewards);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const currentUserId = firebase.auth().currentUser!.uid;
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          //alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("HomeScreen")} />
        <Appbar.Content title="Create Post" />
      </Appbar.Header>
    );
  };
  
  const createPost  = async () => {
    if (!image) {
      showError("Please choose an image.");
      return;
    } else {
      setLoading(true);
    }
    try {
      console.log("getting file object");
      console.log(currentUserId);
      const object: Blob = (await getFileObjectAsync(image)) as Blob;
      console.log("Blob Created")
      const postRef = firebase.firestore().collection("posts").doc();
      console.log("putting file object");
      const result = await firebase
        .storage()
        .ref()
        .child(postRef.id + ".jpg")
        .put(object);
      console.log("getting download url");
      const downloadURL = await result.ref.getDownloadURL();
      const doc: PostModel = {
        id: postRef.id,
        avatar: downloadURL,
        userID: currentUserId,
        title: title,
        description: description,
        categoryId: categoryId

      };
      console.log("setting download url");
      await postRef.set(doc,true);

      const rewardRef = firebase.firestore().collection("rewards").doc(postRef.id)
      const rewardDoc: RewardModel = {
        userID: currentUserId,
        amt: reward[0].value,
        

      };
      await rewardRef.set(rewardDoc,true);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      showError(error.toString());
    }
  };
  
  const pickImage = async () => {
    console.log("picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("done");
    console.log("done");
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  const MultiLineTextInput = (props) => {
  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      //editable
      maxLength={40}
    />
  );
  }
  
  const rewardNumbers = [{ id: "reward", label: "", min: 0, max: 10 }];
  return (
    <>
      <Bar />
      <ScrollView style={{ ...styles.container, padding: 20 }}>
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
        />
        <TextInput
          style={styles.input}
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
        />
        <Image
          style={styles.userImage}
          source={ {uri: image}}
        />
        <Button mode="outlined" onPress={pickImage} style={{ marginTop: 20 }}>
          {image ? "Change Image" : "Pick an Image"}
        </Button>
        <View>
        <Text>Reward Points</Text>
        <NumberPlease
          digits={rewardNumbers}
          values={reward}
          onChange={(values) => setReward(values)}
        />
        </View>
        <Button mode="outlined" onPress={createPost} style={{ marginTop: 20 }} >
           Create
        </Button>
        <Text></Text>
      </ScrollView>
    </>
  );
}
