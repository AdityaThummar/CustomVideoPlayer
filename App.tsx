import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video, {VideoRef} from 'react-native-video';

const App = () => {
  const videoRef = useRef<VideoRef>();
  console.log('🚀 ~ App ~ videoRef:', videoRef);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMute, setIsMute] = useState(false);

  useEffect(() => {
    const dimensionListner = Dimensions.addEventListener(
      'change',
      ({window}) => {
        setDimensions(window);
      },
    );
    return () => dimensionListner.remove();
  }, []);

  const Button = (props: TextProps) => {
    const {onPress, ...other} = props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Text
          {...other}
          style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        />
      </TouchableOpacity>
    );
  };

  const togglePlayer = () => {
    setIsPlaying(pre => !pre);
    isPlaying ? videoRef?.current?.pause() : videoRef?.current?.resume();
  };

  const seek = (duration, isMinus) => {
    const multiplyVal = isMinus ? -1 : 1;
    const newTime = currentTime + duration * multiplyVal;
    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const toggleVolume = () => {
    videoRef.current?.setVolume(isMute ? 1 : 0);
    setIsMute(pre => !pre);
  };

  return (
    <>
      {isLoading && <ActivityIndicator />}
      <View>
        <Video
          source={{
            uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1',
          }}
          style={{
            height: dimensions.height,
            width: dimensions.width,
            // backgroundColor: 'red',
            transform: [
              {
                rotateZ: '0deg',
              },
            ],
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          resizeMode="contain"
          paused
          ref={videoRef}
          onProgress={props => {
            setCurrentTime(props.currentTime);
          }}
        />
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            // backgroundColor: 'yellow',
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 50,
          },
        ]}>
        {!isLoading && <Button onPress={() => seek(10, true)}>-10</Button>}
        <Button onPress={togglePlayer}>{isPlaying ? 'Pause' : 'Play'}</Button>
        {!isLoading && <Button onPress={() => seek(10, false)}>+10</Button>}
      </View>
      <View>
        <Text
          style={{
            backgroundColor: 'red',
            position: 'absolute',
            bottom: 0,
          }}>
          BG Sound
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          zIndex: 2,
          bottom: 30,
          left: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30,
        }}>
        <Button onPress={toggleVolume}>BG Sound</Button>
        <Button>BG Sound</Button>
      </View>
      <View
        style={{
          backgroundColor: 'red',
          position: 'absolute',
          top: 50,
          right: 20,
        }}>
        <Text>{`${Math.floor(currentTime / 60)}:${
          parseInt(currentTime) % 60
        }`}</Text>
      </View>
    </>
  );
};

export default App;
