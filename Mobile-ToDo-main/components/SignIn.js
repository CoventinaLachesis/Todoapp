import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';


export default function SignIn({ navigation }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const signIn = async () => {
        axios.post(
             'https://cache111.com/todoapi/tokens',
            {
                id: id,
                password: password,
            },
            {
                 headers: { /* Authorization: 'Bearer ' + token */ }, timeout: 3000
            }
        )
            .then(async (response) => {
                await AsyncStorage.setItem('token', response.data.token);
                // console.log(response.data.token);
                // Alert.alert("Success", "Login successful.");
                navigation.navigate('AppDrawer');
            })
            .catch((error) => {
                Alert.alert("Error", "Login failed.")
                console.error(error);
            });
    }
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="ID"
                keyboardType='numeric'
                onChangeText={setId} />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                />

                <TouchableOpacity onPress={togglePasswordVisibility}  style={styles.passwordIconContainer}>
                        <Image
                    source={showPassword ? require('./eye-slash.png') : require('./eye.png')}
                    style={{ width: 20, height: 20 }}
                />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={signIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        margin: 12,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        padding: 10,
    },
    showHideText: {
        padding: 10,
        color: '#333',
    },
    button: {
        margin: 10,
        alignItems: 'center',
        backgroundColor: '#008CBA',
        padding: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }
});