import AsyncStorage from "@react-native-async-storage/async-storage"

export default function SignOut({ navigation }) {
    return (
        AsyncStorage.removeItem('token'),
        navigation.navigate('SignIn')
    );
}