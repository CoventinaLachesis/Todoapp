import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',  // subtle background color
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#333',  // slightly muted text color for a modern look
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    actionButton: {
        marginHorizontal: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,  // drop shadow on Android
        shadowColor: "#000", // shadow for iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 16,
        marginBottom: 24,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#2196F3',  // blue color for primary actions
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        marginTop: 8,
        backgroundColor: '#f44336',  // red color to indicate a negative or destructive action
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});

export default styles;