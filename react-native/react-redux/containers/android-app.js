'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Easing,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import CircularTimer from '../components/circular-timer'
import * as actions from '../actions/creators'

const FPS = 10

function zeroPadding (n) {
    return ('0' + n.toString()).slice(-2)
}

class App extends Component {
    constructor (props) {
        super(props)
        this.angle = new Animated.Value(0)
    }

    start () {
        const { actions } = this.props
        actions.start()
        this.intervalId = setInterval(actions.sync, 1000 / FPS)
    }

    stop () {
        const { actions } = this.props
        actions.stop()
        clearInterval(this.intervalId)
    }

    get iconName () {
        return this.props.state.running ? 'play': 'pause'
    }
    get iconColor () {
        return this.props.state.running ? '#222222' : '#777777'
    }
    //TODO: disable the reset button when timer is runnning
    get resetButtonColor () {
        return this.props.state.running ? '#aaaaaa' : '#aaaaaa'
    }
    get toggleButtonColor () {
        return this.props.state.running ? '#ea5432' : '#5db7e8'
    }
    get toggleButtonText () {
        return this.props.state.running ? 'Stop': 'Start'
    }

    componentDidMount() {
        // this._animate()
    }

    _animate() {
        this.angle.setValue(0)
        this.animation = Animated.timing(this.angle, {
            toValue: 360,
            duration: 60000,
            easing: Easing.linear,
        }).start(() => this._animate())
    }

    get remainingText () {
        const { state } = this.props
        const total = state.timer.total
        const progress = state.progress
        const remaining = (total * (1 - progress)) / 1000
        const remainingMinutes = Math.floor(remaining / 60)
        const remainingSeconds = Math.floor(remaining % 60)
        return zeroPadding(remainingMinutes) + ':' + zeroPadding(remainingSeconds)
    }

    render () {
        const { state, actions } = this.props
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <View style={styles.rec}>
                        <Image
                            source={require('../../resources/images/hex_logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.setting}>Setting</Text>
                    </View>
                </View>
                <View style={styles.timer}>
                    <Animated.Image
                        source={require('../../resources/images/hex_base.png')}
                        style={[styles.hex, {transform: [{
                            rotate: this.angle.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg'],
                            })
                        }]}]}
                    />
                    <Text style={styles.icon}>
                        <Icon
                            name={this.iconName}
                            size={40}
                            color={this.iconColor}
                        />
                    </Text>
                    <Text style={styles.text}>{this.remainingText}</Text>
                </View>
                <View style={styles.buttons}>
                    <View style={styles.button}>
                        <TouchableHighlight onPress={actions.reset}>
                            <Text style={[styles.resetButton, {backgroundColor: this.resetButtonColor}]}>Reset</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.button}>
                        <TouchableHighlight onPress={() => state.running ? this.stop(): this.start()}>
                            <Text style={[styles.toggleButton, {backgroundColor: this.toggleButtonColor}]}>{this.toggleButtonText}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        backgroundColor: '#eeeeee',
    },
    timer: {
        flex: 5,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    icon: {
        top: -240,
        alignSelf: 'center',
        textAlign: 'center',
    },
    text: {
        top: -220,
        fontSize: 64,
        fontFamily: 'avenir',
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
    },
    hex: {
        alignSelf: 'flex-start',
        width: 300,
        height: 300,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
    },
    button: {
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        flex: 1,
    },
    resetButton: {
        height: 100,
        paddingTop: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#eeeeee',
        fontSize: 40,
        fontFamily: 'avenir',
        fontWeight: 'bold',
    },
    toggleButton: {
        height: 100,
        paddingTop: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#eeeeee',
        fontSize: 40,
        fontFamily: 'avenir',
        fontWeight: 'bold',
    },
    topView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    logo: {
        left: 20,
        top: 10,
        alignSelf: 'flex-start',
        width: 50,
        height: 50,
    },
    rec: {
        left: 40,
        top: 20,
        width: 250,
        height: 70,
        backgroundColor: '#444',
        flexDirection: 'row',
        borderRadius: 35
    },
    setting: {
        left: 30,
        fontFamily: 'avenir',
        color: '#fff',
        fontSize: 35,
        alignSelf: 'center'
    }
})


export default connect(state => ({
    state: state.timer
}), dispatch => ({
    actions: bindActionCreators(actions, dispatch)
}))(App)
