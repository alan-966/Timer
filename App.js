import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View,
	Text, StatusBar, Button, Alert, TouchableOpacity,
	Dimensions, Picker, Platform} from 'react-native';

const screen = Dimensions.get('window');

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) =>
{
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;
	return {minutes: formatNumber(minutes), seconds: formatNumber(seconds)};
};

const createArray = (length) =>
{
	const arr = [];
	let i = 0;
	while (i < length)
	{
		arr.push(i.toString());
		i++;
	}
	return arr;
};

const AVAILABEL_MINUTES = createArray(11);
const AVAILABEL_SECONDS = createArray(60);

class App extends React.Component
{
  state = {
	remainingSeconds: 5,
	isRunning: false,
	selectedMinutes: '0',
	selectedSeconds: '5',
  };

  interval = null;

  componentDidUpdate(prevProp, prevState)
  {
	if(this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) this.stop();
  };

  componentWillUnmount()
  {
	if(this.interval) clearInterval(this.interval);
  };

  start = () =>
  {
	this.setState(state =>
	({
	  remainingSeconds: parseInt(state.selectedMinutes, 10) * 60 + parseInt(state.selectedSeconds),
	  isRunning: true,
	}));

	this.interval = setInterval(() =>
	{
	  this.setState(state =>
	  ({
		remainingSeconds: state.remainingSeconds - 1
	  }));
	}, 1000);
  };

  stop = () =>
  {
	clearInterval(this.interval);
	this.interval = null;

	this.setState({
	  remainingSeconds: 5,
	  isRunning: false,
	});
  };

  renderPickers = () =>
  {
	return (
	  <View style={styles.pickerContainer}>
		<Picker style={styles.picker} itemStyle={styles.pickerItem}
		  selectedValue={this.state.selectedMinutes}
		  onValueChange={(itemValue) => this.setState({selectedMinutes: itemValue})}>
		  {AVAILABEL_MINUTES.map(value => (
			<Picker.Item key={value} label={formatNumber(value)} value={value}/>
		  ))}
		</Picker>
		<Text style={styles.pickerItem}>minutes</Text>
		<Picker style={styles.picker} itemStyle={styles.pickerItem}
		  selectedValue={this.state.selectedSeconds}
		  onValueChange={(itemValue) => this.setState({selectedSeconds: itemValue})}>
		  {AVAILABEL_SECONDS.map(value => (
			<Picker.Item key={value} label={formatNumber(value)} value={value}/>
		  ))}
		</Picker>
		<Text style={styles.pickerItem}>seconds</Text>
	  </View>
	);
  };

	render()
	{
	const {minutes, seconds} = getRemaining(this.state.remainingSeconds);
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content"/>
				{this.state.isRunning ? (
					<Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
				) : this.renderPickers()}
				{this.state.isRunning ? (
					<TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
						<Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity onPress={this.start} style={styles.button}>
						<Text style={styles.buttonText}>Start</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container:
  {
	flex: 1,
	backgroundColor: '#07121B',
	alignItems: 'center',
	justifyContent: 'center',
  },
  button:
  {
	marginTop: 30,
	borderWidth: 10,
	borderColor: '#89AAFF',
	width: screen.width / 2,
	height: screen.width / 2,
	borderRadius: screen.width / 2,
	alignItems: 'center',
	justifyContent: 'center',
  },
  buttonText:
  {
	fontSize: 45,
	color: '#89AAFF',
  },
  buttonStop:
  {
	borderColor: '#FF851B',
	marginTop: 140,
  },
  buttonTextStop:
  {
	color: '#FF851B',
  },
  timerText:
  {
	fontSize: 90,
	color: '#fff',
  },
  picker:
  {
	width: 50,
	...Platform.select({
	  android: {
		color: '#fff',
		backgroundColor: '#07121B',
		marginLeft: 10,
	  }
	})
  },
  pickerItem:
  {
	color: '#fff',
	fontSize: 20,
  },
  pickerContainer:
  {
	flexDirection: 'row',
	alignItems: 'center',
  },
});

export default App;
