import React from 'react';
import { Text, View, Button, FlatList, StyleSheet } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';

export default class OrdersScreen extends React.Component {

  // renders a single order.
  _renderOrders = (data) => {
    return (
      <View style={styles.orderList}>
        {
          data.orders.map((order) => {
            const missing = 'Missing Data';
            let name = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : missing;
            let total = order.total_price_usd;
            let city = order.shipping_address ? `${order.shipping_address.city}` : missing;
            let orderNum = order.order_number;
            return (
              <View style={styles.singleFullContainer}>
                <View style={styles.singleRow}>
                  <Text style={{ flex: 1 }}> {`Order #: ${orderNum}`} </Text>
                  <Text style={{ flex: 1 }}> {`Total (USD): ${total}`}</Text>
                </View>
                <View style={styles.singleRow}>
                  <Text style={{ flex: 1 }}> {`Name: ${name}`}</Text>
                  <Text style={{ flex: 1 }}> {`City: ${city}`}</Text>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }

  render() {
    let provinceData = this.props.navigation.state.params.orderData
    const { navigate } = this.props.navigation;

    // sorting function: sorts alphabetically.
    function compare(a, b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }
    //sorts the provinces alphabetically.
    provinceData.sort(compare);
    return (
      <View>
        <FlatList
          data={provinceData}
          renderItem={({ item }) => {
            return (
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {
                      `${item.name}`
                    }
                  </Text>
                </View>
                {
                  this._renderOrders(item)
                }
              </View>
            )
          }
          }
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderList: {
    paddingLeft: 10
  },
  singleOrder: {
    flexDirection: 'row'
  },
  singleFullContainer: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderColor: '#d6d7da',
  },
  singleRow: {
    flexDirection: 'row',
    flex: 1
  }
})