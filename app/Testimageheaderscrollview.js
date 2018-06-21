import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View, Dimensions } from 'react-native';

import { Header } from 'react-navigation';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

const MIN_HEIGHT = Header.HEIGHT;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 200,
        width: Dimensions.get('window').width,
    },
});

export default class Testimageheaderscrollview extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <HeaderImageScrollView
                    maxHeight={200}
                    minHeight={MIN_HEIGHT}
                    renderHeader={() => <Image source={{uri:"bg"}} style={styles.image} />}
                    renderForeground={() =>
                        <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => console.log('tap!!')}>
                                <Text style={{ backgroundColor: 'transparent' }}>Tap Me!</Text>
                            </TouchableOpacity>
                        </View>}
                >
                    <View style={{ height: 1000 }}>
                        <TriggeringView onHide={() => console.log('text hidden')}>
                            <Text>Scroll Me!</Text>
                        </TriggeringView>
                    </View>
                </HeaderImageScrollView>
            </View>
        );
    }
}
