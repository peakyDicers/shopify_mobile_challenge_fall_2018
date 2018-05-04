
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView
} from 'react-native';


type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      shopifyData: null,
      byProvincesData: [],
      byYearData: []
    }
  }
  async componentDidMount() {
    let shopifyData = await this._fetchData();
    let provinces = await this._getByProvinces(shopifyData);
    let byYearData = await this._getByYear(shopifyData);
    this.setState({
      shopifyData: shopifyData,
      byProvincesData: provinces,
      byYearData: byYearData
    })
  }

  //fetch shopify data.
  _fetchData = async () => {
    let data = await fetch('https://shopicruit.myshopify.com/admin/orders.json?page=1&access_token=c32313df0d0ef512ca64d5b336a0d7c6');
    data = await data.json();
    return data;
  }

  //organize "by-year" data. 
  _getByYear = (data) => {
    let years = {};
    data.orders.forEach(order => {
      let date = new Date(order.created_at);
      let year = date.getFullYear();

      //create new year key, if year doesn't exist.
      if (!years[year]) {
        years[year] = {};
        years[year].orders = [];
        years[year].year = year;
        years[year].count = 0;
      }
      years[year].count++; //count the number of orders per year.

      // only push the first 10 orders.
      if (years[year].orders.length < 10)
        years[year].orders.push(order);
    })
    years = Object.values(years)
    years.sort(function (a, b) { return b.year - a.year })
    return years;
  }

  _getByProvinces = (data) => {

    let provinces = {};
    let orders = data.orders;

    orders.forEach(order => {
      let province = '';
      if (order.billing_address) {
        province = order.billing_address.province;
      } else {
        province = 'Unknown Province';
      }

      // if province is not in object, add it. 
      if (!provinces[province]) {

        provinces[province] = {};
        provinces[province].orders = [];
        provinces[province].name = province;
      }

      provinces[province].orders.push(order);
      //increment count of province.
      if (!provinces[province].count) {
        provinces[province].count = 1;
      } else {
        provinces[province].count++;
      }
    });
    provinces = Object.values(provinces)
    provinces.sort(function (a, b) { return b.count - a.count })
    return provinces;
  }

  _renderByProvince = () => {
    return (
      this.state.byProvincesData.map(item =>
        <Text> {`${item.count} orders from ${item.name}`} </Text>
      )
    )
  }

  _renderByYear = () => {
    return (
      this.state.byYearData.map((item => {
        return (
          <View>
            <Text style={styles.subHeading}>
              {`Number of Orders created in ${item.year}: ${item.count}`}
            </Text>
            {
              item.orders.map(
                (order) => {
                  const missing = 'Missing Data';
                  let name = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : missing;
                  let total = order.total_price_usd;
                  let province = order.shipping_address ? `${order.shipping_address.province}` : missing;
                  let orderNum = order.order_number;
                  return (
                    <View style={styles.singleFullContainer}>
                      <View style={styles.singleTop}>
                        <Text style={{ flex: 1 }}> {`Name: ${name}`} </Text>
                        <Text style={{ flex: 1 }}> {`Total (USD): ${total}`} </Text>
                      </View>
                      <View style={styles.singleBot}>
                        <Text style={{ flex: 1 }}> {`Province: ${province}`} </Text>
                        <Text style={{ flex: 1 }}> {`Order #: ${orderNum}`} </Text>
                      </View>
                    </View>
                  )
                }
              )
            }
          </View>
        )
      }))
    )
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigate('OrdersScreen', { orderData: this.state.byProvincesData })
              }}
            >
              <Text style={styles.header}>
                Orders By Province
        </Text>
            </TouchableOpacity>
            {
              this._renderByProvince()
            }
          </View>
          <View style={styles.categoryBot}>
            <Text style={styles.header}>
              Orders By Year
        </Text>
            {
              this._renderByYear()
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 30
  },
  categoryBot:{
    paddingTop: 5
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 25,
    paddingLeft: 10,
    paddingRight: 10
  },
  singleFullContainer: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderColor: '#d6d7da',
  },
  singleTop: {
    flexDirection: 'row',
    flex: 1
  },
  singleBot: {
    flexDirection: 'row',
    flex: 1
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 16
  }
});
