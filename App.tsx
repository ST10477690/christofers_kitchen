import React, { useState } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  FlatList,  StyleSheet,  KeyboardAvoidingView,  Platform,  ScrollView,  Alert,  ImageBackground,  Image,} from 'react-native';
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
  const defaultItems: MenuItem[] = [
    {
      id: '1',
      name: 'Garlic Bread',
      description: 'Toasted baguette slices with garlic butter and herbs.',
      course: 'Starters',
      price: 35,
    },
    {
      id: '2',
      name: 'Grilled Chicken',
      description: 'Juicy grilled chicken breast served with veggies.',
      course: 'Mains',
      price: 85,
    },
    {
      id: '3',
      name: 'Beef Burger',
      description: 'Thick beef patty with cheese, lettuce, and tomato.',
      course: 'Mains',
      price: 95,
    },
    {
      id: '4',
      name: 'Chocolate Cake',
      description: 'Moist chocolate sponge with rich ganache.',
      course: 'Dessert',
      price: 55,
    },
    {
      id: '5',
      name: 'Greek Salad',
      description: 'Fresh salad with feta cheese, olives, and dressing.',
      course: 'Starters',
      price: 45,
    },
  ];

  const [items, setItems] = useState<MenuItem[]>(defaultItems);
  const [screen, setScreen] = useState<'home' | 'add' | 'filter'>('home');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Starters');
  const [priceText, setPriceText] = useState('');

  const COURSES: Course[] = ['Starters', 'Mains', 'Dessert'];

  // Calculate average prices per course
  const calculateAveragePrices = () => {
    const averages: Record<Course, number> = { Starters: 0, Mains: 0, Dessert: 0 };
    COURSES.forEach(course => {
      const courseItems = items.filter(item => item.course === course);
      if (courseItems.length > 0) {
        const total = courseItems.reduce((sum, i) => sum + i.price, 0);
        averages[course] = total / courseItems.length;
      }
    });
    return averages;
  };

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

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // === HOME SCREEN ===
  if (screen === 'home') {
    const averages = calculateAveragePrices();

    return (
      <ImageBackground
        source={require('./assets/logo_jpg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image
                source={require('./assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>🍴 Christopher's Kitchen</Text>
            </View>
            <Text style={styles.count}>Total: {items.length} items</Text>
          </View>

          {/* Average Prices Section */}
          <View style={styles.avgSection}>
            <Text style={styles.avgTitle}>Average Prices</Text>
            {Object.entries(averages).map(([course, avg]) => (
              <Text key={course as Course} style={styles.avgText}>
                {course}: R{avg.toFixed(2)}
              </Text>
            ))}
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
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCourse}>{item.course}</Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                    <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                  </View>
                </View>
              )}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setScreen('add')}>
              <Text style={styles.btnText}>Add Menu Item</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnPrimary} onPress={() => setScreen('filter')}>
              <Text style={styles.btnText}>Filter by Course</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} onPress={handleClearAll}>
              <Text style={styles.btnSecondaryText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // === ADD ITEM SCREEN ===
  if (screen === 'add') {
    return (
      <ImageBackground
        source={require('./assets/logo_jpg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView contentContainerStyle={styles.overlay}>
            <View style={styles.logoRow}>
              <Image
                source={require('./assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.formTitle}>Add Menu Item</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Dish name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter dish name"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 90 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Short description"
                placeholderTextColor="#888"
                multiline
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Course</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={course}
                  onValueChange={value => setCourse(value as Course)}
                >
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
                placeholderTextColor="#888"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddItem}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  if (items.length === 0) {
                    Alert.alert('Delete', 'There are no items to delete.');
                    return;
                  }
                  const lastItem = items[items.length - 1];                 
                  Alert.alert('Delete Last Item', `Delete "${lastItem.name}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        setItems(prev => prev.slice(0, -1));
                        clearForm();                       
                        Alert.alert('Deleted', `${lastItem.name} was removed.`);
                      },
                    },
                  ]);
                }}
              >
                <Text style={styles.deleteBtnText}>Delete Last</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  // === FILTER BY COURSE SCREEN ===
  if (screen === 'filter') {
    const [filterCourse, setFilterCourse] = useState<'All' | Course>('All');

    const filteredItems =
      filterCourse === 'All' ? items : items.filter(item => item.course === filterCourse);

    return (
      <ImageBackground
        source={require('./assets/logo_jpg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.logoRow}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>🍽 Filter by Course</Text>
          </View>

          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={filterCourse}
              onValueChange={value => setFilterCourse(value as 'All' | Course)}
            >
              <Picker.Item label="All" value="All" />
              {COURSES.map(c => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text style={styles.emptyText}>No items found</Text>}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCourse}>{item.course}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                  <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setScreen('home')}>
              <Text style={styles.btnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return null;
}

// === STYLES ===
const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', padding: 16 },
  header: { marginBottom: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  logo: { width: 50, height: 50, marginRight: 10 },
  title: { fontSize: 22, fontWeight: '700' },
  count: { fontSize: 14, color: '#666', marginTop: 4 },
  avgSection: { marginVertical: 12, backgroundColor: '#f3f4f6', padding: 10, borderRadius: 8 },
  avgTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  avgText: { fontSize: 15, color: '#374151' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#555', fontSize: 16, textAlign: 'center' },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: 'rgba(243, 244, 246, 0.95)',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: { fontSize: 17, fontWeight: '700', color: '#111' },
  itemCourse: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  itemDesc: { fontSize: 14, color: '#333', marginTop: 6 },
  itemPrice: { fontSize: 15, fontWeight: '600', color: '#2563eb', marginTop: 8 },
  deleteIcon: { fontSize: 18, color: 'red', marginLeft: 8 },
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
  formTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
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
  deleteBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
    backgroundColor: '#fee2e2',
  },
  deleteBtnText: { color: '#b91c1c', fontWeight: '600' },
});