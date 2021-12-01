import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Image, View, FlatList, Switch, Text, TouchableOpacity,ScrollView } from "react-native";
import { Appbar, Button, IconButton, Card, Headline } from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { ProfileModel } from "../../../../models/profile.js";
import { styles } from "./HomeScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
import { SafeAreaView } from "react-native-safe-area-context";
import ToggleSwitch from 'toggle-switch-react-native'
import { Ionicons } from "@expo/vector-icons";

/* 
  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation!
*/
interface Props {
  navigation: StackNavigationProp<MainStackParamList, "HomeScreen">;
}

export default function HomeScreen({ navigation }: Props) {
  //const { profile } = route.params;
  const [profile, setProfile] = useState<ProfileModel>(null);
  const [showPosts, setShowPosts] = useState<PostModel[]>([]);
  const isFocused = useIsFocused();
  const [userPosts, setUserPosts] = useState(undefined);

  const currentUserId = firebase.auth().currentUser!.uid;
 
  const loadPosts = () => {
    try {
      var postsRef = firebase.firestore().collection("posts").get();
      var posts = []
      var uposts = []
      postsRef.then( items => {
       
      items.forEach( post => {
         const data = post.data();
         const p: PostModel = { 
           id: data.id,
           userID: data.userID,
           title: data.title,
           description: data.description,
           avatar: data.avatar
         }
         var rewardRef =  firebase.firestore().collection("rewards").doc(data.id).get()
         rewardRef.then( r => {
           var pr = {
             post: p,
             reward: r.data(),
           }
         data.userID != currentUserId ? posts.push(pr) : uposts.push(pr)
         })
        
      })
      setShowPosts(posts);
      setUserPosts(uposts);
      console.log('----');
      //console.log(posts)
      console.log('Fetched')
      })

    } catch (error) {
      console.log(error.message);
    }
  };


  useEffect(() => {
    const ref = firebase.firestore().collection("userprofile").doc(currentUserId);
    
    var doc_data = ref.get();
    doc_data.then( (data) => {
      const p: ProfileModel = {
        userID: data.get("userID"),
        isOnline: true,
        avatar : data.get("avatar"),
        email: data.get("email"),
        rewards: data.get("rewards")
      };
      setProfile(p);
      loadPosts()
      //ref.set(p, true).then( () => {}).catch(error => console.log(error));
    }).catch(error => console.log(error));
    
  }, []);
  
  const noEvents = () => {
    return (
      <SafeAreaView>
        <Headline >No Events so far! Add some!!</Headline>
        </SafeAreaView>
    )
  }

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Home" />
        <IconButton
          icon="account"
          color="#FFFFFF"
          size={30}
          onPress={() => navigation.navigate("ProfileScreen", {profile: profile})}
        />
      </Appbar.Header>
    );
  };
  
  const emptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.titleText}>No Posts</Text>
    </View>
  );


  const showReward = (reward: RewardModel) => {
    console.log(reward)
    return (
      <Button icon = {require('../../../../assets/money.png')} > { reward.amt }</Button>
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
          <Button onPress = {() => navigation.navigate('PostDetailScreen', {data: data })}> Lost </Button>
          {showReward(data.item.reward)}
        </Card.Actions>
      </Card>
  );

  return (
    <>
      <Bar />
      <SafeAreaView>
        <View style={styles.button}>
          <Button onPress = {() => navigation.navigate("NewPostScreen", {profile: profile}) }> New Post</Button>
        </View>
        <View style={styles.button}>
          <Button onPress = {() => navigation.navigate("MyPostScreen", {data: userPosts}) }> My Post</Button>
        </View>
        <FlatList
          data={showPosts}
          renderItem={renderItem}
          keyExtractor={(_: any, index: number) => "key-" + index}
          ListEmptyComponent={emptyComponent}
        />
      </SafeAreaView>
    </>
  );
}
