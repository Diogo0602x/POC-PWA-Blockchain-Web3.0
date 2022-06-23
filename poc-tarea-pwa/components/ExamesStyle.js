import styled from 'styled-components/native';
import {Colors} from './styles';
import { Dimensions, Platform } from 'react-native';

const {brand, tertiary} = Colors;

const width = Dimensions.get("screen").width;

export const PageTitleExame = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: ${brand};
  padding-bottom: 5px;
  text-align: ${cardText()};

  ${(props) => props.welcome &&`
    font-size: 20px;
    width: 100%;
    text-align: ${cardText()};
  `}
`;

export const SubTitleExame = styled.Text`
  font-size: 15px;
  margin-bottom: 5px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
  text-align: ${cardText()};
  width: 100%;

  ${(props) => props.welcome &&`
  margin-bottom: 5px;
  font-weight: normal;
  font-weight: bold;
  `}
`;

export const CardContainer = styled.TouchableOpacity`
  width: ${cardWidth()};
  border-radius: 12px;
  margin-left: 5%;
  padding-bottom: 20px;
  margin-top: 1%;
  margin-bottom: 10px;
  background-color: #F8F8FF	;
  align-self: ${cardContent()};
`;

export const CardSection = styled.View`
  width: 90%;
  display: flex;
`;

export const CardSpace = styled.View`
  width: 95%;
  display: flex;
  flex-direction: row;
  padding-right: 30%;
`;

export const CardText = styled.Text`
  font-size: 15px;
  text-align: left;
  font-weight: bold;
  color: ${brand};
  padding-bottom: 5px;
`;

export const CardDescricao = styled.Text`
  font-size: 16px;
  color: #000;
  width: 100%;
  text-align: left;
  width: 100%;
`;

export const StyledFormAreaExame = styled.View`
  width: 100%;
  justify-content: center;
  align-self:center; 
  align-items: center; 
  justify-content: center; 
`;

export const ContainerCabecalho = styled.View`
  margin-top: ${bottonSize()};
  margin-bottom: ${cardMargin()};
  padding-start: 5%;
  flex-direction: row;
  flex: 1;
  width: 100%;
`;

export const Line = styled.View`
  height: 1px;
  width: ${widthWeb()};
  background-color: #9CA3AF;
  margin-vertical: 10px;
  margin-left: ${marginLeft()};
`;

function widthWeb() {
  if (Platform.OS === "web") {
    return "34%";
  }
  return "100%";
}

function marginLeft() {
  if (Platform.OS === "web") {
    return "33%";
  }
  return "0.01%";
}

function bottonSize() {
  if (width < 500) {
    return "25%";
  }
  return "5%";
}

function cardWidth() {
  if (width < 500) {
    return "92%";
  }
  return "32.5%";
}

function cardText() {
  if (width < 500) {
    return "left";
  }
  return "center";
}
function cardContent() {
  if (width < 500) {
    return "baseline";
  }
  return "center";
}

function cardMargin() {
  if (Platform.OS === "web") {
    return "5%";
  }
  return "1%";
}