import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({isHomeScreen = false}) => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadFavorites();
  }, []);

  const handleDelete = id => {
    Alert.alert(
      'Delete Favorite',
      'Are you sure you want to remove this repository from favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            const updatedFavorites = favorites.filter(fav => fav.id !== id);
            setFavorites(updatedFavorites);
            try {
              await AsyncStorage.setItem(
                'favorites',
                JSON.stringify(updatedFavorites),
              );
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );
  };

  const groupedFavorites = favorites.reduce((sections, item) => {
    const section = sections.find(s => s.title === item.owner);
    if (section) {
      section.data.push(item);
    } else {
      sections.push({title: item.owner, data: [item]});
    }
    return sections;
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.repoContainer}>
      <Image source={{uri: item.owner_avatar}} style={styles.avatar} />
      <View style={styles.repoInfo}>
        <Text style={styles.repoName}>{item.name}</Text>
        <Text style={styles.repoOwner}>{item.owner}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({section: {title}}) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      {!isHomeScreen && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Favorites</Text>
        {isHomeScreen && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites')}
            style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      <SectionList
        sections={groupedFavorites}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No favorites added yet!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  seeAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  seeAllText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#E8EAF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    color: '#3F51B5',
  },
  repoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  repoInfo: {
    flex: 1,
  },
  repoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  repoOwner: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default FavoritesScreen;
