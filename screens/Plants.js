import { StyleSheet, Text, View, ImageBackground, Image, Modal, TouchableOpacity, TextInput, Animated, Button} from 'react-native'
import React, {useState, useEffect, } from 'react'
import background from '../assets/background2.png'
import image from '../assets/flower6.png'
import close from '../assets/close.png'
import Slider from '@react-native-community/slider'
import image1 from '../assets/water-droplet5.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';


init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {}
  });

  //const host = '192.168.0.106';

  const options = {
    host: '192.168.0.106', //de2.localto.net
    port: 8080,
    path: '',
    id: 'id_' + parseInt(Math.random() * 100000),
  };
  
  let client /*= new Paho.MQTT.Client(options.host, options.port, options.path,)*/;
  

const Plants = () => {
    const [range, setRange] = useState(0)
    const [range2, setRange2] = useState(0)
    const [range3, setRange3] = useState(0)
    const [range4, setRange4] = useState(0)
    const [temperature, setTemperature] = useState(0)
    const [humidity, setHumidity] = useState(0)
    const [p1Value, setP1Value] = useState("0%");
    const [p2Value, setP2Value] = useState("0%");
    const [p3Value, setP3Value] = useState("0%");
    const [p4Value, setP4Value] = useState("0%");
    const [currentHost, setCurrentHost] = useState('192.168.0.106');
    const [currentPort, setCurrentPort] = useState(8080);
    const [openModal, setOpenModal] = useState(false);
    const [waterLevel] = useState(new Animated.Value(0));

    const water = () => {
        Animated.timing(waterLevel, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: false,      
        }).start();
        
    };
        
    const waterStyle = {
        height: waterLevel.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '80%'],
            extrapolate: 'clamp',   
        }),
        
    };
    
    const handleHostChange = (newHost) => {
        setCurrentHost(newHost);
    };
    const handlePortChange = (newPort) => {
        const portNumber = parseInt(newPort, 10);
    if (!isNaN(portNumber)) {
        setCurrentPort(portNumber);
    }
    };

    const applyNewData = () => {
        // Reconfigure the MQTT client with the new host
        if (client && client.isConnected()) {
            client.disconnect();
        }

        // Update the client configuration
        client = new Paho.MQTT.Client(currentHost, currentPort, options.path, options.id);

        // Reconnect with the new configuration
        client.connect({onSuccess: onConnect, onFailure: onFailure});

        // Close modal
        setOpenModal(false);
    };

    useEffect(() => {
        // Initialize the MQTT client
        client = new Paho.MQTT.Client(currentHost, currentPort, options.path, options.id);

        // ... Rest of your MQTT setup

        return () => {
            // Clean up the client on component unmount
            if (client && client.isConnected()) {
                client.disconnect();
            }
        };
    }, []);

    function renderSettings() {
        return(
            <Modal 
            visible={openModal} 
            animationType='slide'
            transparent={true}
            >
                <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "rgba(50, 100, 45, 0.8)",
                }}
                >
                    <View
                    style={styles.modalBox}
                    >
                        <TouchableOpacity
                        onPress={() => setOpenModal(false)}
                        >
                            <Image
                                style={styles.tinyLogo}
                                source={close}
                            />
                        </TouchableOpacity>
                        <Text
                        style={{
                            marginTop: 30,
                            fontWeight: 'bold',
                            color: "rgba(48, 98, 38, 0.8)"
                        }}
                        >
                            HOST
                        </Text>
                        <TextInput 
                            style={styles.textinput}
                            placeholder="Enter the hostserver address"
                            onChangeText={handleHostChange}
                            value={currentHost}
                        />
                        <Text
                        style={{
                            marginTop: 30,
                            fontWeight: 'bold',
                            color: "rgba(48, 98, 38, 0.8)"
                        }}
                        >
                            PORT
                        </Text>
                        <TextInput 
                            style={styles.textinput}
                            placeholder="Enter the port"
                            onChangeText={handlePortChange}
                            value={currentPort.toString()}
                            keyboardType="numeric" // Set the keyboard type to numeric
                        />
                        <TouchableOpacity onPress={applyNewData}>
                            <Text
                            style={styles.applyDataText}
                            >Apply data</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    
      const onConnect = () => {
        console.log("Connected to MQTT Broker");
        const topics = [
            "3RST-3M99-HWVR-H83F/HUM",
            "3RST-3M99-HWVR-H83F/TEMP",
            "3RST-3M99-HWVR-H83F/P1",
            "3RST-3M99-HWVR-H83F/P2",
            "3RST-3M99-HWVR-H83F/P3",
            "3RST-3M99-HWVR-H83F/P4",
        ];
        topics.forEach(topic => client.subscribe(topic));
        
      };
      
      const onFailure = (error) => {
        console.error("Could not connect to MQTT Broker:", error);
      };
      useEffect(() => {
        client.onConnectionLost = (responseObject) => {
          console.log('Connection Lost:', responseObject.errorMessage);
        };
        client.onMessageArrived = (message) => {
          console.log('Message Arrived:', message.destinationName, message.payloadString);

          switch (message.destinationName) {
            case "3RST-3M99-HWVR-H83F/TEMP":
                setTemperature(parseFloat(message.payloadString));
                break;
            case "3RST-3M99-HWVR-H83F/HUM":
                setHumidity(parseFloat(message.payloadString));
                break;
            case "3RST-3M99-HWVR-H83F/P1":
                setP1Value(parseFloat(message.payloadString) + '%');
                break;
            case "3RST-3M99-HWVR-H83F/P2":
                setP2Value(parseFloat(message.payloadString) + '%');
                break;
            case "3RST-3M99-HWVR-H83F/P3":
                setP3Value(parseFloat(message.payloadString) + '%');
                break;
            case "3RST-3M99-HWVR-H83F/P4":
                setP4Value(parseFloat(message.payloadString) + '%');
                break;
            // Add other cases as needed
        }
        //client.onMessageArrived = onMessageArrived;
        };
      
        client.connect({
            onSuccess: onConnect,
            onFailure: onFailure
        });
      
        return () => {
          if (client.isConnected()) {
            client.disconnect();
          }
        };
      }, []);
      

      const publishMessage = (topic, message) => {
        if (client.isConnected()) {
          let mqttMessage = new Paho.MQTT.Message(message);
          mqttMessage.destinationName = topic;
          client.send(mqttMessage);
        } else {
          console.log("Not connected to MQTT Broker");
        }
      };
      

    return (
    <ImageBackground source = {background} style = {styles.container}>
        <View
    style = {styles.settingsView}
    >
        <TouchableOpacity
        style = {styles.settings}
        onPress={() => setOpenModal(true)}
        >
            <Text
            style = {styles.settingsText}
            >Settings</Text>
        </TouchableOpacity>
        
    </View>
    <View style = {styles.cardSpacer}></View>
    <View style = {styles.flowerCards}>
        <View style = {styles.flowerCard}>
            <View style = {styles.flower1}>
            <View style={styles.container}>
                <Animated.View style={[styles.water, waterStyle]} />
                <View style={styles.handle} />
                <TouchableOpacity style={styles.button} onPress={water}>
                    <Text style={styles.buttonText}>Water</Text>
                </TouchableOpacity>
                </View>
                <Image style = {styles.flowerImage} source = {image}></Image>
                <View style = {styles.wetWrapper}>
                    <Image style = {styles.wetImage} source = {image1}></Image>
                    <Text style = {styles.wetData}>Topping:</Text>
                    <Text style = {styles.wetData}>{p1Value}</Text>
                </View>
                <View style = {styles.sliderWrapper}>
                    <Text style = {styles.range}>{range}</Text>
                    <Slider style = {styles.slider}
                        minimumValue = {0}
                        maximumValue = {1}
                        minimumTrackTintColor = 'rgba(95, 133, 59, 0.8)'
                        maximumTrackTintColor='rgba(255, 255, 255, 0.8)'
                        thumbTintColor = 'rgba(95, 133, 59, 1)'
                        value = {parseFloat(range)/100} // Convert the percentage back to a fraction
                        onValueChange={value => {
                            const formattedValue = parseInt(value * 100) + '';
                            const percentage = parseInt(value * 100) + '%';
                            setRange(percentage); 
                            publishMessage("3RST-3M99-HWVR-H83F/SET1", formattedValue);
                        }} 
                        
                    />
                </View>
            </View>
        </View>
        <View style = {styles.flowerCard}>
            <View style = {styles.flower1}>
                <Image style = {styles.flowerImage} source = {image}></Image>
                <View style = {styles.wetWrapper}>
                    <Image style = {styles.wetImage} source = {image1}></Image>
                    <Text style = {styles.wetData}>Topping:</Text>
                    <Text style = {styles.wetData}>{p2Value}</Text>
                </View>
                <View style = {styles.sliderWrapper}>
                    <Text style = {styles.range}>{range2}</Text>
                    <Slider style = {styles.slider}
                        minimumValue = {0}
                        maximumValue = {1}
                        minimumTrackTintColor = 'rgba(95, 133, 59, 0.8)'
                        maximumTrackTintColor='rgba(255, 255, 255, 0.8)'
                        thumbTintColor = 'rgba(95, 133, 59, 1)'
                        value = {parseFloat(range2)/100} // Convert the percentage back to a fraction
                        onValueChange={value => {
                            const formattedValue2 = parseInt(value * 100) + '';
                            const percentage2 = parseInt(value * 100) + '%';
                            setRange2(percentage2);  
                            publishMessage("3RST-3M99-HWVR-H83F/SET2", formattedValue2);
                        }} 
                    />
                </View>
            </View>
        </View>
        <View style = {styles.flowerCard}>
            <View style = {styles.flower1}>
                <Image style = {styles.flowerImage} source = {image}></Image>
                <View style = {styles.wetWrapper}>
                    <Image style = {styles.wetImage} source = {image1}></Image>
                    <Text style = {styles.wetData}>Topping:</Text>
                    <Text style = {styles.wetData}>{p3Value}</Text>
                </View>
                <View style = {styles.sliderWrapper}>
                    <Text style = {styles.range}>{range3}</Text>
                    <Slider style = {styles.slider}
                        minimumValue = {0}
                        maximumValue = {1}
                        minimumTrackTintColor = 'rgba(95, 133, 59, 0.8)'
                        maximumTrackTintColor='rgba(255, 255, 255, 0.8)'
                        thumbTintColor = 'rgba(95, 133, 59, 1)'
                        value = {parseFloat(range3)/100} // Convert the percentage back to a fraction
                        onValueChange={value => {
                            const formattedValue3 = parseInt(value * 100) + '';
                            const percentage3 = parseInt(value * 100) + '%';
                            setRange3(percentage3);  
                            publishMessage("3RST-3M99-HWVR-H83F/SET3", formattedValue3);
                        }} 
                    />
                </View>
            </View>
        </View>
        <View style = {styles.flowerCard}>
            <View style = {styles.flower1}>
                <Image style = {styles.flowerImage} source = {image}></Image>
                <View style = {styles.wetWrapper}>
                    <Image style = {styles.wetImage} source = {image1}></Image>
                    <Text style = {styles.wetData}>Topping:</Text>
                    <Text style = {styles.wetData}>{p4Value}</Text>
                </View>
                <View style = {styles.sliderWrapper}>
                    <Text style = {styles.range}>{range4}</Text>
                    <Slider style = {styles.slider}
                        minimumValue = {0}
                        maximumValue = {1}
                        minimumTrackTintColor = 'rgba(95, 133, 59, 0.8)'
                        maximumTrackTintColor='rgba(255, 255, 255, 0.8)'
                        thumbTintColor = 'rgba(95, 133, 59, 1)'
                        value = {parseFloat(range4)/100} // Convert the percentage back to a fraction
                        onValueChange={value => {
                            const formattedValue4 = parseInt(value * 100) + '';
                            const percentage4 = parseInt(value * 100) + '%';
                            setRange4(percentage4);  
                            publishMessage("3RST-3M99-HWVR-H83F/SET4", formattedValue4);
                        }} 
                    />
                </View>
            </View>
        </View>
    </View>

    <View style = {styles.data}>
            <View style = {styles.dataWrapper}>
                <View style = {styles.temp}>
                    <Text style = {styles.tempData}>{temperature}°C</Text>
                    <Text style = {styles.tempTitle}>Temperature</Text>
                </View>
                <View style = {styles.hum}>
                    <Text style = {styles.humData}>{humidity}%</Text>
                    <Text style = {styles.humTitle}>Humidity</Text>
                </View>
            </View>
    </View>
    
    {renderSettings()}
    
  
    

    </ImageBackground>
    
  )
}
export default Plants

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        
    },

    data: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },

    dataWrapper: {
       flexDirection: "row", 
       backgroundColor: "rgba(255, 255, 255, 0.5)",
       height: "30%",
       width: "80%",
       justifyContent: "center",
       alignItems: "center",
       borderRadius: 20,
       marginTop: "30%", 
       marginBottom: "5%"
    },

    temp: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    hum: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
    },

    tempData: {
        fontSize: 35,
        color: "white",
        fontWeight: "800",
        textAlign: "center",
    },

    tempTitle: {
        fontSize: 13,
        fontWeight: "400",
        color: "rgba(48, 98, 38, 0.8)",
        textAlign: "center",
    },

    humData: {
        fontSize: 35,
        color: "white",
        fontWeight: "800",
        textAlign: "center"
    },

    humTitle: {
        fontSize: 13,
        fontWeight: "400",
        color: "rgba(48, 98, 38, 0.8)",
        textAlign: "center"
    },

    flowerCards: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },

    flowerCard: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        height: "55%",
        width: "45%",
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginHorizontal: '2%',
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginVertical: "2%",
    },

    flower1: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    flowerImage: {
        height: "40%",
        width: "40%",
    },

    wetData: {
        fontSize: 11,
        color: "rgba(48, 98, 38, 0.8)",
        fontWeight: "300",
    },

    range: {
        fontSize: 11,
        fontWeight: "500",
        textAlign: "center",
        color: "rgba(48, 98, 38, 0.8)",
    },

    slider: {
        width: 140,
    },

    sliderWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
   
    wetImage: {
        marginRight: "6%",
        height: "25%",
        width: "15%", 
    },

    wetWrapper: {
        height: "10%",
        width: "40%",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    cardSpacer: {
        marginTop: "10%",
        height: "10%"
    },

    settingsView:{
        alignItems: 'flex-end', // Aligns items to the end of the container (right side)
        justifyContent: 'center',
        marginRight: 10, // Adjust this value to set the margin from the right edge
        marginTop: 50,
    },

    settings:{
        marginTop: 0,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        width: 120,
        height: 55,
        borderRadius: 25
    },

    settingsText:{
        color: "rgba(48, 98, 38, 0.8)", // White text color for better contrast
        fontSize: 16, // Slightly larger font size for better readability
        fontWeight: "bold", // Bold text for emphasis
        padding: 10, // Padding for better touch area
        textAlign: 'center', // Center the text
    },

    tinyLogo: {
        width: 30,
        height: 30,
    },

    textinput:{
        borderColor: 'rgba(48, 98, 38, 0.2)', 
        borderWidth: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        width: 300,
        height: 50,
        padding: 10,
        marginVertical: 10, 
        borderRadius: 10,      
    },

    applyDataText: {
        fontSize: 15, 
        fontWeight: 'bold', 
        color: 'rgb(255, 255, 255)', 
        textAlign: 'center', 
        padding: 10, 
        backgroundColor: 'rgba(48, 98, 38, 0.8)', 
        borderRadius: 7, 
        overflow: 'hidden', 
        marginTop: 20, 
        width: 150
    },

    modalBox: {
        backgroundColor: "#f7f7f7", 
        padding: 20,
        borderRadius: 20, 
        width: "90%",
        maxHeight: "80%",
        alignItems: "left",
        justifyContent: "space-around", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.3, 
        shadowRadius: 4,  
        borderColor: "#cccccc", 
        borderWidth: 1 
    },

    wateringCan: {

        width: 50,
    
        height: 100,
    
        borderRadius: 25,
    
        backgroundColor: 'lightblue',
    
        overflow: 'hidden',
    
      },
    
      water: {
    
        width: '100%',
    
        backgroundColor: 'blue',
    
      },
    
      handle: {
    
        width: 10,
    
        height: 50,
    
        backgroundColor: 'brown',
    
        position: 'absolute',
    
        bottom: 0,
    
      },
    
      button: {
    
        marginTop: 20,
    
        padding: 10,
    
        backgroundColor: 'lightblue',
    
        borderRadius: 5,
    
      },
    
      buttonText: {
    
        color: 'white',
    
        fontWeight: 'bold',
    
      },
    
})