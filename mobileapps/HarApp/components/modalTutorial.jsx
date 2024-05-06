import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

// Import Style Components
import { Title1, Subhead, Title2 } from './typography';

// Import Componets
import CustomModal from './modal';

// import images
const image1 = require('../assets/tutorial_1.gif');

const TutorialData = [
  {
    header: 'Marking Bins as Full',
    description:
      'See how to mark a bin as full with a simple swipe at the siding.',
    image: '',
  },
  {
    header: 'Quick Swipe Actions for Bin Reports',
    description:
      'Learn how to swipe to report missing, damaged, or burnt bins with this easy tutorial.',
    image: image1,
  },
  {
    header: 'Add Bins with Camera',
    description:
      'Discover how to use your camera to add a bin to the siding in just a few taps.',
    image: '',
  },
];

const ModalTutorial = ({ isVisable, setIsVisable }) => {
  const pagerViewRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = (pageIndex) => {
    pagerViewRef.current?.setPage(pageIndex);
  };

  return (
    <CustomModal
      isVisible={isVisable}
      onClose={() => setIsVisable(false)}
      style={styles.modalStyle}
    >
      <View
        style={{
          width: '100%',
          gap: 16,
        }}
      >
        <Title1>Master The App</Title1>

        {/* Carousel  */}
        <PagerView
          style={styles.pagerViewStyle}
          initialPage={0}
          ref={pagerViewRef}
          onPageSelected={(e) => setActiveSlide(e.nativeEvent.position)}
        >
          {TutorialData.map((item, index) => (
            <View
              style={{
                paddingHorizontal: 16,
              }}
              key={index}
            >
              <Title2>{item.header}</Title2>
              <Subhead style={{ paddingBottom: 16 }}>
                {item.description}
              </Subhead>
              <View style={styles.imageContainer}>
                {item.image && (
                  <Image
                    source={item.image}
                    style={styles.image}
                  />
                )}
              </View>
            </View>
          ))}
        </PagerView>

        {/* Dot Container */}
        <View style={styles.dotContainer}>
          {TutorialData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                activeSlide === index ? styles.activeDot : styles.inactiveDot,
              ]}
              onPress={() => goToSlide(index)}
              accessible={true}
              accessibilityLabel={`Go to slide ${index + 1}`}
            />
          ))}
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    width: '80%',
  },
  pagerViewStyle: {
    minHeight: 480,
  },
  imageContainer: {
    borderRadius: 10,
    aspectRatio: '3/4',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 5,
    marginHorizontal: 12,
  },
  activeDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
});

export default ModalTutorial;
