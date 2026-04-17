import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // CAMBIO AQUÍ

const API_URL = 'http://10.0.2.2/inventario_api/api.php'; 

export default function AgregarScreen() {
  const navigation = useNavigation<any>(); // Instanciamos la navegación
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(''); 

  const handleAgregar = async () => {
    if (!nombre || !precio || !cantidad || !categoria) {
      Alert.alert('Campos incompletos', 'Por favor llena los campos obligatorios');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, precio, cantidad, categoria, imagen }), 
      });
      const data = await response.json();
      
      if (data.message) {
        Alert.alert('¡Hecho!', 'Producto guardado correctamente');
        setNombre(''); setPrecio(''); setCantidad(''); setCategoria(''); setImagen('');
        // Usamos navigation.navigate en lugar de router.push
        navigation.navigate('Inventario'); 
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Información del Producto</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nombre</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej. Manzana" />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>Precio ($)</Text>
          <TextInput style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" placeholder="0.00" />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Cantidad</Text>
          <TextInput style={styles.input} value={cantidad} onChangeText={setCantidad} keyboardType="numeric" placeholder="0" />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Categoría</Text>
        <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ej. Alimentos" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>URL de la Imagen (Opcional)</Text>
        <TextInput style={styles.input} value={imagen} onChangeText={setImagen} placeholder="Ej. https://tusitio.com/foto.jpg" />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAgregar}>
        <Text style={styles.buttonText}>Guardar Producto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 24 },
  label: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#1A1A1A' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#F3F4F6', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row' },
  button: { backgroundColor: '#007BFF', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 20, marginBottom: 40, shadowColor: '#007BFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 5 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});