import styled from 'styled-components/native';
import {Colors} from '../../../components/styles';
import { Dimensions } from 'react-native';

const {brand, tertiary} = Colors;

const width = Dimensions.get("screen").width;

export const PageTitleExame = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: ${brand};
  padding-bottom: 5px;
  text-align: ${cardText()}

  ${(props) => props.welcome &&`
    font-size: 20px;
    width: 100%;
    text-align: left;
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

export const CardContainer = styled.TouchableOpacity`
  width: ${cardWidth()};
  border-radius: 12px;
  margin-left: 5%;
  padding-bottom: 20px;
  margin-top: 1%;
  margin-bottom: 10px;
  background-color: #F8F8FF	;
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
  width: 100%
  text-align: left
  width: 100%;
`;

export const ContainerCabecalho = styled.View`
  margin-top: ${bottonSize()};
  margin-bottom: 8%;
  padding-start: 5%;
  flex-direction: row
  flex: 1;
  width: 100%;
`;

function bottonSize() {
  if (width < 400) {
    return "25%";
  }
  return "5%";
}

function cardWidth() {
  if (width < 400) {
    return "92%";
  }
  return "20%";
}

function cardText() {
  if (width < 400) {
    return "center";
  }
  return "";
}