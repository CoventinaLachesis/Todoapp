import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, Modal, Button, TextInput, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/th';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import styles from '../style/ToDo.style';

export default function ToDo({ navigation }) {
    const [token, setToken] = useState('');
    const [activity, setActivity] = useState([]);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formState, setFormState] = useState({
        modalVisible: false,
        editMode: false,
        currentActivity: null
    });
    const apiPath = 'https://cache111.com/todoapi';

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDateTimePicker(false);
        setSelectedDate(currentDate);
        setFormState(prevState => ({
            ...prevState,
            currentActivity: { ...prevState.currentActivity, when: currentDate }
        }));
    };

    const handleActivitySubmit = () => {
        const endpoint = formState.editMode ? `${apiPath}/activities/${formState.currentActivity.id}` : `${apiPath}/activities`;
        const method = formState.editMode ? 'PUT' : 'POST';
        const data = formState.editMode ? { ...formState.currentActivity } : { "name": formState.currentActivity.name, "when": selectedDate };
        axios({
            method,
            url: endpoint,
            data,
            headers: { Authorization: 'Bearer ' + token },
        })
            .then(response => {
                if (formState.editMode) {
                    const updatedActivities = activity.map(act => act.id === formState.currentActivity.id ? formState.currentActivity : act);
                    setActivity(updatedActivities);
                } else {
                    const newActivity = response.data;
                    setActivity([...activity, newActivity]);
                }
                fetchActivity(token)
            })
            .catch(error => {
                console.error("There was an error processing the activity: ", error);
            })
            .finally(() => {
                setFormState(prevState => ({ ...prevState, modalVisible: false, editMode: false, currentActivity: null }));
            });
    };

    const formatToThaiDateTime = (dateTime) => {
        const date = moment(dateTime);
        const year = date.year() + 543;  // Convert CE to BE
        return `${date.format('D MMM')} ${year} เวลา ${date.format('HH:mm')} น`;
    };

    const fetchActivity = (token) => {
        fetch(`${apiPath}/activities`, {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },

        })
            .then(response => {
                if (response.status === 401) {
                    Alert.alert("Error", "You are not authorized to view this page.");
                    return;
                }
                return response;
            })
            .then(response => response.json())
            .then(data => {
                setActivity(data);
            })
            .catch(error => console.error(error));
    }

    const deleteActivity = async (activityId) => {
        try {
            const response = await fetch(`${apiPath}/activities/${activityId}`, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer ' + token },
            });

            if (response.status === 200) {
                setActivity(prevActivity => prevActivity.filter(act => act.activityId !== activityId));
                Alert.alert('Success', 'Activity deleted successfully');
                fetchActivity(token);
            } else {
                Alert.alert('Error', 'Failed to delete the activity');
            }
        } catch (error) {
            console.error('Failed to delete activity:', error);
            Alert.alert('Error', 'Failed to delete the activity');
        }
    };

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error("Failed to get the token");
            }
        };
        retrieveToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetchActivity(token);
        }
    }, [token]);

    moment.locale('th');

    return (
        <View style={styles.container}>
            <Text style={styles.header}>ToDo List</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title><Text style={style.text}>กิจกรรม</Text></DataTable.Title>
                    <DataTable.Title ><Text style={style.text}>วัน/เวลา</Text></DataTable.Title>
                    <DataTable.Title><Text style={style.text}>แก้ไข</Text></DataTable.Title>
                </DataTable.Header>
                {activity.map((item) => (
                    <DataTable.Row key={item.id}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                        <DataTable.Cell>{formatToThaiDateTime(item.when)}</DataTable.Cell>
                        <DataTable.Cell style={styles.actions}>
                            <TouchableOpacity onPress={() => setFormState({ modalVisible: true, editMode: true, currentActivity: item })} style={styles.buttonText}>
                                <MaterialCommunityIcons name="pencil" size={24} color="#2196F3" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteActivity(item.id)} style={styles.buttonText}>
                                <MaterialCommunityIcons name="delete" size={24} color="#f44336" />
                            </TouchableOpacity>
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>

            <Button title="เพิ่มกิจกรรม" onPress={() => setFormState({ modalVisible: true, editMode: false, currentActivity: null })} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={formState.modalVisible}
                onRequestClose={() => {
                    setFormState(prevState => ({ ...prevState, modalVisible: false, editMode: false, currentActivity: null }));
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <Text>{formState.editMode ? "Edit Activity" : "Add Activity"}</Text>
                        <TextInput
                            value={formState.currentActivity?.name || ''}
                            onChangeText={text => setFormState(prevState => ({ ...prevState, currentActivity: { ...prevState.currentActivity, name: text } }))}
                            placeholder="Activity Name"
                            style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                        />
                        <Button
                            title="เลือกวัน/เวลา"
                            onPress={() => setShowDateTimePicker(true)}
                        />

                        {showDateTimePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="datetime"
                                display="default"
                                onChange={onChange}
                            />
                        )}
                        <Button title="ยืนยัน" onPress={handleActivitySubmit} />
                        <Button title="ยกเลิก" onPress={() => setFormState(prevState => ({ ...prevState, modalVisible: false, editMode: false, currentActivity: null }))} />
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const style = StyleSheet.create({
    text: {
        fontFamily: 'Kanit',
        fontSize: 18,
    }
})