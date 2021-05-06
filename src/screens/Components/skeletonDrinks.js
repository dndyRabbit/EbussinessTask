import React from 'react';
import {View, ScrollView} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {images, COLORS, SIZES} from '../../constants';

const SkeletonDrinks = () => {
  return Array.from({length: 5}).map((_, index) => (
    <View key={index} style={{marginLeft: 10, marginBottom: 10}}>
      <SkeletonPlaceholder
        backgroundColor={COLORS.primary}
        highlightColor={false}>
        <SkeletonPlaceholder.Item flexDirection="row">
          <SkeletonPlaceholder.Item
            width={130}
            height={100}
            borderRadius={6}
            marginRight={30}
          />
          <SkeletonPlaceholder.Item width={130} height={100} borderRadius={6} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  ));
};

export default SkeletonDrinks;
