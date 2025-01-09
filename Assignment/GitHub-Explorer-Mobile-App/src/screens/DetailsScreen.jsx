import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {repo} = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites) {
          const favoritesArray = JSON.parse(favorites);
          if (favoritesArray.some(fav => fav.id === repo.id)) {
            setIsFavorite(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkIfFavorite();
  }, [repo]);

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        const updatedFavorites = favoritesArray.filter(
          fav => fav.id !== repo.id,
        );
        await AsyncStorage.setItem(
          'favorites',
          JSON.stringify(updatedFavorites),
        );
      } else {
        favoritesArray.push(repo);
        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      }

      setIsFavorite(!isFavorite);
      navigation.navigate('Favorites');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#1F1F1F" />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Image source={{uri: repo.owner_avatar}} style={styles.avatar} />

      <Text style={styles.title}>{repo.name}</Text>
      <Text style={styles.subtitle}>Owner: {repo.owner}</Text>
      <Text style={styles.detailsText}>Forks: {repo.forks_count}</Text>
      <Text style={styles.detailsText}>Stars: {repo.stars_count}</Text>
      <Text style={styles.detailsText}>Language: {repo.language}</Text>

      <Text style={styles.description}>
        {repo.description || 'No description provided.'}
      </Text>

      <TouchableOpacity
        style={[
          styles.favoriteButton,
          isFavorite && styles.favoriteButtonActive,
        ]}
        onPress={toggleFavorite}>
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1F1F1F',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#D3D3D3',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailsText: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 20,
    textAlign: 'center',
  },
  favoriteButton: {
    paddingVertical: 12,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#FF6347',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
