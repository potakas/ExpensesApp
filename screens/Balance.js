import { View,StyleSheet, Text } from "react-native"

const Balance= ()=>{
    return <View style={styles.container}>
        <Text>BALANCE</Text>
    </View>
}

export default Balance

const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	chart: {
		width: 200,
		height: 200,
	},
})