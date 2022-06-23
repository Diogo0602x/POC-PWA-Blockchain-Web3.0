import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {Colors} from '../../../components/styles';

const {brand, tertiary, } = Colors;

export const WelcomeContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 90px;
  margin-left:  ${marginLeft()};
`;

export const StyledFormAreaExames = styled.View`
  padding-top: 10px;
  width: 100%;
`;

export const PageTitleExame = styled.Text`
  font-size: 18px;
  text-align: left;
  font-weight: bold;
  color: ${brand};
  padding-bottom: 5px;

  ${(props) => props.welcome &&`
    font-size: 20px;
    width: 100%;
  `}
`;

export const SubTitleExame = styled.Text`
  font-size: 15px;
  margin-bottom: 5px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
  text-align: left;
  width: 100%;

  ${(props) => props.welcome &&`
  margin-bottom: 5px;
  font-weight: normal;
  font-weight: bold;
  `}
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${ brand };
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  width: 37%;
  height: 14%;
`;

export const TitleExame = styled.Text`
  font-size: 16.3px;
  text-align: left;
  font-weight: bold;
  padding-bottom: 5px;
`;

export const TextExame = styled.Text`
  font-size: 16.3px;
  text-align: left;
  padding-bottom: 5px;
`;

export const CardContainer = styled.TouchableOpacity`
    width: 90%;
    padding-bottom: 10px;
`;

export const ExamesContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const LineExame = styled.View`
  height: 1px;
  width: ${widthWeb()};
  background-color: #9CA3AF;
  margin-right:  ${marginRight()};
`;

function widthWeb() {
  if (Platform.OS === "web") {
    return "33.1%";
  }
  return "100%";
}

function marginLeft() {
  if (Platform.OS === "web") {
    return "70%";
  }
  return "10%";
}

function marginRight() {
  if (Platform.OS === "web") {
    return "66.9%"
  }
  return "0.01%";
}