import React from "react";
import { FlatList, StyleSheet, View, Platform, Text, TouchableOpacity, Image,ScrollView } from "react-native";
import { Appbar, Button, Card, Headline } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/firestore";
import { RewardModel } from "../models/reward"

const PostList = (props) => {

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
      <Button icon = "heart-outline" > { reward.amt }</Button>
    )
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
	  <Button onPress = {() => navigation.navigate('PostDetailScreen', {claim: data.item })}> Found </Button>
	  {showReward(data.item.reward)}
        </Card.Actions>
      </Card>
  );

  return (
    <FlatList
      data={props.data}
      renderItem={renderItem}
      keyExtractor={(_: any, index: number) => "key-" + index}
      ListEmptyComponent={emptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  cardImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 150,
  },
  cardInfo: {
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  colorContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  cardStatus: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  leftStatusContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rightStatusContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontFamily: "kanit-light",
    fontSize: 17,
    paddingVertical: 5,
  },
  statusText: {
    color: "white",
  },
});

export default PostList;
