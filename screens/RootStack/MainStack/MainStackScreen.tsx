import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen/HomeScreen.main";
import NewPostScreen from "./NewPostScreen/NewPostScreen.main";
import PostDetailScreen from "./PostDetailScreen/PostDetailScreen.main";
import MyPostScreen from "./MyPostScreen/MyPostScreen.main";
import { ProfileModel } from "../../../models/profile";
import { PostModel } from "../../../models/post";

export type MainStackParamList = {
  HomeScreen: { profile: ProfileModel };
  NewGroupScreen: { profile: ProfileModel };
  PostDetailScreen: { data: '' };
  ProfileScreen: undefined;
  MyPostScreen: {}
};

const MainStack = createStackNavigator<MainStackParamList>();

export function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="HomeScreen"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <MainStack.Screen
        name="NewPostScreen"
        options={{ headerShown: false }}
        component={NewPostScreen}
      />
      <MainStack.Screen
        name="PostDetailScreen"
        options={{ headerShown: false }}
        component={PostDetailScreen}
      />
      <MainStack.Screen
        name="MyPostScreen"
        options={{ headerShown: false }}
        component={MyPostScreen}
      />
    </MainStack.Navigator>
  );
}
