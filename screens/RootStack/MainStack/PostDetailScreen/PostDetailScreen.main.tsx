import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, Image, Text, View } from "react-native";
import {  Button, IconButton, Card, Headline } from "react-native-paper";
import { Appbar } from "react-native-paper";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./PostDetailScreen.styles";
import firebase from "firebase/app";
import "firebase/firestore";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "PostDetailScreen">;
  route: RouteProp<MainStackParamList, "PostScreen">;
}

export default function PostDetailScreen({ route, navigation }: Props) {
  const { data } = route.params;

  const currentUserId = firebase.auth().currentUser!.uid;

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("HomeScreen")} />
        <Appbar.Content title="Post Detail" />
      </Appbar.Header>
    );
  };
  
  const notify = (item) => {
    const ref = firebase.firestore().collection("notification").doc(item.post.id)
    const trans: NotificationModel = {
      id: item.post.id,
      finder_userID: item.post.userID,
      seeker_userID: currentUserId,
      amt: item.reward.amt,
      transactionDt: new Date().toLocaleString() + ''
    }
    ref.set(trans, true)
    navigation.navigate("HomeScreen");
  };

  return (
    <>
      <Bar />
      <ScrollView style={styles.container}>
        <View style={styles.view}>
          <Image style={styles.image} source={{ uri: data.item.post.avatar }} />
          <Text style={{ ...styles.h1, marginVertical: 10 }}>
            {data.item.post.title}
          </Text>
          <Text style={{ ...styles.subtitle, marginBottom: 5 }}>
            {data.item.post.description}
          </Text>
          <Text style={{ ...styles.subtitle, marginBottom: 5 }}>
            {data.item.post.address}
          </Text>
          <Button icon = {require('../../../../assets/money.png')} > { data.item.reward.amt } </Button>
          <View style={styles.button}>
            <Button onPress={ () => notify(data.item)} > Found </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
