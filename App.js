import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, LogBox, Image, ScrollView, ImageBackground } from 'react-native';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';

import LoginScreen from './Login';
const firebaseConfig = {
  apiKey: "AIzaSyC1zjR6eQLcQYOpdVtjMINkby8u07vg_KE",
  authDomain: "work7-ea890.firebaseapp.com",
  databaseURL: "https://work7-ea890-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "work7-ea890",
  storageBucket: "work7-ea890.appspot.com",
  messagingSenderId: "1005417147100",
  appId: "1:1005417147100:web:575ee82fed87a9c7856219",
  measurementId: "G-GD7YKSEREG"
};
LogBox.ignoreAllLogs(true);

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) { }

function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  })
}



function renderCorona(item, index, setItem) {
  var icon = <Image style={{ width: 30, height: 20 }} source={{ uri: `https://covid19.who.int/countryFlags/${item.code}.png` }} />
  var desc = <View >
    <Text>{"ผู้ป่วยสะสม " + item.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " ราย"}</Text>
    <Text>{"เสียชีวิต " + item.death.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " ราย"}</Text>
    <Text>{"รักษาหาย " + item.cure.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " ราย"}</Text>
  </View>;
  return <List.Item onPress={() => setItem(item)} title={item.name} description={desc} left={(props => icon)} style={{flex:1,flexDirection:'row', alignItems: "center",justifyContent:"center" }}></List.Item>
}

function Detail(props) {
  const items = props.item;
  return (
    <ImageBackground source={require('./assets/back.jpg')} style={{ width: "100%", height: "100%" }}>
   
      <View style={{ alignItems: "center" }}>
    
      <View style={{height:80}}/>
      <StatusBar style="dark" barStyle="dark-content" />
      <View style={{alignItems:"center"}}>
        <Image style={{ width: 70, height: 50 ,marginBottom:10,marginTop:20 }} source={{ uri: `https://covid19.who.int/countryFlags/${items.code}.png` }} />
          <Text style={{ color: "#b30000", fontSize: 23, fontWeight: "bold" }}>{"ประเทศ :"+ items.name }</Text>
          <Text style={{ color: "#b30000", fontSize: 23, fontWeight: "bold" }}>{"ผู้ป่วยสะสม : " + items.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " ราย"}</Text>
          <Text style={{ color: "#b30000", fontSize: 23, fontWeight: "bold" }}>{"เสียชีวิต : " + items.death.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " ราย"}</Text>
          <Text style={{ color: "#b30000", fontSize: 23, fontWeight: "bold" }}>{"รักษาหาย : " + items.cure.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " ราย"}</Text>
      </View>
  
        <Button mode="contained" onPress={() => props.setItem(null)} style={{ width: "30%", marginVertical: 20, backgroundColor:"#003d99"}}>
        Back
      </Button>
        </View>
  
    </ImageBackground>
  )
}


function Loading() {
  return <View><Text>Loading</Text></View>
}

export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [citem, setCitem] = React.useState(null);

  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
  }, []);

  if (user == null) {
    return <LoginScreen />;
  }

  if (corona.length == 0) {
    return <Loading />;
  }

  if (citem != null) {
    return <Detail item={citem} setItem={setCitem} />;
  }
  return (
    <PaperProvider>
      <View style={styles.container}>
     
          <Card style={styles.card}>
            <Card.Cover source={require("./assets/virus.jpg")} />
          <Card.Title title="Coronavirus Situation" />
          <Text style={{marginLeft:15 ,marginBottom:5}}>Your Phone Number: {user.phoneNumber}</Text>
             <ScrollView>
            <Card.Content>
         
              <FlatList data={corona}
                renderItem={({ item, index }) => renderCorona(item, index, setCitem)} >
              </FlatList>
            </Card.Content>
          </ScrollView>
          </Card>
   
      </View>

      <Button icon="logout" mode="contained" style={{borderRadius:0}} onPress={() => getAuth().signOut()}>
        Sign Out
      </Button>

      <StatusBar  style="light" barStyle="light-content" />
    </PaperProvider>

  );
}




const styles = StyleSheet.create({
  container: {
    flex:3,
    margin: 0,
    padding: 0,
  
    backgroundColor: '#fff',
 
  },
  Button:{
    borderRadius: 0,
  },
  card: {
    maxHeight:"100%"
  }
  ,
  phone: {
    marginLeft: 20,
    marginBottom: 10,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 0,

  },


});
