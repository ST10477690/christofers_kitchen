import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
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
  // Screen will be 'home' for menu view/filter, 'add' for adding items
  const [screen, setScreen] = useState<'home' | 'add'>('home');
  const [filterCourse, setFilterCourse] = useState<'All' | Course>('All');

  // Form states for Add Screen
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Starters');
  const [priceText, setPriceText] = useState('');

  const COURSES: Course[] = ['Starters', 'Mains', 'Dessert'];

  // Calculate average prices per course (Memoized for performance)
  const averages = useMemo(() => {
    const calculatedAverages: Record<Course, number> = { Starters: 0, Mains: 0, Dessert: 0 };
    COURSES.forEach(courseKey => {
      const courseItems = items.filter(item => item.course === courseKey);
      if (courseItems.length > 0) {
        const total = courseItems.reduce((sum, i) => sum + i.price, 0);
        calculatedAverages[courseKey] = total / courseItems.length;
      }
    });
    return calculatedAverages;
  }, [items]);

  // Filter menu items based on selected course
  const filteredItems = useMemo(() => {
    return filterCourse === 'All'
      ? items
      : items.filter(item => item.course === filterCourse);
  }, [items, filterCourse]);

  const handleAddItem = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter the dish name.');
      return;
    }
    const price = Number(priceText);
    if (isNaN(price) || price < 0) {
      Alert.alert('Validation', 'Please enter a valid positive price.');
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
    Alert.alert('Success', `${newItem.name} added to the menu!`);
    setScreen('home');
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setCourse('Starters');
    setPriceText('');
  };

  const handleDelete = (id: string) => {
    const itemName = items.find(item => item.id === id)?.name || 'item';
    Alert.alert('Remove Item', `Are you sure you want to remove "${itemName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setItems(prev => prev.filter(item => item.id !== id));
          Alert.alert('Removed', `${itemName} has been removed.`);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Clear all', 'Remove all menu items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setItems([]) },
    ]);
  };

  // === HOME SCREEN (Menu Display and Filter) ===
  if (screen === 'home') {
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
              <Text style={styles.title}>🍽 Christopher's Kitchen</Text>
            </View>
            {/* Total Menu Count */}
            <Text style={styles.count}>**Total Menu Items:** {items.length}</Text>
          </View>

          {/* Average Prices Section */}
          <View style={styles.avgSection}>
            <Text style={styles.avgTitle}>Average Prices by Course</Text>
            {Object.entries(averages).map(([course, avg]) => (
              <Text key={course as Course} style={styles.avgText}>
                **{course}**: R{avg.toFixed(2)}
              </Text>
            ))}
          </View>

          {/* Filter by Course - Now on Home Screen */}
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={filterCourse}
              onValueChange={value => setFilterCourse(value as 'All' | Course)}
            >
              <Picker.Item label="Show All Courses" value="All" />
              {COURSES.map(c => (
                <Picker.Item key={c} label={`Show only ${c}`} value={c} />
              ))}
            </Picker>
          </View>

          {/* Menu List */}
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No menu items yet. Use "Manage Menu" to add one.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              ListEmptyComponent={<Text style={styles.emptyText}>No items found for this course.</Text>}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCourse}>{item.course}</Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                    <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                  </View>
                  {/* Remove Item Button for Chef */}
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setScreen('add')}>
              <Text style={styles.btnText}>Manage Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} onPress={handleClearAll}>
              <Text style={styles.btnSecondaryText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // === ADD/MANAGE MENU SCREEN (for Chef) ===
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
            <View style={styles.header}>
              <View style={styles.logoRow}>
                <Image
                  source={require('./assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.formTitle}>Add New Menu Item</Text>
              </View>
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
                <Text style={styles.saveBtnText}>Add Item</Text>
              </TouchableOpacity>

              {/* Delete Last Item  */}
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

            <View style={styles.field}>
              <TouchableOpacity style={styles.btnSecondary} onPress={() => setScreen('home')}>
                <Text style={styles.btnSecondaryText}>← Back to Menu</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  return null;
}

// === STYLES ===
const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flexGrow: 1, backgroundColor: 'rgba(255,255,255,0,80)', padding: 16 },
  header: { marginBottom: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  logo: { width: 50, height: 50, marginRight: 10 },
  title: { fontSize: 22, fontWeight: '700' },
  count: { fontSize: 14, color: '#666', marginTop: 4, fontWeight: 'bold' },
  avgSection: { marginVertical: 12, backgroundColor: '#eef2ff', padding: 10, borderRadius: 8, borderColor: '#c7d2fe', borderWidth: 1 },
  avgTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#4338ca' },
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
    justifyContent: 'space-between',
  },
  itemName: { fontSize: 17, fontWeight: '700', color: '#111' },
  itemCourse: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  itemDesc: { fontSize: 14, color: '#333', marginTop: 6 },
  itemPrice: { fontSize: 15, fontWeight: '600', color: '#2563eb', marginTop: 8 },
  deleteIcon: { fontSize: 24, color: '#ef4444', marginLeft: 8, padding: 4 },
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
  btnSecondaryText: { color: '#374151', fontWeight: '600' },
  formTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 6, color: '#333' },
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
  actions: { flexDirection: 'row', marginTop: 16, marginBottom: 16 },
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
    justifyContent: 'center',
  },
  deleteBtnText: { color: '#b91c1c', fontWeight: '600' },
});