import * as Animatable from 'react-native-animatable'
import styled from 'styled-components/native'

export const ContainerHeader = Animatable.createAnimatableComponent(styled.View`
    margin-top: 5%;
    margin-bottom: 8%;
    padding-start: 5%;
    flex-direction: column;
`)