import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/map-marker.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation();

  //sempre que a tela recebe foco dispara
  useFocusEffect(() => {
    api.get('/orphanages').then(res => {
      setOrphanages(res.data);
    });
  });

  function handleNavigateToOrphanageDetails(id: number){
    navigation.navigate('OrphanageDetails', {id});
  }
  function handleNavigateToCreateOrphanageDetail(){
    navigation.navigate('SelectMapPosition');
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -29.9111267,
          longitude: -51.1820898,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
      }}>
        {orphanages.map(orphanage => {
          return (
            <Marker 
              key={orphanage.id}
              icon={mapMarker} 
              calloutAnchor={{ //prop pra posicionar o elemento callout(balao) ficar do lado do icone marker
                x: 2.7, 
                y: 0.8
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
            >
              <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                </View>
              </Callout>
            </Marker>
          )
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length > 1 ? `${orphanages.length} orfanatos encontrados` : `${orphanages.length} orfanato encontrado`}</Text>
        <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanageDetail}>
          <Feather name="plus" size={20} color="#FFF"/>
        </RectButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    width: Dimensions.get('window').width, //ocupa 100% da largura
    height: Dimensions.get('window').height, //ocupa 100% da altura
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },

  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },

  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },

  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3',
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
