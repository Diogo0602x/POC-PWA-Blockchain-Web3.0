import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable'

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

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-top: 28px;
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

export const ContainerForm = Animatable.createAnimatableComponent(styled.View`
  flex: 1;
  background-color: #38A69D;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding-start: 5%;
  padding-end: 5%;
`)