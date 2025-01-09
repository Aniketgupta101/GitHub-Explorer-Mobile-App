import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'https://api.github.com';
  const token = process.env.GITHUB_TOKEN;

  const searchRepositories = async query => {
    setSearchQuery(query);
    if (query.length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/search/repositories?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const repositories = response.data.items || [];
      const formattedData = [
        {
          title: `Results for "${query}"`,
          data: repositories.map(repo => ({
            id: repo.id,
            name: repo.name,
            owner: repo.owner.login,
            owner_avatar: repo.owner.avatar_url,
            description: repo.description,
            forks_count: repo.forks_count,
            language: repo.language,
            stars_count: repo.stargazers_count,
          })),
        },
      ];
      setResults(formattedData);
    } catch (error) {
      console.error('Error fetching repositories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('DetailsScreen', {repo: item})}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemOwner}>Owner: {item.owner}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({section: {title}}) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.screen}>
      {/* Search Bar */}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Search for repositories"
          value={searchQuery}
          onChangeText={searchRepositories}
        />

        <TouchableOpacity style={styles.searchIcon}>
          <Icon name="search" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#3498db" />}

      {!loading && results.length > 0 && (
        <SectionList
          sections={results}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
        />
      )}

      {!loading && results.length === 0 && searchQuery.length > 0 && (
        <Text style={styles.noResults}>No results found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 10,
    color: '#333',
  },
  searchIcon: {
    padding: 5,
  },
  backButton: {
    marginRight: 10,
  },
  list: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemOwner: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
    marginTop: 20,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default SearchScreen;
