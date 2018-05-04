import { AppRegistry } from 'react-native';
//import App from './App';
import {
  StackNavigator,
} from 'react-navigation';
import HomeScreen from './App'
import OrdersScreen from './OrdersScreen'


const App = StackNavigator({
  Home: { screen: HomeScreen },
  OrdersScreen: { screen: OrdersScreen },
});

console.disableYellowBox = true;
AppRegistry.registerComponent('ShopifyMobile', () => App);
