import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FavoritesScreen from './FavoritesScreen';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = text => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View>
        <Text style={styles.welcomeText}>
          Hi User, Welcome to GitHub Explorer
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#B0B0B0"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={() => navigation.navigate('SearchScreen')}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Icon
              name="close"
              size={20}
              color="#888"
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://github.githubassets.com/images/modules/open_graph/github-octocat.png',
          }}
          style={styles.image}
        />
      </View>

      <FavoritesScreen isHomeScreen={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 10,
  },
  clearIcon: {
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default HomeScreen;
