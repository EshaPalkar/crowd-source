import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { ScrollView, FlatList, Image, Text, View } from "react-native";
import {  Button, IconButton, Card, Headline } from "react-native-paper";
import { Appbar } from "react-native-paper";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./MyPostScreen.styles";
import firebase from "firebase/app";
import "firebase/firestore";
import { NotificationModel } from "../../../../models/notification";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "MyPostScreen">;
  route: RouteProp<MainStackParamList, "PostScreen">;
}

export default function MyPostScreen({ route, navigation }: Props) {
  const { data } = route.params;

  const [found, setFound] = useState(false);
  const [foundDetail, setFoundDetail] = useState(NotificationModel);
  const currentUserId = firebase.auth().currentUser!.uid;

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("HomeScreen")} />
        <Appbar.Content title="My Posts" />
      </Appbar.Header>
    );
  };
  
  const claimReward = (item) => {
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
  
  const emptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={
          Platform.OS === "android" ? "md-close-circle" : "ios-close-circle"
        }
        color="black"
        size={80}
      />
      <Text style={styles.text}></Text>
    </View>
  );


  const showReward = (reward: RewardModel) => {
    console.log(reward)
    return (
      <Button icon = {require('../../../../assets/money.png')} > { reward.amt }</Button>
    )
  }
  
  const renderStatus = (data) => {

  const ref = firebase.firestore().collection("notification").doc(data.item.post.id).get()
  ref.then( (t) => {
    setFound(t.exists);
  })

  return(
    <Button > {found ? "Found" : "Lost"} </Button>
   )
  }
  
  const reward = async (data) => {
    const ref = await firebase.firestore().collection("notification").doc(data.item.post.id).get()
    const ndata = ref.data()
    console.log(ndata)
    const sref = await firebase.firestore().collection("userprofile").doc(ndata.seeker_userID).get()
    const sdata = sref.data()
    var nreward=sdata.rewards + data.item.reward.amt;
    const res = await firebase.firestore().collection("userprofile").doc(ndata.seeker_userID).set({rewards: nreward }, { merge: true })
    console.log(res)
    const dres = await firebase.firestore().collection("notification").doc(data.item.post.id).delete()
    const pres = await firebase.firestore().collection("posts").doc(data.item.post.id).delete()
    const rres = await firebase.firestore().collection("rewards").doc(data.item.post.id).delete()
  }

  const renderItem = (data) => (
    <Card  style={{ margin: 16 }}>
        <Card.Cover source={{ uri: data.item.post.avatar }} />
        <Card.Title
          title={data.item.post.title}
          subtitle={
            data.item.post.description
          }
        />
        <Card.Actions>
          { renderStatus(data) }
          {showReward(data.item.reward)}
          <Button onPress = {() => reward(data) }> Reward </Button>
        </Card.Actions>
      </Card>
  );
  

  return (
    <>
      <Bar />
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_: any, index: number) => "key-" + index}
          ListEmptyComponent={emptyComponent}
        />
      </View>
    </>
  );
}
