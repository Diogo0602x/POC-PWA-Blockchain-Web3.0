import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {Colors} from '../../../components/styles';

const {brand, tertiary, red } = Colors;

export const WelcomeContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 90px;
  margin-left: 40px;
`;

export const StyledFormAreaExames = styled.View`
  padding-top: 10px;
  width: 100%;
  align-items: ${styledArea};
`;

export const PageTitleExame = styled.Text`
  font-size: 18px;
  text-align: ${centerWeb()};
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
  text-align: ${centerWeb()};
  width: 100%;

  ${(props) => props.welcome &&`
  margin-bottom: 5px;
  font-weight: normal;
  font-weight: bold;
  `}
`;

export const ButtonExam = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  margin-right: 7%;
  width: ${buttonWeb()};
  height: 45px;
`;

export const TitleExame = styled.Text`
  font-size: 16.3px;
  text-align: ${centerWeb};
  font-weight: bold;
  padding-bottom: 5px;
`;

export const TextExame = styled.Text`
  font-size: 16.3px;
  text-align: ${centerWeb()};
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
`;

function widthWeb() {
  if (Platform.OS === "web") {
    return "37.2%";
  }
  return "100%";
}

function buttonWeb() {
  if (Platform.OS === "web") {
    return "70%";
  }
  return "42%";
}

function centerWeb() {
  if (Platform.OS === "web") {
    return "center";
  }
  return "left";
}

function styledArea() {
  if (Platform.OS === "web") {
    return "center";
  }
  return "flex-start";
}