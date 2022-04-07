const express = require('express');
const router = express.Router();

// mongodb user module
const User = require('./../models/User');

// Passowrd handler
const bcrypt = require('bcrypt');

// Login
router.post('/Login', (req, res) => {
  let {CNPJ, CPF, password} = req.body;
  CNPJ = CNPJ.trim();
  CPF = CPF.trim();
  password = password.trim();

  if(CPF == "" || CNPJ == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Campos vazios!"
    });
  } else {
    // Check if user exist
    User.find({CPF})
    .then(data => {
      if (data.lenght) {
        // User exists
        const hashedPassword = data[0].password;
        bcrypt.compare(password, hashedPassword).then(result => {
          if (result) {
            // Password match
            res.json({
              status: "SUCCESS",
              message: "Signin successful!",
              data: data
            })
          } else {
            res.json({
              status: "FAILED",
              mssage:"Senha inválida!"
            })
          }
        })
        .catach(err => {
          res.json({
            status: "FAILED",
            message: "Correu um erro ao comparar as senhas!"
          })
        })
      } else {
        res.json({
          status: "FAILED",
          message: "Credenciais inválidas!"
        })
      }
    })
    .catch(err => {
      res.json({
        status: "FAILED",
        message: "Ocorreu um erro enquanto enquanto checava se o usuário existia!"
      })
    })
  }
})

// Cadastro
router.post('/Cadastro', (req, res) => {
  let {CPF, password, confirmPassowrd} = req.body;
  CPF = CPF.trim();
  password = password.trim();
  confirmPassowrd = confirmPassowrd.trim();

  if(CPF == "" || password == "" || confirmPassowrd == "") {
    res.json({
      status: "FAILED",
      message: "Campos vazios!"
    });
  } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(CPF)) {
    res.json({
      status: "FAILED",
      message: "CPF inválido"
    })
  } else if (password.lenght < 8) {
    res.json({
      status: "FAILED",
      message: "Senha é muito pequena!"
    })
  } else if (confirmPassowrd != password) {
    res.json({
      status: "FAILED",
      message: "Senhas diferentes"
    })
  } else {
    // Checando se o usuário existe
    User.find({CPF}).then(result => {
      if (result.length) {
        // O usuário já existe
        res.json({
          status: "FAILED",
          message: "CPF já cadastrado"
        })
      }
    }).catch(err => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Um error ocorreu enquanto checava se o usuário existe!"
      })
    }) 
  }
})

// Cadastrar
router.post('/Cadastrar', (req, res) => {
  let {fullName, CPF, email, dateOfBirth, password, confirmPassowrd} = req.body;
  fullName = fullName.trim();
  CPF = CPF.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();
  confirmPassowrd = confirmPassowrd.trim();

  if(fullName == "" || CPF == "" || email == ""|| dateOfBirth == "" || password == "" || confirmPassowrd == "") {
    res.json({
      status: "FAILED",
      message: "Campos vazios!"
    });
  } else if (!/^[a-zA-Z]*$/.test(fullName)) {
    res.json({
      status: "FAILED",
      message: "Nome inválido"
    })
  } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(CPF)) {
    res.json({
      status: "FAILED",
      message: "CPF inválido"
    })
  }else if (new Date(dateOfBirth).getTime()) {
    res.json({
      status: "FAILED",
      message: "Data de nascimento inválida"
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered"
    })
  } else if (password.lenght < 8) {
    res.json({
      status: "FAILED",
      message: "Senha é muito pequena!"
    })
  } else if (confirmPassowrd != password) {
    res.json({
      status: "FAILED",
      message: "Senhas diferentes"
    })
  } else {
    // Checando se o usuário existe
    User.find({CPF}).then(result => {
      if (result.length) {
        // O usuário já existe
        res.json({
          status: "FAILED",
          message: "CPF já cadastrado"
        })
      } else {
        // Tenta criar novo usuário

        // Manuseio de senha
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds).then(hashedPassword => {
          const newUser = new User({
            fullName,
            CPF,
            email,
            dateOfBirth,
            password: hashedPassword,
            confirmPassowrd,
          });
          
          newUser.save().then(result => {
            res.json({
              status: "SUCCESS",
              message: "Cadastro realizado com sucesso",
              data: result,
            })
          })
          .catch(err => {
            res.json({
              status: "FAILED",
              message: "Ocorrou um erro enquanto cadastrava sua conta!"
            })
          })
        })
        .catch(err => {
            res.json({
              status: "FAILED",
              message: "Ocorreu um erro ao fazer o hash da senha!"
            })
        })
      }
    }).catch(err => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Um error ocorreu enquanto checava se o usuário existe!"
      })
    }) 
  }
})

module.exports = router;