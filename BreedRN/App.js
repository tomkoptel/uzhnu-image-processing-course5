import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";

import Realm from "realm";

import Icon from "react-native-vector-icons/FontAwesome";
const myIcon = <Icon name="rocket" size={30} color="#900" />;

const TaskSchema = {
  name: "Task",
  properties: {
    name: "string",
  },
};
const config = {
  deleteRealmIfMigrationNeeded: true,
  schema: [TaskSchema],
};

export default function App() {
  // To build refreshig state https://www.pluralsight.com/guides/display-a-list-using-the-flatlist-component-in-react-native
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then((response) => response.json())
      .then((json) => {
        let keys = Object.keys(json.message);
        let uniqueKeys = new Set(keys);
        let data = Array.from(uniqueKeys);
        Realm.open(config).then((realm) => {
          console.log(realm);
          realm.write(() => {
            // realm.create("Task", { name: "Ali" });
          });

          const tasks = realm.objects("Task");
          console.log(tasks);

          setData(data);
          realm.close();
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => <Item title={item} />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      )}
    </SafeAreaView>
  );
}

const Item = ({ title }) => (
  <View
    style={{
      height: 100,
      padding: 20,
      flexDirection: "row",
    }}
  >
    <View style={{ flex: 2, backgroundColor: "red" }}>
      <Text
        style={{
          fontSize: 32,
        }}
      >
        {title}
      </Text>
    </View>
    <View style={{ flex: 1, backgroundColor: "darkorange" }}>
      <Text>
        <Icon name="rocket" size={30} color="#900" />
      </Text>
    </View>
  </View>
);
