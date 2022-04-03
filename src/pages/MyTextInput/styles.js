import styled from 'styled-components/native';

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    containerHeader:{
        marginTop: '5%',
        marginBottom: '8%',
        paddingStart: '5%',
        flexDirection: 'column',
    },
})

export const containerHeader = styled.View`
    
`;

export const Container = styled.View`
    width: 100%;
    height: 60px;
    background: #E5E7EB;
    padding: 15px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 16px;
    height: 67px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    margin-top: 5px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
`;


export const Label = styled.Text`
    color: #1F2937;
    font-size: 16px;
`;

export const InputText = styled.TextInput`
    height: 70px;
`;
