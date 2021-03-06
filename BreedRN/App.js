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
            realm.create("Task", { name: "Ali" });
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
    <SafeAreaView style={styles.container}>
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
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
