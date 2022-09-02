import React, { useContext, useState } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from '../containers/custom_package/react-native-image-zoom-viewer';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import themeStyle from '../styles/theme';
import { ThemeContext } from '../utils/ThemeManager';

const SingleImageView = (props: any) => {
    const { imgDisplay } = props.route.params;
    const { theme }: any = useContext(ThemeContext);
    const [images, setImages] = useState<any>([{ url: imgDisplay }])
    return (
        <BaseComponent {...baseComponentData} title=''>
            {images.length === 0 ? null : (
                <ImageViewer
                    imageUrls={images}
                    renderImage={(image: any) => {
                        return (
                            <FastImage
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: ' 100%', width: '100%' }}
                                source={{ uri: image.source.uri }} />
                        );
                    }}

                    enablePreload={true}
                    saveToLocalByLongPress={false}

                />
            )}
        </BaseComponent>
    )
}

export default SingleImageView

const styles = StyleSheet.create({
})
