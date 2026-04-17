import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // CAMBIO AQUÍ
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://10.0.2.2/inventario_api/api.php'; 

interface Producto {
  id: number;
  nombre: string;
  precio: string | number;
  cantidad: string | number;
  categoria: string;
  imagen: string;
}

export default function InventarioScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchProductos(); }, []));

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = productos.filter(p => 
      p.nombre.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProductos(filtered);
  };

  const renderItem = ({ item }: { item: Producto }) => {
    const precioFormateado = parseFloat(Number(item.precio).toFixed(2));
    const imagenUrl = (item.imagen && item.imagen.startsWith('http')) 
      ? item.imagen 
      : 'https://cdn-icons-png.flaticon.com/512/4129/4129437.png';

    return (
      <View style={styles.card}>
        <Image source={{ uri: imagenUrl }} style={styles.productImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.productName}>{item.nombre}</Text>
          <Text style={styles.productCategory}>{item.categoria}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>${precioFormateado}</Text>
            <View style={[styles.badge, { backgroundColor: Number(item.cantidad) < 5 ? '#FFE5E5' : '#E5F9E5' }]}>
              <Text style={{ color: Number(item.cantidad) < 5 ? '#D32F2F' : '#388E3C', fontSize: 12 }}>
                Stock: {item.cantidad}
              </Text>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Buscar producto..."
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredProductos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron productos</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 2 },
  searchInput: { flex: 1, fontSize: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#F3F4F6' },
  cardInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: '700', color: '#333' },
  productCategory: { fontSize: 14, color: '#888', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 10 },
  price: { fontSize: 16, fontWeight: '600', color: '#007BFF' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' }
});