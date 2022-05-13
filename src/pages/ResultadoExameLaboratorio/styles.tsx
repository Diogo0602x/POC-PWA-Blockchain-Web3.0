import styled from 'styled-components/native';
import {Colors} from '../../../components/styles';
import { Dimensions } from 'react-native';

const width = Dimensions.get("screen").width;
const {brand, tertiary, } = Colors;

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
  align-items: ${cardContent()};
`;

function cardContent() {
  if (width < 400) {
    return "baseline";
  }
  return "center";
}