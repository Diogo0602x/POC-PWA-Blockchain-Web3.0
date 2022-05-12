import styled from 'styled-components/native';
import {Colors, InnerContainer} from '../../../components/styles';
import DropShadow from "react-native-drop-shadow";

const {brand, darkLight, primary,tertiary, secondary} = Colors;
// const deviceWidth = Math.round(Dimensions.get('window').width);

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

export const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  margin: auto;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${secondary};
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const WelcomeImage = styled.Image`
  height: 50%;
  min-width: 100%;
`;

export const PageTitleExame = styled.Text`
  font-size: 16px;
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

export const LineCard = styled.View`
  height: 1px;
  width: 100%;
  background-color: #9CA3AF;
  margin-vertical: 10px;
`;

export const CardContainer = styled.TouchableOpacity`
  width: 92%;
  border-radius: 12px;
  flex: 1;
  margin-left: 16px;
  padding-bottom: 20px;
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
  padding-right: 60px;
`;

export const CardTitle = styled.Text`
  width: 100%;
  margin-left: 15px;
  text-align: left;
  font-size: 19px;
  padding-top: 7px;
  color: #38A69D;
  font-weight: bold;
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
`;

export const ContainerPrincipal = styled.View`
  flex: 1;
  background-color: #FFF;
  padding-top: 10%
`;

export const ContainerExames = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #FFF;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 20px;
`;

export const ContainerCabecalho = styled.View`
  margin-top: 14%;
  margin-bottom: 8%;
  padding-start: 5%;
  flex-direction: row
`;
