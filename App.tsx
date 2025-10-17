import React, { useState } from 'react';
import { View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet,KeyboardAvoidingView,Platform,ScrollView,Alert,} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';


type Course = 'Starters' | 'Mains' | 'Dessert';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
}

export default function App() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [screen, setScreen] = useState<'home' | 'add'>('home');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Starters');
  const [priceText, setPriceText] = useState('');

  const COURSES: Course[] = ['Starters', 'Mains', 'Dessert'];

  const handleAddItem = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter the dish name.');
      return;
    }
    const price = Number(priceText);
    if (isNaN(price) || price < 0) {
      Alert.alert('Validation', 'Please enter a valid price.');
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      course,
      price,
    };

    setItems(prev => [...prev, newItem]);
    clearForm();
    setScreen('home');
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setCourse('Starters');
    setPriceText('');
  };

  const handleClearAll = () => {
    Alert.alert('Clear all', 'Remove all menu items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setItems([]) },
    ]);
  };

  // === HOME SCREEN ===
  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu Items</Text>
          <Text style={styles.count}>Total: {items.length}</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No menu items yet — add one below.</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.itemName}>
                  {item.name} — R{item.price.toFixed(2)}
                </Text>
                <Text style={styles.itemCourse}>{item.course}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
            )}
          />
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setScreen('add')}>
            <Text style={styles.btnText}>Add Menu Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={handleClearAll}>
            <Text style={styles.btnSecondaryText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // === ADD ITEM SCREEN ===
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>Add Menu Item</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Dish name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter dish name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 90 }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Short description"
            multiline
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={course} onValueChange={value => setCourse(value as Course)}>
              {COURSES.map(c => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={styles.input}
            value={priceText}
            onChangeText={setPriceText}
            placeholder="e.g. 45.00"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddItem}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              clearForm();
              setScreen('home');
            }}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  count: { fontSize: 14, color: '#666', marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16, textAlign: 'center' },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemCourse: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  itemDesc: { fontSize: 14, color: '#333', marginTop: 6 },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
  btnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnSecondaryText: { color: '#374151' },

  formContainer: { padding: 16, paddingBottom: 40 },
  formTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
  },
  actions: { flexDirection: 'row', marginTop: 16 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelBtnText: { color: '#374151' },
});
