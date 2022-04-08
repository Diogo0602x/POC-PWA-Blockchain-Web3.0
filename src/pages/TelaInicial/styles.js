import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable'
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;
// colors
export const Colors = {
  primary: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#1F2937',
  darklight: '#9CA3AF',
  brand: '#38A69D',
  green: '#10B981',
  red: '#EF4444',
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const ContainerLogo = styled.View`
  flex: 2;
  background-color: #FFF;
  justify-content: center;
  align-items: center;
`;

export const ContainerForm = Animatable.createAnimatableComponent(styled.View`
  flex: 1;
  backgroundColor: #38A69D;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding-start: 5%;
  padding-end: 5%;
`)

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-top: 28px
  margin-bottom: 12px;
  color: #FFF;
`;

export const SubTitle = styled.Text`
  color: #FFF;
  font-size: 17px;
`;

export const Button = styled.TouchableOpacity`
  position: absolute;
  background-color: #FFF;
  border-radius: 50px;
  padding: 8px 0;
  width: 60%;
  align-self: center;
  bottom: 9%;
  align-items: center;
  justify-content: center;
`;

export const Acessar = styled.Text`
  font-size: 18px;
  color: #38A69D;
  font-weight: bold;
`;