import React from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
  return (
   
    <View>
      <Image source={{uri: '../assets/logo.png'}} style={styles.Logo} resizeMode="cover">
    <Text style={styles.title}>HomePage</Text>

    
    
    </Image>

    
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Christofer's Kitchen App😘😘</Text>
          <Text style={styles.subtitle}>Welcome to Christopher's Kitchen Application</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter Dish Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Dish Name"
            placeholderTextColor="grey"
          />

          <Text style={styles.label}>Enter Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="grey"
          />

          <Text style={styles.label}>Enter Price:</Text>
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Add Smoothie</Text>
        </Pressable>

        <View style={styles.itemsHeader}>
          <Text style={styles.itemsHeaderText}>Total Items: (Will Show All Smoothies)</Text>
        </View>
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsText}>All Smoothie Items Will Appear Here</Text>
        </View>
      </SafeAreaView>
    </Image>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  subtitle: {
    color: "purple",
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
  },
  label: {
    color: "black",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 6,
    marginBottom: 12,
    padding: 8,
    color: "black",
    backgroundColor: "#f7f7f7",
  },
  button: {
    backgroundColor: "purple",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 18,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  itemsHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  itemsHeaderText: {
    color: "black",
    fontWeight: "500",
  },
  itemsContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 10,
    borderRadius: 8,
    minHeight: 40,
    justifyContent: "center",
  },
  itemsText: {
    color: "black",
    textAlign: "center",
  },
});

