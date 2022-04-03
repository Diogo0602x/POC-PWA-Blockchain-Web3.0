import React, {useState} from 'react';

import {Octicons, Ionicons} from '@expo/vector-icons';

import {
    LeftIcon,
    RightIcon,
    StyledTextInput,
    StyledInputLabel,
    Colors 
  } from '../../../components/styles';

import { Container, Label, InputText } from './styles'
const {brand, darkLight} = Colors;

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (
        <>
        <Label>{label}</Label>
        <Container>
            <LeftIcon>
              <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                  <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} height={5} />
                </RightIcon>
            ) }
        </Container>
      </>
    );
  };


export default MyTextInput