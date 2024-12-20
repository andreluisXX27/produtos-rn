import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [produtos, setProdutos] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [qtd, setQtd] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch('http://10.0.0.106:3000/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      Alert.alert('Erro', 'Falha ao buscar produtos. Verifique a URL e o servidor.');
    }
  };

  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar a biblioteca de imagens é necessária!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets ? result.assets[0].base64 : result.base64);
    }
  };

  const addProduto = async () => {
    if (!name || !description || !qtd) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const produto = { name, description, qtd, image };

    try {
      const response = await fetch('http://10.0.0.106:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchProdutos();
      setName('');
      setDescription('');
      setQtd('');
      setImage(null);
    } catch (error) {
      console.error('Failed to add product:', error);
      Alert.alert('Erro', 'Falha ao adicionar produto. Verifique a URL e o servidor.');
    }
  };

  const deleteProduto = async (id) => {
    try {
      const response = await fetch(`http://10.0.0.106:3000/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchProdutos();
    } catch (error) {
      console.error('Failed to delete product:', error);
      Alert.alert('Erro', 'Falha ao excluir produto. Verifique a URL e o servidor.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.description}</Text>
      {item.image && (
        <Image
          source={{ uri: `data:image/png;base64,${item.image}` }}
          style={styles.image}
        />
      )}
      <Button title="Excluir" onPress={() => deleteProduto(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adicione um produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={qtd}
        onChangeText={setQtd}
      />
      <Button title="Selecionar Foto" onPress={pickImageAsync} />
      {image && (
        <Image
          source={{ uri: `data:image/png;base64,${image}` }}
          style={styles.previewImage}
        />
      )}
      <Button title="Adicionar Produto" onPress={addProduto} />
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  }
});

export default App;
