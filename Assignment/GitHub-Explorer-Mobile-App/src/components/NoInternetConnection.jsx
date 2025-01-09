import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NoInternetConnectionToast = () => {
  const [isConnected, setIsConnected] = useState(true);

  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const retryConnection = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setIsConnected(true);
        showToast('Connected to the Internet');
      } else {
        showToast('Still no connection!');
      }
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        showToast('No Internet Connection');
      }
    });

    return () => unsubscribe();
  }, []);

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.toastContainer}>
      <Text style={styles.text}>No Internet Connection</Text>
      <TouchableOpacity onPress={retryConnection} style={styles.button}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

export default NoInternetConnectionToast;
